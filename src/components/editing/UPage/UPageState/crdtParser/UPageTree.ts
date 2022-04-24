import { bool, JSObject, num, SetStr, SetStrs, str, strs } from '../../../../../utils/types'
import { isObj, safe } from '../../../../../utils/utils'
import {
  getDefaultData,
  isFlat,
  isSelectableBlock,
  isTrueUFileBlock,
  isUFormBlock,
  isUHeaderBlock,
  isUListBlock,
  isUTextBlock,
  mayContainPages,
  turnUBlockData,
  UBlock,
  UBlockContext,
  UBlockData,
  UBlocks,
  UBlockType,
  UFormData,
  UGridData,
  UListData,
  UListItem,
  UPageBlockData,
  WithUBlocks,
} from '../../ublockTypes'
import { TOCs } from '../types'
import { UPageRawChanges } from './UPageStateCR'
import { UPageTreeStructureChanger } from './UPageTreeChanger'
import { isUBlockInOpenNode } from './ulistManagement'
import { DeleteFiles, FileInfos } from '../../../UFile/FileUploader'

export type OnPageAdded = (newPageId: str, underId: str) => void
export type OnPagesDeleted = (ids: strs, o?: { moveTo?: str }) => void

export class UPageTree {
  #idAndBlock: IdAndBlock
  #idAndParent: IdAndBlock
  #bfsRoute: UBlocks

  #data: WithUBlocks

  #changer: UPageTreeStructureChanger
  #getId: GetId
  #onPageAdded: OnPageAdded
  #onPagesDeleted: OnPagesDeleted // TODO: delete page when it is turned into something else
  #onUFilesDeleted: DeleteFiles

  constructor(
    data: WithUBlocks,
    getId: GetId,
    onPageAdded: OnPageAdded,
    onPagesDeleted: OnPagesDeleted,
    onUFilesDeleted: DeleteFiles,
  ) {
    const { idAndBlock, idAndParent, bfsRoute } = bfsUPage(data)
    this.#idAndBlock = idAndBlock
    this.#idAndParent = idAndParent
    this.#bfsRoute = bfsRoute
    this.#data = data
    this.#changer = new UPageTreeStructureChanger(this, getId)
    this.#getId = getId
    this.#onPageAdded = onPageAdded
    this.#onPagesDeleted = onPagesDeleted
    this.#onUFilesDeleted = onUFilesDeleted
  }

  get bfs(): UBlocks {
    return this.#bfsRoute
  }

  context = (id: str): UBlockContext => {
    const parent = this.getParent(id)
    if (parent.type === 'exercise') return 'uform'
    return 'upage'
  }

  deriveTOC = (): TOCs => {
    const r = [] as TOCs
    this.#bfsRoute.forEach((b) => {
      if (isUHeaderBlock(b.type)) r.push({ id: b.id, type: b.type, data: b.data as str })
      else if (b.type === 'exercise') r.push({ id: b.id, type: b.type, data: (b.data as { name: str }).name })
    })
    return r
  }

  getAllSelectableBlockIds = (): strs => {
    return this.#bfsRoute.filter((block) => isSelectableBlock(block.type)).map((b) => b.id)
  }

  getData = (id: str): UBlockData => safe(this.#idAndBlock.get(id)).data
  getUBlock = (id: str): UBlock => (id === 'r' ? this.#r() : safe(this.#idAndBlock.get(id)))
  getParent = (id: str): UBlock => this.#idAndParent.get(id) || this.#r()
  getUnsafeUBlock = (id: str): UBlock | undefined => (id === 'r' ? this.#r() : this.#idAndBlock.get(id))

  getLastId = (parentId = 'r'): str => {
    if (parentId === 'r') {
      if (this.#bfsRoute.length) return safe(this.#bfsRoute.at(-1)).id
      return ''
    }

    const parent = safe(this.#idAndBlock.get(parentId))
    if (parent.type !== 'exercise') throw new Error('This parent is not supported')

    const data = parent.data as UFormData
    if (!data.ublocks.length) return ''
    return safe(data.ublocks.at(-1)).id
  }

  hasUTextBefore = (id: str): bool => !!this.#getUTextBefore(id)
  hasUTextAfter = (id: str): bool => !!this.#getUTextAfter(id)
  getUTextBefore = (id: str): UBlock => safe(this.#getUTextBefore(id))
  getUTextAfter = (id: str): UBlock => safe(this.#getUTextAfter(id))

  moveFocusUp = (id = ''): str => {
    if (!id) return this.#getLastUText()?.id || 'title'
    return this.#getUTextBefore(id)?.id || 'title'
  }
  moveFocusDown = (id = ''): str => {
    if (!id) return this.#getFirstUText()?.id || 'factory'
    return this.#getUTextAfter(id)?.id || 'factory' // TODO: handle UForm factory
  }

  isNotNested = (id: str): bool => {
    let block = this.getUBlock(id)
    if (!isFlat(block.type)) return false

    while (this.#idAndParent.get(block.id)) {
      block = this.getUBlock(safe(this.#idAndParent.get(block.id)).id)
      if (!isFlat(block.type)) return false
    }

    return true
  }

  isInList = (id: str): bool => isUListBlock(this.getParent(id)?.type) // list cannot contain forms or grids

  getListsAround = (id: str, type?: UBlockType) => {
    const i = this.#bfsRoute.findIndex((b) => b.id === id)
    const matchType = type ? (t: UBlockType) => t === type : isUListBlock

    let listAboveId = ''
    if (i > 0) {
      const prevBlock = this.#bfsRoute[i - 1]
      if (matchType(prevBlock.type)) listAboveId = prevBlock.id
      else if (this.isInList(prevBlock.id)) {
        const list = this.getParent(prevBlock.id)
        if (matchType(list.type)) listAboveId = list.id
      }
    }

    let listBelowId = ''
    if (i < this.#bfsRoute.length - 1) {
      const nextBlock = this.#bfsRoute[i + 1]
      if (matchType(nextBlock.type)) listBelowId = nextBlock.id
      else if (this.isInList(nextBlock.id)) {
        const list = this.getParent(nextBlock.id)
        if (matchType(list.type)) listBelowId = list.id
      }

      if (listBelowId === listAboveId) listBelowId = ''
    }

    return { listAboveId, listBelowId }
  }

  hasGridParent = (id: str) => this.#idAndParent.get(id)?.type === 'grid'

  addBlock = (underId: str, type: UBlockType, setNewId: SetStr): UPageRawChanges => {
    if (isUListBlock(type)) {
      const block: UBlock = { id: this.#getId(), type: 'text', data: '' }
      setNewId(block.id)
      return this.createList(block, underId, type)
    }

    const block: UBlock = { id: this.#getId(), data: getDefaultData(type), type }

    this.#handleNewPage(block)

    setNewId(block.id)

    return this.#insert([block], underId, this.getParent(underId).id)
  }

  remove = (ids: strs, { moveTo = '' } = {}): UPageRawChanges => {
    ids = [...new Set(ids)] // deletes extra nodes if id is duplicated
    const upages = this.#getUPagesForDeletion(ids)
    if (upages.length) this.#onPagesDeleted(upages, { moveTo })
    const deletedFileInfos = this.#getFileInfoForDeletion(ids)
    if (deletedFileInfos.length) this.#onUFilesDeleted(deletedFileInfos)
    return this.#changer.remove(ids)
  }
  rearrange = (underId: str, ids: strs): UPageRawChanges => this.#changer.rearrange(underId, ids)

  moveLeft = (id: str, { deleteMark = false } = {}): UPageRawChanges => this.#changer.moveLeft(id, { deleteMark })
  moveRight = (id: str, o: { mergeWithType?: UBlockType } = {}): UPageRawChanges => this.#changer.moveRight(id, o)

  createGrid = (droppedOn: str, columnIds: strs, side: 'left' | 'right'): UPageRawChanges =>
    this.#changer.createGrid(droppedOn, columnIds, side)

  turnIntoList = (ublock: UBlock, type: UBlockType): UPageRawChanges => this.#changer.turnIntoList(ublock, type)
  createList = (newUBlock: UBlock, underId: str, type: UBlockType): UPageRawChanges => {
    const parent = this.getParent(underId)
    if (isUListBlock(parent.type)) throw new Error('Cannot create list in list') // TODO: handle somehow
    return this.#changer.createList(newUBlock, type, underId, parent.id)
  }

  change = (id: str, newData: Partial<UBlockData>): UPageRawChanges => {
    const block = this.getUBlock(id)
    if (isObj(block.data)) newData = { ...(block.data as JSObject), ...(newData as JSObject) } // it preserves original order of keys -> less CR changes
    block.data = newData as str // as str - to hack ts
    return [{ t: 'change', id, data: newData as UBlockData, addPreview: true }]
  }

  onUTextTab = (id: str, data: str): UPageRawChanges => this.#changer.onUTextTab(id, data)
  onUTextShiftTab = (id: str, data: str): UPageRawChanges => this.#changer.onUTextShiftTab(id, data)

  onUTextBackspace = (id: str, data: str, setFocus: (id: str, xOffset?: num) => void): UPageRawChanges =>
    this.#changer.onUTextBackspace(id, data, setFocus)
  onUTextEnter = (dataAbove: str, dataBelow: str, underId: str, setFocus: SetStr): UPageRawChanges =>
    this.#changer.onUTextEnter(dataAbove, dataBelow, underId, setFocus)

  onUTextPaste = (id: str, parentId: str, data: str, type: UBlockType, setIds: SetStrs): UPageRawChanges =>
    this.#changer.onUTextPaste(id, parentId, data, type, setIds)

  changeType = (id: str, type: UBlockType, data?: UBlockData): UPageRawChanges => {
    const r = [] as UPageRawChanges
    const block = this.getUBlock(id)

    const doNotUpdateData = isUFormBlock(type) && !isUFormBlock(block.type)
    const updateData = data !== undefined && !doNotUpdateData && block.data !== data
    if (updateData) r.push(...this.change(id, data))

    if (isUListBlock(type)) {
      if (this.isInList(id)) throw new Error('Cannot change type to list in list')

      const moveChanges = this.moveRight(id, { mergeWithType: type })
      // move succeeded
      if (moveChanges.length) r.push(...moveChanges)
      // move failed - create a block
      else this.#changer.turnIntoList(block, type)

      return r
    }

    if (hasSrc(block)) this.#onUFilesDeleted([{ blockId: block.id, src: (block.data as { src: str }).src }])

    const newData = updateData ? data : turnUBlockData(type, block.data) // data was updated
    block.type = type
    block.data = newData

    this.#handleNewPage(block)

    r.push({ t: 'change-type', data: newData, id, type })
    return r
  }

  getAllFileInfos = (): FileInfos => this.#getAllFileInfos(this.#bfsRoute)

  #insert = (ublocks: UBlocks, underId: str, parentId: str): UPageRawChanges =>
    this.#changer.insert(ublocks, underId, parentId)

  #getUPagesForDeletion = (selectedIds: strs): strs => {
    // TODO: when deleted page is opened show a snack with warning
    const pages = selectedIds
      .map((id) => {
        const block = this.getUBlock(id)
        if (block.type === 'page') return (block.data as UPageBlockData).id
      })
      .filter(Boolean) as strs
    return [...pages, ...this.#getPagesIn(selectedIds)]
  }

  #getFileInfoForDeletion = (ids: strs) => this.#getAllFileInfos(ids.map((id) => this.getUBlock(id)))

  #getAllFileInfos = (ublocks: UBlocks): FileInfos => {
    const r = [] as FileInfos
    ublocks.forEach((b) => {
      if (!hasSrc(b)) return

      const data = b.data as { src: str }
      r.push({ blockId: b.id, src: data.src })
    })
    return r
  }

  #getUPageIdBefore = (underId: str): str => (this.#getUPageBefore(underId)?.data as UPageBlockData)?.id || ''
  #getUPageBefore = (id: str): UBlock | undefined => {
    let i = this.#bfsRoute.findIndex((b) => b.id === id) - 1
    for (; i >= 0; i--) {
      if (this.#bfsRoute[i].type === 'page') return this.#bfsRoute[i]
    }
  }

  #getFirstUText = (): UBlock | undefined => {
    let i = 0
    for (; i < this.#bfsRoute.length; i++) {
      if (isUTextBlock(this.#bfsRoute[i].type)) return this.#bfsRoute[i]
    }
  }

  #getLastUText = (): UBlock | undefined => {
    let i = this.#bfsRoute.length - 1
    for (; i >= 0; i--) {
      if (isUTextBlock(this.#bfsRoute[i].type) && this.#isOpen(i)) return this.#bfsRoute[i]
    }
  }

  #getUTextBefore = (id: str): UBlock | undefined => {
    let i = this.#bfsRoute.findIndex((b) => b.id === id) - 1
    for (; i >= 0; i--) {
      if (isUTextBlock(this.#bfsRoute[i].type) && this.#isOpen(i)) return this.#bfsRoute[i]
    }
  }

  #getUTextAfter = (id: str): UBlock | undefined => {
    let i = this.#bfsRoute.findIndex((b) => b.id === id) + 1
    for (; i < this.#bfsRoute.length; i++) {
      if (isUTextBlock(this.#bfsRoute[i].type) && this.#isOpen(i)) return this.#bfsRoute[i]
    }
  }

  #r = (): UBlock => ({ id: 'r', data: { ublocks: this.#data.ublocks }, type: 'r' })
  #isOpen = (i: num): bool => {
    const block = this.#bfsRoute[i]
    const parent = this.getParent(block.id)
    if (parent.type !== 'toggle-list') return true

    return isUBlockInOpenNode(parent.data as UListData, block.id)
  }

  #isParent = (id: str): bool => mayContainPages(this.getUBlock(id).type)
  #getPagesIn = (ids: strs): strs => {
    ids = ids.filter(this.#isParent)
    return bfsUBlocks(ids.map(this.getUBlock))
      .filter((b) => b.type === 'page')
      .map((b) => {
        const d = b.data as UPageBlockData
        return d.id
      })
  }

  #handleNewPage = (block: UBlock) => {
    if (block.type === 'page') {
      const newPageId = this.#getId({ long: true })
      block.data = { id: newPageId }
      this.#onPageAdded(newPageId, this.#getUPageIdBefore(block.id))
    }
  }
}

const hasSrc = (b: UBlock) => isTrueUFileBlock(b.type) && (b.data as { src: str }).src

type IdAndBlock = Map<str, UBlock>
type GetId = (o?: { long?: bool }) => str

function dfsUList(node: UListItem) {
  function dfs(node: UListItem) {
    const r = [node]
    // if (!node.children || (type === 'toggle-list' && !node.$isOpen)) return r
    if (!node.children) return r
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      r.push(...dfs(child))
    }
    return r
  }

  return dfs(node)
}

function bfsUPage(data: WithUBlocks) {
  const bfsRoute = [] as UBlocks
  const idAndBlock: IdAndBlock = new Map()
  const idAndParent: IdAndBlock = new Map()

  const queue: UBlocks = [...data.ublocks]

  while (queue.length) {
    const node = safe(queue.shift())
    bfsRoute.push(node)
    const { type } = node
    if (type === 'exercise') {
      const blocks = (node.data as UFormData).ublocks
      blocks.forEach((b) => idAndParent.set(b.id, node))
      queue.unshift(...blocks)
    } else if (isUListBlock(type)) {
      const data = node.data as UListData
      const listBlocks = data
        .map((item) => dfsUList(item))
        .flat()
        .map((item) => {
          idAndParent.set(item.ublock.id, node) // all blocks inside a list are its children
          return item.ublock
        })

      listBlocks.forEach((b) => idAndBlock.set(b.id, b))
      queue.unshift(...listBlocks)
    } else if (type === 'grid') {
      const blocks = (node.data as UGridData).map((c) => c.ublocks).flat()
      blocks.forEach((b) => idAndParent.set(b.id, node))
      queue.unshift(...blocks)
    }

    idAndBlock.set(node.id, node)
  }

  return { idAndBlock, idAndParent, bfsRoute }
}

export function bfsUBlocks(ublocks: UBlocks): UBlocks {
  const r = [] as UBlocks

  const queue: UBlocks = [...ublocks]

  while (queue.length) {
    const node = safe(queue.shift())
    r.push(node)
    const { type } = node
    if (type === 'exercise') {
      queue.unshift(...(node.data as UFormData).ublocks)
    } else if (isUListBlock(type)) {
      const data = node.data as UListData
      const listBlocks = data
        .map((item) => dfsUList(item))
        .flat()
        .map((item) => item.ublock)
      queue.unshift(...listBlocks)
    } else if (type === 'grid') {
      queue.unshift(...(node.data as UGridData).map((c) => c.ublocks).flat())
    }
  }

  return r
}

export function getUBlocksParents(ublocks: UBlocks): IdAndBlock {
  const idAndParent: IdAndBlock = new Map()

  const queue: UBlocks = [...ublocks]

  while (queue.length) {
    const node = safe(queue.shift())

    const { type } = node
    if (type === 'exercise') {
      const blocks = (node.data as UFormData).ublocks
      blocks.forEach((b) => idAndParent.set(b.id, node))
      queue.unshift(...blocks)
    } else if (isUListBlock(type)) {
      const data = node.data as UListData
      const listBlocks = data
        .map((item) => dfsUList(item))
        .flat()
        .map((item) => {
          idAndParent.set(item.ublock.id, node) // all blocks inside a list are its children
          return item.ublock
        })
      queue.unshift(...listBlocks)
    } else if (type === 'grid') {
      const blocks = (node.data as UGridData).map((c) => c.ublocks).flat()
      blocks.forEach((b) => idAndParent.set(b.id, node))
      queue.unshift(...blocks)
    }
  }

  return idAndParent
}
