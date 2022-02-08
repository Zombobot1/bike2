import {
  isUFormBlock,
  isUListBlock,
  UBlock,
  UBlockData,
  UBlocks,
  UBlockType,
  UFormData,
  UGridData,
  UListData,
  UListItem,
  UPageData,
} from '../types'
import { getStrChanges, StrChanges } from '../changesGeneration/getStrChange'
import { JSObject, num, str } from '../../../../utils/types'
import { sha256, sha224 } from 'js-sha256'
import { now } from '../../../../utils/wrappers/timeUtils'
import { getUserId } from '../userId'
import { UPageChangeDescriptionDTO } from '../../../../fb/upageChangesAPI'
import { isStr, safe } from '../../../../utils/utils'
import { Patch } from 'immer'
import { ObjectChanges } from '../changesGeneration/getFlatObjectChanges'

export type CPath = Array<num | str>

export type UPageChange =
  | { t: 'insert'; ublocks: UBlocks; preview: str; path: CPath; blockId: str }
  | { t: 'change-str'; changes: StrChanges; path: CPath; blockId: str }
  | { t: 'change-object'; changes: ObjectChanges; path: CPath; blockId: str }
  | { t: 'change-root'; changes: ObjectChanges }
  | { t: 'change-type'; type: UBlockType; data?: UBlockData; path: CPath }
  | { t: 'delete'; preview: str; path: CPath }
  | { t: 'delete-page' }

export type UPageChanges = UPageChange[]

function getChangesPreview(cs: UPageChanges): str {
  return cs
    .map((c) => {
      if (c.t === 'insert') return c.preview
      if (c.t === 'delete') return c.preview
      if (c.t === 'change-object') return c.changes.preview
      if (c.t === 'change-str') return c.changes.preview
      return ''
    })
    .filter(Boolean)
    .join('<br>')
}

export function describeChanges(cs: UPageChanges, update: Uint8Array): UPageChangeDescriptionDTO | undefined {
  const describableChange = cs.find((c) => ['delete', 'insert', 'change-str', 'change-object'].includes(c.t))
  if (!describableChange) return undefined
  const changeWithBlockId = cs.find((c) => 'blockId' in c) as { blockId: str } | undefined
  return {
    sha: sha256(update).slice(0, 6),
    block: changeWithBlockId?.blockId,
    date: now(),
    preview: getChangesPreview(cs),
    user: getUserId(),
  }
}

export function dfsUList(node: UListItem, idAndParent: IdAndBlock) {
  function dfs(node: UListItem) {
    const r = [node]
    if (!node.children) return r
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      if (!idAndParent.has(child.ublock.id))
        idAndParent.set(child.ublock.id, { id: node.ublock.id, type: 'l', data: [node] })
      r.push(...dfs(child))
    }
    return r
  }

  return dfs(node)
}

function bfsUPage(data: UPageData) {
  const idAndBlock: IdAndBlock = new Map()
  const idAndParent: IdAndBlock = new Map()

  const queue: UBlocks = data.ublocks

  while (queue.length) {
    const node = safe(queue.shift())
    const { type } = node
    if (isUFormBlock(type)) {
      const blocks = (node.data as UFormData).ublocks
      blocks.forEach((b) => idAndParent.set(b.id, node))
      queue.push(...blocks)
    } else if (isUListBlock(type)) {
      // default focus UX: first nested child in a list is the next block to move focus
      // TODO: handle toggle lists differently
      const data = node.data as UListData
      const listBlocks = data
        .map((item) => {
          idAndParent.set(item.ublock.id, node)
          return dfsUList(item, idAndParent)
        })
        .flat()
        .map((item) => item.ublock)

      listBlocks.forEach((b) => idAndBlock.set(b.id, b))
      queue.push(...listBlocks)
    } else if (type === 'grid') {
      const blocks = (node.data as UGridData).map((l) => l.ublocks).flat()
      blocks.forEach((b) => idAndParent.set(b.id, node))
      queue.push(...blocks)
    }

    idAndBlock.set(node.id, node)
  }

  return { idAndBlock, idAndParent }
}

type IdAndBlock = Map<str, UBlock>

class UPageTree {
  #idAndBlock: IdAndBlock
  #idAndParent: IdAndBlock
  #data: UPageData

  constructor(data: UPageData) {
    const { idAndBlock, idAndParent } = bfsUPage(data)
    this.#idAndBlock = idAndBlock
    this.#idAndParent = idAndParent
    this.#data = data
  }

  getPath = (id: str): CPath => {
    const r = [] as CPath
    while (this.#idAndParent.has(id)) {
      const parentBlock = safe(this.#idAndParent.get(id))

      if (parentBlock.type !== 'l') {
        const data = safe(this.#idAndParent.get(id)).data as { ublocks: UBlocks }
        const i = data.ublocks.findIndex((b) => b.id === id)
        r.unshift('ublocks', i)
      } else {
        const data = safe(this.#idAndParent.get(id)).data as UListData
        const i = safe(data[0].children).findIndex((child) => child.ublock.id === id)
        r.unshift('children', i)
      }

      id = parentBlock.id
    }
    r.unshift(this.#data.ublocks.findIndex((b) => b.id === id))
    return r
  }

  getData = (id: str): UBlockData => {
    return safe(this.#idAndBlock.get(id)).data
  }
}

export function getUPageChanges(tree: UPageTree, id: str, newData: UBlockData): UPageChanges {
  const r = [] as UPageChanges
  if (isStr(newData)) {
    r.push({
      t: 'change-str',
      blockId: id,
      path: tree.getPath(id),
      changes: getStrChanges(tree.getData(id) as str, newData as str),
    })
  }

  return r
}
