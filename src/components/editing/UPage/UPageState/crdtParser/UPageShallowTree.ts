import { bool, str, strs } from '../../../../../utils/types'
import { isStr, safe } from '../../../../../utils/utils'
import {
  isStringBasedBlock,
  isUListBlock,
  UBlock,
  UBlockData,
  UBlocks,
  UBlockType,
  UFormData,
  UGridColumnData,
  UGridData,
  UListData,
  UPageData,
  UPageFlags,
} from '../../ublockTypes'
import { getObjectChanges } from './changesGeneration/getObjectChanges'
import { applyStrChanges, ChangeableStr, getStrChanges, _strChanger } from './changesGeneration/getStrChange'
import { ChangePreview } from './previewGeneration'
import { bfsUBlocks } from './UPageTree'

export class UPageShallowTree {
  #createBlock: (data: str, type: str) => UBlockMap
  #upageMap: UPageMap
  #ublocks: UBlocksMap

  constructor(upageMap: UPageMap, createBlock: (data: str, type: str) => UBlockMap) {
    this.#createBlock = createBlock
    this.#upageMap = upageMap
    this.#ublocks = safe(this.#upageMap.get('ublocks'))
  }

  get data(): UPageData {
    return toUPageData(this.#upageMap)
  }

  insert = (newBlocks: UBlocks) => {
    newBlocks.forEach((block) => {
      const blockCR = this.#createBlock(flattenData(block.data), block.type)
      this.#ublocks.set(block.id, blockCR)
    })
  }

  delete = (ids: strs) => ids.forEach((id) => this.#ublocks.delete(id))

  changeType = (id: str, type: UBlockType, newData: UBlockData) => {
    const block = safe(this.#ublocks.get(id))
    const blockData = safe(block.get('data'))

    blockData.delete(0, blockData.length)
    blockData.insert(0, flattenData(newData)) // TODO: handle turn into list

    const blockType = safe(block.get('type'))
    blockType.delete(0, blockType.length)
    blockType.insert(0, flattenData(type))
  }

  change = (id: str, data: UBlockData): ChangePreview => {
    const b = safe(this.#ublocks.get(id))
    const blockData = safe(b?.get('data'))
    const blockDataStr = blockData.toJSON()

    const changes = isStr(data)
      ? getStrChanges(blockDataStr, data as str)
      : getObjectChanges(blockDataStr, flattenData(data))
    applyStrChanges(blockData, changes)

    return changes.preview // TODO: test preview when only a number is changed
  }

  append = (newBlocks: UBlocks) => {
    const bfs = bfsUBlocks(newBlocks)
    bfs.forEach((newBlock) => {
      const block = this.#createBlock(flattenData(newBlock.data), newBlock.type)
      this.#ublocks.set(newBlock.id, block)
    })

    const topIds = newBlocks.map((b) => b.id)

    const rootYText = safe(this.#ublocks.get('r')?.get('data'))
    const rootStr = rootYText.toJSON()

    const root = JSON.parse(rootStr) as Root

    topIds.forEach((id) => root.ublocks.push(id))
    const newRootStr = JSON.stringify(root)

    applyStrChanges(rootYText, getStrChanges(rootStr, newRootStr, { skipPreview: true }))
  }

  triggerFlag = (name: keyof UPageFlags, type: 'set' | 'unset') => {
    if (type === 'set') this.#upageMap.set(name, true)
    else this.#upageMap.delete(name)
  }

  get _data() {
    return toUPageData(this.#upageMap)
  }
}

// all arrays must have DUMMY_DATA as their first element
// due to lack of trailing coma at arrays (& objects) ends when Yjs merges them it misses a comma and gets invalid JSON
// for ublocks DUMMY_DATA is always present as a first element, but DUMMY_DATA is removed when normal data is provided
//   dummy data is inserted back if array becomes empty due to changes
//   due to removal DUMMY_DATA merges are not entirely correct but resulting json is valid
// this solution has a lot of assumptions: where certain ublocks can be and what their structure is

export const DUMMY_DATA = '\u2018'
export const D = DUMMY_DATA

interface FlatUBlock {
  type: str
  data: str
}

interface UBlockMap {
  get: (key: 'data' | 'type') => ChangeableStr | undefined
  toJSON: () => FlatUBlock // intended for preview calculations only
}

interface UBlocksMap {
  get: (id: str) => UBlockMap | undefined
  set: (id: str, b: UBlockMap) => void
  delete: (id: str) => void
}

type UPage = UPageFlags & { ublocks?: UBlocksMap }

type UPageMap = {
  get<TKey extends keyof UPage>(key: TKey): UPage[TKey]
  set<TKey extends keyof UPage>(key: TKey, value: UPage[TKey]): void
  has<TKey extends keyof UPage>(key: TKey): bool
  delete<TKey extends keyof UPage>(key: TKey): void
}

type FlatGrid = Array<Omit<UGridColumnData, 'ublocks'> & { ublocks: strs }>
type FlatForm = Omit<UFormData, 'ublocks'> & { ublocks: strs }
// type FlatListItem = Omit<UListItem, 'ublock' | 'children'> & { ublock: str; children?: FlatListItem[] }
type Root = { ublocks: strs }

function flattenData(data: UBlockData): str {
  if (isStr(data)) return data as str

  return JSON.stringify(data, (k, v) => {
    if (k.startsWith('$')) return undefined

    if (k === 'ublock') return v.id
    if (k === 'ublocks') {
      const ids = v.map((b: UBlock) => b.id) as strs
      if (ids[0] !== DUMMY_DATA) return [DUMMY_DATA, ...ids] // do not mutate data otherwise immer propagate it to new state
      return ids
    }
    if (Array.isArray(v) && v[0] !== DUMMY_DATA) return [DUMMY_DATA, ...v]
    return v
  })
}

const toUPageData = (pageCR: UPageMap): UPageData => {
  const r: UPageData = { fullWidth: pageCR.get('fullWidth'), turnOffTOC: pageCR.get('turnOffTOC'), ublocks: [] }
  const ublocksMap = safe(pageCR.get('ublocks'))
  const rootStr = safe(ublocksMap.get('r')?.get('data')).toJSON()
  const root = JSON.parse(rootStr) as { ublocks: strs }
  r.ublocks = idsToUblocks(ublocksMap, root.ublocks)
  return r
}

const idsToUblocks = (ublocksMap: UBlocksMap, ids: strs): UBlocks => {
  // in root and uform can be dummy
  const realIds = ids.filter((id) => id !== DUMMY_DATA)
  return realIds.map((id) => {
    const block = safe(ublocksMap.get(id))
    const type = block.get('type')?.toJSON() as UBlockType
    const data = unFlattenData(ublocksMap, type, safe(block.get('data')).toJSON())
    return { id, type, data }
  })
}

const unFlattenData = (ublocks: UBlocksMap, type: UBlockType, dataAsStr: str): UBlockData => {
  if (isStringBasedBlock(type)) return dataAsStr
  const parsed = JSON.parse(dataAsStr.replaceAll(new RegExp(`"${DUMMY_DATA}",?`, 'g'), ''))

  if (type === 'grid') {
    const grid = parsed as FlatGrid
    return grid.map((column) => ({ width: column.width, ublocks: idsToUblocks(ublocks, column.ublocks) })) as UGridData
  }

  if (type === 'exercise') {
    const form = parsed as FlatForm
    return { ...form, ublocks: idsToUblocks(ublocks, form.ublocks) } as UFormData
  }

  if (isUListBlock(type)) {
    const list = parsed as UListData // all ublocks are strings that will be muted to actual blocks
    setBlocksForList(list, (id) => idsToUblocks(ublocks, [id])[0])
    return list
  }

  return parsed
}

const setBlocksForList = (list: UListData, getBlock: (id: str) => UBlock): UListData => {
  const queue = [...list]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node.children) queue.push(...node.children)
    node.ublock = getBlock(node.ublock as unknown as str)
  }

  return list
}

type TestBlock = [str, str?, UBlockType?]
type TestBlocks = Array<TestBlock | str>

// start id with - to avoid its creation in root
export const _getTestFlattenUpage = (blocks: TestBlocks) => {
  blocks = blocks.map((b) => (!Array.isArray(b) ? [b] : b))

  const page = new Map<keyof UPage, UPage[keyof UPage]>()
  const ublocks: UBlocksMap = new Map<str, UBlockMap>()

  const createBlock = (d: str, t: str) => {
    const b = { type: _strChanger(t), data: _strChanger(d) }
    return {
      get: (k: 'type' | 'data') => b[k],
      toJSON: () => ({ id: '', type: b.type.toJSON(), data: b.data.toJSON() }),
    }
  }

  const root: Root = { ublocks: [DUMMY_DATA] }

  blocks.forEach((rawBlock) => {
    let [id, data, type] = rawBlock as TestBlock
    type = type || 'text'
    const nested = id.startsWith('-')
    id = nested ? id.slice(1) : id
    data = data || id
    const block = createBlock(data, type)
    if (!nested) root.ublocks.push(id)
    ublocks.set(id, block)
  })

  ublocks.set('r', createBlock(JSON.stringify(root), ''))

  page.set('ublocks', ublocks)
  return new UPageShallowTree(page as UPageMap, createBlock)
}
