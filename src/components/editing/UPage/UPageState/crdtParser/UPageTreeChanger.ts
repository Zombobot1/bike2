import { safeSplit } from '../../../../../utils/algorithms'
import { str, bool, GetStr, strs, num, SetStr, SetStrs } from '../../../../../utils/types'
import { isStr, safe } from '../../../../../utils/utils'
import { replaceAllCodeToNothing } from '../../../../utils/Selection/htmlAsStr'
import {
  isUListBlock,
  RootData,
  UBlock,
  UBlockData,
  UBlocks,
  UBlockType,
  UFormData,
  UMediaFileData,
} from '../../ublockTypes'
import { UPageRawChanges } from './UPageStateCR'
import { UGridChanger } from './gridManagement'
import { UListChanger } from './ulistManagement'

interface Tree {
  isNotNested: (id: str) => bool
  isInList: (id: str) => bool
  getParent: (id: str) => UBlock
  getUBlock: (id: str) => UBlock
  getListsAround: (id: str, type?: UBlockType) => { listBelowId?: str; listAboveId?: str }

  getUTextBefore: (id: str) => UBlock | undefined
}

export class UPageTreeStructureChanger {
  #tree: Tree
  #getId: GetStr
  #listChanger: UListChanger
  #gridChanger: UGridChanger

  constructor(tree: Tree, getId: GetStr) {
    this.#tree = tree
    this.#getId = getId
    this.#listChanger = new UListChanger(tree, getId)
    this.#gridChanger = new UGridChanger(tree, getId)
  }

  insert = (ublocks: UBlocks, underId: str, parentId: str): UPageRawChanges => this.#insert(ublocks, underId, parentId)
  remove = (ids: strs): UPageRawChanges => this.#delete(ids)

  rearrange = (underId: str, ids: strs): UPageRawChanges => {
    const changes = [] as UPageRawChanges
    const blocks = ids.map((id) => this.#tree.getUBlock(id))
    changes.push(...this.#delete(ids, { skipDeletion: true }))
    changes.push(...this.#insert(blocks, underId, this.#tree.getParent(underId).id, { skipInsertion: true }))
    return changes
  }

  moveLeft = (id: str, { deleteMark = false } = {}): UPageRawChanges => {
    const move = this.#listChanger.moveLeft(id, { deleteMark })
    if (move.status === 'failed') return []

    const changes = [] as UPageRawChanges

    if (move.blockBelow) {
      const blockBelowNewParent = this.#tree.getParent(move.updatedList.id).id
      const underId = move.updatedList.id // even if it is deleted
      const o = { skipInsertion: true }
      changes.push(...this.#insert([move.blockBelow], underId, blockBelowNewParent, o))

      if (move.listBelow) {
        changes.push(...this.#insert([move.listBelow], move.blockBelow.id, blockBelowNewParent, o))
      }
    }

    if (move.deletedId) changes.push(...this.#delete([move.deletedId]))
    else changes.push({ t: 'change', id: move.updatedList.id, data: move.updatedList.data })

    return changes
  }

  moveRight = (id: str, o: { mergeWithType?: UBlockType } = {}): UPageRawChanges => {
    const move = this.#listChanger.moveRight(id, o)
    if (move.status === 'failed') return []

    const changes = [] as UPageRawChanges

    if (move.deletedIds) changes.push(...this.#delete(move.deletedIds, { skipDeletion: true }))
    changes.push({ t: 'change', id: move.updatedList.id, data: move.updatedList.data })

    return changes
  }

  createGrid = (droppedOn: str, columnIds: strs, side: 'left' | 'right'): UPageRawChanges => {
    if (this.#tree.isNotNested(droppedOn)) {
      const changes = [...this.#delete(columnIds, { skipDeletion: true })]
      const grid = this.#gridChanger.create(droppedOn, columnIds, side)

      changes.push(...this.#replaceWithNew(droppedOn, grid))
      return changes
    }

    return this.#createColumn(droppedOn, columnIds, side)
  }

  turnIntoList = (ublock: UBlock, type: UBlockType): UPageRawChanges => {
    const list = this.#listChanger.create(ublock, type)
    return this.#replaceWithNew(ublock.id, list)
  }

  createList = (newUBlock: UBlock, type: UBlockType, underId: str, parentId: str): UPageRawChanges => {
    const list = this.#listChanger.create(newUBlock, type)
    return this.#insert([list], underId, parentId)
  }

  onUTextTab = (id: str, data: str): UPageRawChanges => {
    const block = this.#tree.getUBlock(id)
    const changes = this.moveRight(id)
    if (changes.length && block.data !== data) {
      block.data = data
      changes.push({ t: 'change', data, id })
    }
    return changes
  }

  onUTextShiftTab = (id: str, data: str): UPageRawChanges => {
    const block = this.#tree.getUBlock(id)
    const changes = this.moveLeft(id)
    if (changes.length && block.data !== data) {
      block.data = data
      changes.push({ t: 'change', data, id })
    }
    return changes
  }

  onUTextBackspace = (id: str, data: str, setFocus: (id: str, xOffset?: num) => void): UPageRawChanges => {
    const block = this.#tree.getUBlock(id)
    const isInList = this.#tree.isInList(id)

    if (isInList) {
      const changes = this.moveLeft(id, { deleteMark: true })
      if (changes.length && block.data !== data) {
        block.data = data
        changes.push({ t: 'change', data, id })
      }
      return changes
    }

    const prevBlock = this.#tree.getUTextBefore(id)
    if (!prevBlock && !data) {
      setFocus('', -1)
      return this.remove([id]) // do not remove not empty block
    }

    if (prevBlock) {
      const changes = [] as UPageRawChanges

      if (data) {
        if (isStr(prevBlock.data)) {
          const newData = prevBlock.data + data
          prevBlock.data = newData
          changes.push({ t: 'change', id: prevBlock.id, data: newData })
        } else {
          const prevData = prevBlock.data as { text: str }
          prevData.text += data
          changes.push({ t: 'change', id: prevBlock.id, data: prevData as UBlockData })
        }

        setFocus(prevBlock.id, replaceAllCodeToNothing(data).length)
      } else setFocus(prevBlock.id)

      changes.push(...this.#delete([id]))
      return changes
    }

    return [] // block is last and not empty - do nothing
  }

  onUTextEnter = (dataAbove: str, dataBelow: str, underId: str, setFocus: SetStr): UPageRawChanges => {
    const newTextBelow: UBlock = { id: this.#getId(), data: dataBelow, type: 'text' }
    const changes = this.insert([newTextBelow], underId, this.#tree.getParent(underId).id)

    const prevBlock = this.#tree.getUBlock(underId)
    if (isStr(prevBlock.data)) {
      if (prevBlock.data !== dataAbove) {
        prevBlock.data = dataAbove
        changes.push({ t: 'change', id: prevBlock.id, data: dataAbove })
      }
    } else {
      const prevData = prevBlock.data as { text: str }
      if (prevData.text !== dataAbove) {
        prevData.text = dataAbove
        changes.push({ t: 'change', id: prevBlock.id, data: prevData as UBlockData })
      }
    }

    setFocus(newTextBelow.id)
    return changes
  }

  onUTextPaste = (
    id: str,
    parentId: str, // factories are considered as text, it's necessary to know their parents
    data: str,
    type: UBlockType,
    setIds: SetStrs,
  ): UPageRawChanges => {
    let ublocks = [] as UBlocks
    if (type !== 'image') {
      data = data as str
      const blocksData = safeSplit(data, '\n\n')
      ublocks = blocksData.length
        ? blocksData.map((d) => ({ id: this.#getId(), data: d, type }))
        : [{ id: this.#getId(), data: '', type }] // onFactoryEnter
    } else {
      const id = this.#getId()
      const imageData: UMediaFileData = { src: '', $tmpSrc: data } // image will be accessed through fileUploader
      ublocks = [{ id, data: imageData, type }]
    }

    setIds(ublocks.map((b) => b.id))
    return this.#insert(ublocks, id, parentId)
  }

  #createColumn = (droppedOn: str, columnIds: strs, side: 'left' | 'right'): UPageRawChanges => {
    const parent = this.#tree.getParent(droppedOn)
    const changes = [...this.#delete(columnIds, { skipDeletion: true, preserveGrid: parent.id })]
    this.#gridChanger.createColumn(droppedOn, columnIds, side)
    changes.push({ t: 'change', id: parent.id, data: parent.data })
    return changes
  }

  #replaceWithNew = (replaceId: str, ublock: UBlock): UPageRawChanges => {
    const parent = this.#tree.getParent(replaceId)
    if (isUListBlock(parent.type)) throw new Error('Cannot replace in list')

    if (parent.type === 'grid') this.#gridChanger.replace(parent, replaceId, ublock)
    else {
      const rootLike = parent.data as { ublocks: UBlocks }
      const replaceI = rootLike.ublocks.findIndex((b) => b.id === replaceId)
      rootLike.ublocks[replaceI] = ublock
    }

    return [
      { t: 'change', id: parent.id, data: parent.data },
      { t: 'insert', ublocks: [ublock] },
    ]
  }

  #delete = (ids: strs, { skipDeletion = false, preserveGrid = '' } = {}): UPageRawChanges => {
    const changes = [] as UPageRawChanges

    const deletedParents = [] as strs

    const parentAndDeletions = new Map<UBlock, strs>() // arrange deletions with parents to minimize number of changes
    ids.forEach((id) => {
      const parent = this.#tree.getParent(id)
      if (!parentAndDeletions.has(parent)) parentAndDeletions.set(parent, [])
      safe(parentAndDeletions.get(parent)).push(id)
    })

    Array.from(parentAndDeletions.entries()).forEach(([parent, ids]) => {
      ids.forEach((id) => {
        if (isUListBlock(parent.type)) {
          const { isEmpty } = this.#listChanger.delete(ids)
          if (!isEmpty) changes.push({ t: 'change', id: parent.id, data: parent.data })
          else deletedParents.push(parent.id)
        } else if (parent.type === 'grid') {
          if (parent.id === preserveGrid) return

          const { moveIdsOut } = this.#gridChanger.delete(ids) // replace ids to id
          if (moveIdsOut) {
            const grandParent = this.#tree.getParent(parent.id)
            const grandParentData = grandParent.data as { ublocks: UBlocks }
            const i = grandParentData.ublocks.findIndex((b) => b.id === parent.id)
            grandParentData.ublocks.splice(i + 1, 0, ...moveIdsOut.map((id) => this.#tree.getUBlock(id)))
            if (moveIdsOut.length) changes.push({ t: 'change', id: grandParent.id, data: grandParent.data })
            deletedParents.push(parent.id)
          } else changes.push({ t: 'change', id: parent.id, data: parent.data })
        } else if (parent.type === 'exercise') {
          const form = parent.data as UFormData
          const i = form.ublocks.findIndex((b) => b.id === id)
          form.ublocks.splice(i, 1)
          changes.push({ t: 'change', id: parent.id, data: parent.data })
        } else {
          const root = parent.data as RootData
          const i = root.ublocks.findIndex((b) => b.id === id)
          root.ublocks.splice(i, 1)
          changes.push({ t: 'change', id: parent.id, data: parent.data })
        }

        if (!skipDeletion) {
          const block = this.#tree.getUBlock(id)
          if (block.type === 'exercise') {
            const form = (block.data as UFormData).ublocks
            form.forEach((b) => {
              if (!ids.includes(b.id)) ids.push(b.id)
            })
          }
        }
      })
    })

    if (!skipDeletion) changes.push({ t: 'delete', ids })
    if (deletedParents.length) changes.push(...this.remove(deletedParents))
    return changes
  }

  #insert = (ublocks: UBlocks, underId: str, parentId: str, { skipInsertion = false } = {}): UPageRawChanges => {
    const changes = [] as UPageRawChanges

    const parent = this.#tree.getUBlock(parentId)
    if (isUListBlock(parent.type)) {
      this.#listChanger.insert(ublocks, underId)
    } else if (parent.type === 'grid') {
      this.#gridChanger.insert(ublocks, underId)
    } else if (parent.type === 'exercise') {
      const form = parent.data as UFormData
      const i = form.ublocks.findIndex((b) => b.id === underId) + 1
      form.ublocks.splice(i, 0, ...ublocks)
    } else {
      const root = parent.data as RootData
      const i = root.ublocks.findIndex((b) => b.id === underId) + 1
      root.ublocks.splice(i, 0, ...ublocks)
    }

    if (!skipInsertion) {
      ublocks.forEach((b) => {
        if (isUListBlock(b.type)) {
          const ublocks = this.#listChanger.toBlocks(b) // safely insert new lists
          changes.push({ t: 'insert', ublocks })
        }
      })

      changes.push({ t: 'insert', ublocks })
    }

    changes.push({ t: 'change', id: parent.id, data: parent.data })
    return changes
  }
}
