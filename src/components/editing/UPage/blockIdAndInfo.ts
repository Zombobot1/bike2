import { reverse, sort } from '../../../utils/algorithms'
import { bool, Fn, num, SetStr, str, strs } from '../../../utils/types'
import { safe, ucast } from '../../../utils/utils'
import { AddedBlock, BlockInfo } from '../types'
import { isUListBlock, isUQuestionBlock, isUTextBlock, mayContainPages, UBlockType } from './types'

export function moveFocus(direction: 'up' | 'down' | 'first' | 'last', id = ''): str {
  const ids = sortedUTextIds()

  if (!ids.length) {
    if (direction === 'first') return 'factory'
    return 'title'
  }

  if (direction === 'first') return ids[0]
  if (direction === 'last') return safe(ids.at(-1))

  const index = ids.indexOf(id)

  if (direction === 'up') {
    if (index === 0) return 'title'
    return ids[index - 1]
  }

  if (index === ids.length - 1) return 'factory'
  return ids[index + 1]
}

export function getIsBlockOpen(id: str): bool {
  const info = idAndInfo.get(id)
  return info?.isOpen || false
}

export function toggleListOpen(id: str, onOpen: Fn) {
  const info = idAndInfo.get(id)
  if (!info) return
  setUBlockInfo(id, { isOpen: !info?.isOpen })
  onOpen()
}

export function isInList(id: str): bool {
  return !!findListId(id)
}

function findListId(id: str): str {
  let parentId = idAndInfo.get(id)?.setId || ''
  while (parentId && !isUListBlock(idAndInfo.get(parentId)?.type)) {
    parentId = idAndInfo.get(parentId)?.setId || ''
  }
  return parentId
}

// merge above and below: la - id - lb -> { appendedData: { id: la, data }, deleteCompletely: lb, id  }
// merge to above: la - id - lb? -> { appendedData: { id: la, data }, delete: id, deleteCompletely?: lb }
// merge below: id - lb -> { initialData: data, deleteCompletely: lb }
// just create: id -> { initialData: data }
export type UListMerge = {
  appendedData?: { id: str; ulistId?: str; data: str }
  addedListBlock?: AddedBlock
  deleteBlocks?: strs
  deleteId?: str
  replaceId?: str
  replaceBy?: str
}
export function mergeListsAround(
  id: str,
  data: str,
  mode: 'deleted' | 'changed-type',
  type: UBlockType,
  unmarked?: bool,
) {
  // debugger
  const ids = sortedSetIds(id)
  const i = ids.indexOf(id)

  const listAboveId = isUListBlock(idAndInfo.get(ids[i - 1])?.type) ? ids[i - 1] : ''
  const listBelowId = isUListBlock(idAndInfo.get(ids[i + 1])?.type) ? ids[i + 1] : ''
  if (listAboveId && listBelowId && mode === 'deleted') {
    // const listAbove = ucast(safe(idAndInfo.get(listAboveId)).data, new UListDTO())
    // const listBelow = ucast(safe(idAndInfo.get(listBelowId)).data, new UListDTO())
    // listAbove.children?.push(...safe(listBelow.children))
    // return {
    // appendedData: { ulistId: listAboveId, id: listAbove.children?.at(-1)?.id || '', data: JSON.stringify(listAbove) },
    // deleteBlocks: [id, listBelowId],
    // }
  }

  if (listAboveId) {
    // const listAbove = ucast(safe(idAndInfo.get(listAboveId)).data, new UListDTO())
    // listAbove.children?.push({ id, unmarked: listAbove.children.at(-1)?.unmarked })
    // if (!listBelowId) return { deleteId: id, appendedData: { id: listAboveId, data: JSON.stringify(listAbove) } }
    // const listBelow = ucast(safe(idAndInfo.get(listBelowId)).data, new UListDTO())
    // listAbove.children?.push(...safe(listBelow.children))
    // return {
    //   deleteId: id,
    //   appendedData: { ulistId: listAboveId, id, data: JSON.stringify(listAbove) },
    //   deleteBlocks: [listBelowId],
    // }
  }

  // const newListId = uuid() // avoid changing type in favor of more general approach
  // const newList: UListDTO = { id: newListId, unmarked, children: [{ id }] }

  const canJoin = idAndInfo.get(listBelowId)?.type === type
  if (listBelowId && canJoin) {
    // const listBelow = ucast(safe(idAndInfo.get(listBelowId)).data, new UListDTO())
    // newList.children?.push(...safe(listBelow.children))
  }

  // return {
  //   addedListBlock: { id: newListId, data: JSON.stringify(newList), type },
  //   deleteBlocks: canJoin ? [listBelowId] : [],
  //   deleteId: id,
  //   replaceId: id,
  //   replaceBy: newListId,
  // }
}

export function findUpage(aboveId: str): str {
  const ids = sortedSetIds(aboveId)
  const areaOfSearch = ids.slice(0, ids.indexOf(aboveId))
  return reverse(areaOfSearch).find((id) => idAndInfo.get(id)?.type === 'page') || ''
}

export function getUFormSize(uformId: str): num {
  let r = 0
  idAndInfo.forEach(({ type, setId }) => {
    if (setId === uformId && isUQuestionBlock(type)) r++
  })
  return r
}

export function openListParent(id: str, onOpen: Fn) {
  const parentId = idAndInfo.get(id)?.setId
  if (!parentId) return
  const info = idAndInfo.get(parentId)
  if (!info) return
  idAndInfo.set(parentId, { ...info, isOpen: true })
  onOpen()
}

type IdAndSetIds = { id: str; setId: str }[]

export function getAllUBlocksForSelection(): IdAndSetIds {
  const r = [] as IdAndSetIds
  idAndInfo.forEach(({ setId }, id) => r.push({ id, setId }))
  return r
}

export function getSelectedData(selectedIds: strs): str {
  const data = [] as strs

  selectedIds.forEach((id) => {
    const info = idAndInfo.get(id)
    if (!info || !isUTextBlock(info?.type)) return
    data.push(info.data)
  })

  return data.join('\n\n')
}

export function preventUListIdsDeletion(ids: strs) {
  ulistIds = ids // when ulist splits new one is rendered first -> old one deletes children after that
}

export function deleteUBlockInfo(id: str) {
  if (ulistIds.includes(id)) return (ulistIds = ulistIds.filter((_id) => _id !== id))
  idAndInfo.delete(id)
}

export function getUBlockInfo(id: str): BlockInfo {
  return safe(idAndInfo.get(id))
}

export function getIsToggleOpen(id: str): bool {
  return idAndInfo.get(id)?.isOpen || false
}

export function setUBlockInfo(id: str, info: Partial<BlockInfo>) {
  const old = idAndInfo.get(id)
  if (!old) idAndInfo.set(id, { ...new BlockInfo(), ...info })
  else idAndInfo.set(id, { ...old, ...info })
}

export function setRoot(id: str) {
  let prevRoot = ''
  idAndInfo.forEach((info, id) => {
    if (!info.setId) prevRoot = id
  })
  idAndInfo.delete(prevRoot)
  idAndInfo.set(id, { setId: '', data: '', i: -1, type: 'text' })
}

export function deletePagesIn(ids: strs, deleteUPage: SetStr) {
  const pageIds = ids.filter((id) => getUBlockInfo(id).type === 'page')

  const removingNodesWithPages = bfs(buildTree()).filter((n) => ids.includes(n.id) && mayContainPages(n.type))
  removingNodesWithPages.forEach((n) => {
    bfs(n)
      .filter((innerNode) => innerNode.type === 'page')
      .forEach((page) => pageIds.push(page.id))
  })

  pageIds.forEach((id) => deleteUPage(id))
}

type Projection = { id: str; data: str; type: UBlockType; scrollTo?: Fn; i: num }
export function getBlocksForTOC(): Projection[] {
  return Array.from(idAndInfo.entries()).map(([id, { data, type, scrollTo, i }]) => ({ id, data, type, scrollTo, i }))
}

const idAndInfo = new Map<str, BlockInfo>()
let ulistIds = [] as strs

type BlockTree = { id: str; setId: str; i: num; type: UBlockType; children?: BlockTree[] }
type IdAndBlockTree = Map<str, BlockTree>
type BlockTrees = BlockTree[]

function buildTree(): BlockTree {
  let root: BlockTree | undefined = undefined

  const idAndTree: IdAndBlockTree = new Map()
  idAndInfo.forEach((info, id) => {
    idAndTree.set(id, {
      id,
      setId: info.setId,
      i: info.i,
      type: info.type,
    })
  })

  idAndTree.forEach((node) => {
    if (!node.setId) {
      root = node
      return
    }
    const parent = safe(idAndTree.get(node.setId))
    parent.children = parent?.children ? [...parent.children, node] : [node]
  })

  return safe(root)
}

function sortedChildren(node: BlockTree): BlockTrees {
  if (!node.children) return []
  return sort(node.children, (e) => e.i)
}

function bfs(node: BlockTree): BlockTrees {
  const queue = [...sortedChildren(node)]
  const r: BlockTrees = [node]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node?.children) queue.push(...sortedChildren(node))
    r.push(node)
  }

  return r
}

function sortedUTextIds(): strs {
  const tree = bfs(buildTree()).filter((n) => isUTextBlock(n.type))
  return tree.map((n) => n.id).slice(1) // skip root
}

function sortedSetIds(id: str): strs {
  const setId = safe(idAndInfo.get(id), id).setId
  const iAndId: [num, str][] = []
  idAndInfo.forEach((info, id) => {
    if (info.setId === setId) iAndId.push([info.i, id])
  })
  return sort(iAndId, ([i]) => i).map(([_, id]) => id)
}
