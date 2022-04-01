import { str, bool, num, strs, GetStr } from '../../../../../utils/types'
import { safe } from '../../../../../utils/utils'
import { UBlock, UBlocks, UBlockType, UListData, UListItem } from '../../ublockTypes'

interface Tree {
  isInList: (id: str) => bool
  getParent: (id: str) => UBlock
  getUBlock: (id: str) => UBlock
  getListsAround: (id: str, type?: UBlockType) => { listBelowId?: str; listAboveId?: str }
}

export class UListChanger {
  #tree: Tree
  #getId: () => str

  constructor(tree: Tree, getId: () => str) {
    this.#tree = tree
    this.#getId = getId
  }

  insert = (blocks: UBlocks, underId: str) => {
    blocks = blocks.reverse()
    const list = this.#tree.getParent(underId)
    blocks.forEach((b) => insertIntoList(list.data as UListData, b, underId))
  }

  delete = (ids: strs): { isEmpty: bool } => {
    const list = this.#tree.getParent(ids[0])
    const listData = list.data as UListData
    ids.forEach((id) => deleteFromList(listData, id))
    return { isEmpty: listData.length === 0 }
  }

  moveRight = (
    id: str,
    { mergeWithType }: { mergeWithType?: UBlockType } = {},
  ): { status: 'failed' } | { status: 'moved'; updatedList: UBlock; deletedIds?: strs } => {
    if (this.#tree.isInList(id)) {
      const list = this.#tree.getParent(id)

      const i = getUListNodeIndex(list.data as UListData, id)
      if (i === 0) return { status: 'failed' }

      moveRightInUList(list.data as UListData, id, { openClosed: list.type === 'toggle-list' })
      return { status: 'moved', updatedList: list }
    }

    const { listBelowId, listAboveId } = this.#tree.getListsAround(id, mergeWithType)
    if (!listBelowId && !listAboveId) return { status: 'failed' }

    const mergingBlock = this.#tree.getUBlock(id)
    const deletedIds = [mergingBlock.id]
    let updatedList: UBlock | undefined

    if (listAboveId) {
      const listAbove = this.#tree.getUBlock(listAboveId)
      const listAboveData = listAbove.data as UListData
      if (listBelowId) {
        const listBelow = this.#tree.getUBlock(safe(listBelowId))
        const listBelowData = listBelow.data as UListData
        listAboveData.push({ ublock: mergingBlock })
        listAboveData.push(...listBelowData)
        deletedIds.push(listBelowId)
      } else {
        listAboveData.push({ ublock: mergingBlock })
      }
      updatedList = listAbove
    } else {
      // list below exists
      const listBelow = this.#tree.getUBlock(safe(listBelowId))
      const listBelowData = listBelow.data as UListData
      listBelowData.unshift({ ublock: mergingBlock })
      updatedList = listBelow
    }

    return { status: 'moved', deletedIds, updatedList }
  }

  // delete node via delete mark
  moveLeft = (id: str, { deleteMark = false } = {}): MoveLeftR => {
    const isInList = this.#tree.isInList(id)
    if (!isInList) return { status: 'failed' }

    const list = this.#tree.getParent(id)
    const block = this.#tree.getUBlock(id)

    const listData = list.data as UListData

    const { depth, node } = getDepth(listData, id)

    if (depth === 0 && !deleteMark) return { status: 'failed' }

    if (depth < 2 && deleteMark && node.unmarked) {
      const { listBelow, listIsEmpty } = splitUListNode(list.data as UListData, id, this.#getId, list.type)
      const deletedId = listIsEmpty ? list.id : ''
      return { status: 'moved', updatedList: list, listBelow, deletedId, blockBelow: block }
    }

    if (!node.unmarked && deleteMark) {
      deleteMarkInUList(listData, id)
      return { status: 'moved', updatedList: list }
    }

    moveLeftInUList(listData, id)
    return { status: 'moved', updatedList: list }
  }

  toBlocks = (block: UBlock): UBlocks => {
    const list = block.data as UListData
    return bfsUList(list).map((n) => n.ublock)
  }

  create = (ublock: UBlock, type: UBlockType): UBlock => {
    const list: UListData = [{ ublock }]
    return { id: this.#getId(), data: list, type }
  }
}

type MoveLeftR =
  | { status: 'failed' }
  | { status: 'moved'; updatedList: UBlock; blockBelow?: UBlock; listBelow?: UBlock; deletedId?: str }

function moveRightInUList(list: UListData, id: str, { openClosed = false } = {}) {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      if (nodeAndParent.has(node)) {
        const parent = safe(nodeAndParent.get(node))
        const children = safe(parent.children)
        const i = children.findIndex((c) => c.ublock.id === node.ublock.id) // find this node in parent
        if (i === 0) return {} // cannot move first child

        if (!children[i - 1].children) children[i - 1].children = [] // append node to children of previous node
        children[i - 1].children?.push(node)
        if (openClosed && !children[i - 1].$isOpen) children[i - 1].$isOpen = true

        children.splice(i, 1) // remove from parent
      } else {
        const i = list.findIndex((c) => c.ublock.id === node.ublock.id)
        if (i === 0) return {}

        if (!list[i - 1].children) list[i - 1].children = []
        list[i - 1].children?.push(node)
        if (openClosed && !list[i - 1].$isOpen) list[i - 1].$isOpen = true

        list.splice(i, 1) // remove from parent
      }
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }

  return {}
}

function moveLeftInUList(list: UListData, id: str) {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      if (nodeAndParent.has(node)) {
        const parent = safe(nodeAndParent.get(node))
        const children = safe(parent?.children)
        const i = children.findIndex((c) => c.ublock.id === node.ublock.id) // find this node in parent
        const movingChildren = children.slice(i + 1) // +1 to avoid circular reference
        children.splice(i, movingChildren.length + 1) // remove from parent; +1 to include node itself
        if (!children.length) delete parent.children // clean empty children array from parent

        if (movingChildren.length) {
          if (!node.children) node.children = []
          node.children.push(...movingChildren) // move parent children below node to it
        }

        const grandParentChildren = nodeAndParent.get(parent)?.children || list

        const parentI = grandParentChildren.findIndex((c) => c.ublock.id === parent.ublock.id)
        grandParentChildren.splice(parentI + 1, 0, node) // insert as a next child to grand parent

        return 'moved' // move succeeded
      } else {
        if (node.unmarked) return 'split list'
        return 'did not move'
      }
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }
  return 'did not move'
}

function bfsUList(list: UListData): UListData {
  const r = [] as UListData
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())
    r.push(node)
    if (node.children) queue.push(...node.children)
  }

  return r
}

function deleteMarkInUList(list: UListData, id: str): bool {
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      if (node.unmarked === true) return false
      node.unmarked = true
      return true
    }

    if (node.children) queue.push(...node.children)
  }

  return false
}

function splitUListNode(
  list: UListData,
  id: str,
  getId: GetStr,
  type: UBlockType,
): { listIsEmpty?: bool; listBelow?: UBlock } {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      let depth = 0
      let nodeRef = node
      while (nodeAndParent.has(nodeRef)) {
        nodeRef = safe(nodeAndParent.get(nodeRef))
        depth++
      }

      if (depth === 1 && node.unmarked) {
        const parent = safe(nodeAndParent.get(node))
        const parentChildren = safe(parent.children)
        const splitI = parentChildren.findIndex((c) => c.ublock.id === id)
        const splittingNodeChildren = node.children || []

        if (parentChildren.length < 2) delete parent.children

        if (splitI !== parentChildren.length - 1 || splittingNodeChildren.length) {
          const movedNodes = parentChildren.slice(splitI + 1)
          parentChildren.splice(splitI, movedNodes.length + 1) // + 1 to remove splitting node
          const nodesToPlaceBelow = [...splittingNodeChildren, ...movedNodes]

          return { listBelow: { id: getId(), type: type, data: nodesToPlaceBelow } }
        }

        return {} // nothing to place below splitting node
      }

      if (depth === 0) {
        const parentChildren = list
        const splitI = parentChildren.findIndex((c) => c.ublock.id === id)
        const splittingNodeChildren = node.children || []

        if (splitI !== parentChildren.length - 1 || splittingNodeChildren.length) {
          const movedNodes = parentChildren.slice(splitI + 1)
          parentChildren.splice(splitI, movedNodes.length + 1) // + 1 to remove splitting node
          const nodesToPlaceBelow = [...splittingNodeChildren, ...movedNodes]
          return {
            listIsEmpty: !parentChildren.length,
            listBelow: { id: getId(), type: type, data: nodesToPlaceBelow },
          }
        }
        return {} // nothing to place below splitting node
      }
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }
  throw new Error('ListItem not found')
}

function getDepth(list: UListData, id: str): { depth: num; node: UListItem } {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      let depth = 0
      let nodeRef = node
      while (nodeAndParent.has(nodeRef)) {
        nodeRef = safe(nodeAndParent.get(nodeRef))
        depth++
      }

      return { depth, node }
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }
  throw new Error('ListItem not found')
}

function getUListNodeIndex(list: UListData, id: str): num {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      if (nodeAndParent.has(node)) {
        const children = safe(nodeAndParent.get(node)?.children)
        return children.findIndex((c) => c.ublock.id === id)
      } else {
        return list.findIndex((c) => c.ublock.id === id)
      }
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }
  return -1
}

function insertIntoList(list: UListData, ublock: UBlock, underId: str) {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === underId) {
      if (nodeAndParent.has(node)) {
        const children = safe(nodeAndParent.get(node)?.children)
        const i = children.findIndex((c) => c.ublock === node.ublock) // find this node in parent
        children.splice(i + 1, 0, { ublock })
      } else {
        const i = list.findIndex((c) => c.ublock === node.ublock)
        list.splice(i + 1, 0, { ublock })
      }
      return
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }
}

function deleteFromList(list: UListData, id: str) {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      if (nodeAndParent.has(node)) {
        const parent = safe(nodeAndParent.get(node))
        const children = safe(parent.children)
        const i = children.findIndex((c) => c.ublock === node.ublock) // find this node in parent
        children.splice(i, 1)
        if (!children.length) delete parent.children
      } else {
        const i = list.findIndex((c) => c.ublock === node.ublock)
        list.splice(i, 1)
      }
      return
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }
}

export function triggerUListOpen(list: UListData, id: str) {
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      node.$isOpen = !node.$isOpen
      return
    }

    if (node.children) queue.push(...node.children)
  }
}

export function isUBlockInOpenNode(list: UListData, id: str): bool {
  const nodeAndParent = new Map<UListItem, UListItem>()
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())

    if (node.ublock.id === id) {
      if (!nodeAndParent.has(node)) return true

      let nodeRef = node
      while (nodeAndParent.has(nodeRef)) {
        nodeRef = safe(nodeAndParent.get(nodeRef))
        if (!nodeRef.$isOpen) return false
      }

      return true
    }

    if (node.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }

  throw new Error('Node not found')
}
