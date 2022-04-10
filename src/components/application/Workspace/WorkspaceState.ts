import { bool, f, Fn as F, SetStr, str, strs } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { useData } from '../../../fb/useData'
import { Bytes } from 'firebase/firestore'
import { enablePatches, produceWithPatches } from 'immer'
import {
  DeletedUPageNodes,
  UPageNode,
  UPageNodeData,
  UPageNodesData,
  UPageNodes,
  WorkspacePath,
  WorkspaceStructure,
} from './types'
import { getInitialWorkspace, WorkspaceCR } from './WorkspaceCR'
import { deepEqual } from 'fast-equals'
import { sendWorkspaceUpdate } from '../../../fb/upageChangesAPI'
import { structuredClone } from '../../../utils/wrappers/clone'
import { useState } from 'react'
import { useLocalStorage } from '../../utils/hooks/useLocalStorage'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { now } from '../../../utils/wrappers/timeUtils'
import { WorkspaceDTO } from '../../../fb/FSSchema'
import { getUserId } from '../../editing/UPage/userId'
import { sslugify } from '../../../utils/sslugify'

enablePatches()

export interface UPageBasicManagement {
  remove: (pageIds: strs, o?: { moveTo?: str }) => void
  add: (parentId: str, underId: str, id: str) => void
}

// Outer - in navbar .etc
export interface UPageOuterManagement {
  removeCurrent: (id: str, setPageIdToGo: SetStr) => void
  addNew: (id: str) => void
}

export interface UPageManagement extends UPageBasicManagement, UPageOuterManagement {
  removedPages: () => DeletedUPageNodes
  removePermanently: (ids: strs) => void
  rename: (id: str, name: str) => void
  setColor: (id: str, color: str) => void
  name: (id: str) => str
  color: (id: str) => str
}

export class WorkspaceNav {
  favorite: UPageNodes = []
  personal: UPageNodes = []
}

export class WorkspaceOpenness {
  open = [] as strs
  openFavorite = [] as strs
}

export interface WorkspaceLookup {
  getOwner: F
  topPaths: () => WorkspacePath
  getPagesIn: (parentId: str) => strs
}

export class WorkspaceState implements UPageManagement, WorkspaceLookup {
  #openness: WorkspaceOpenness
  #updateOpenness: (o: WorkspaceOpenness) => void
  #favorite: strs
  #cr: WorkspaceCR
  #structure: WorkspaceStructure
  #updateFavorite: (d: { favorite: strs }) => void
  #setNav: (n: WorkspaceNav) => void = f
  #nav: WorkspaceNav

  constructor(
    dto: WorkspaceDTO,
    updateFavorite: (d: { favorite: strs }) => void,
    openness: WorkspaceOpenness,
    updateOpenness: (o: WorkspaceOpenness) => void,
    sendWSUpdate = sendWorkspaceUpdate,
  ) {
    this.#openness = openness
    this.#updateOpenness = updateOpenness
    this.#favorite = dto.favorite
    this.#cr = new WorkspaceCR(dto.updates, sendWSUpdate)
    this.#structure = this.#cr.state
    this.#updateFavorite = updateFavorite
    this.#nav = this.#getState()
  }

  get state(): WorkspaceNav {
    return this.#nav
  }

  getOwner = () => getUserId()
  getPagesIn = (parentId: str): strs => {
    const parent = safe(findNode(this.#structure.pages, parentId))
    const children = parent.children ? bfsNodes(parent.children) : []
    const ids = children.map((n) => n.id)
    return [parentId, ...ids]
  }

  setStateSetter = (s: (n: WorkspaceNav) => void) => (this.#setNav = s)

  applyUpdate = (dto: WorkspaceDTO) => {
    const newState = this.#cr.applyUpdate(dto.updates)
    const newFavorites = !deepEqual(dto.favorite, this.#favorite)
    if (!newState && !newFavorites) return

    this.#favorite = dto.favorite
    if (newState) this.#structure = newState
    this.#update()
  }

  triggerFavorite = (id: str) => {
    if (this.#favorite.includes(id)) {
      this.#favorite = this.#favorite.filter((favorite) => favorite !== id) // TODO: delete from open
    } else this.#favorite.unshift(id)

    this.#updateDTO()

    this.#update()
  }

  triggerOpen = (id: str) => {
    if (this.#openness.open.includes(id)) {
      this.#openness.open = this.#openness.open.filter((open) => open !== id)
    } else this.#openness.open.push(id)

    this.#updateOpenness(this.#openness)

    this.#update()
  }

  triggerFavoriteOpen = (id: str) => {
    if (this.#openness.openFavorite.includes(id)) {
      this.#openness.openFavorite = this.#openness.openFavorite.filter((open) => open !== id)
    } else this.#openness.openFavorite.push(id)

    this.#updateOpenness(this.#openness)

    this.#update()
  }

  add = (parentId: str, underId: str, id: str) => this.#change((nodes) => insertNode(nodes, parentId, underId, id))
  addNew = (id: str) => this.#change((nodes) => nodes.push({ id, color: '', name: '' }))

  remove = (pageIds: strs, o?: { moveTo?: str }) => {
    this.#change((nodes, trash) => {
      pageIds.forEach((id) => {
        const node = deleteNode(nodes, id)
        if (o?.moveTo) insertNodeAsLast(nodes, safe(o.moveTo), node)
        else trash.push({ node, deletedAt: now() })
      })
    })

    // TODO: delete from open
  }

  removeCurrent = (id: str, setPageIdToGo: SetStr) => {
    const prev = getPrevNode(this.#structure.pages, id)
    setPageIdToGo(prev?.id || '')
    return this.remove([id])
  }

  removedPages = () => this.#structure.trash

  removePermanently = (pageIds: strs) => this.#change((nodes) => pageIds.forEach((id) => deleteNode(nodes, id)))

  rename = (id: str, name: str) => this.#change((upages) => (getNode(upages, id).name = name))
  setColor = (id: str, color: str) => this.#change((upages) => (getNode(upages, id).color = color))

  has = (id: str): bool => !!findNode(this.#structure.pages, id)
  isFavorite = (id: str): bool => this.#favorite.includes(id)
  path = (id: str): WorkspacePath => getPath(this.#structure.pages, id)
  topPaths = (): WorkspacePath => this.#structure.pages.map((n) => ({ id: n.id, name: n.name }))

  name = (id: str): str => safe(findNode(this.#structure.pages, id)).name
  color = (id: str): str => safe(findNode(this.#structure.pages, id)).color

  #change = (f: (nodes: UPageNodesData, deleted: DeletedUPageNodes) => void) => {
    const [newStructure, patches] = produceWithPatches(this.#structure, (draft) => {
      f(draft.pages, draft.trash) // not one liner to avoid return
    })

    this.#structure = newStructure
    this.#cr.change(patches)
    this.#update()
  }

  #getState = (): WorkspaceNav => ({
    favorite: getFavorite(this.#structure.pages, this.#favorite, this.#openness.openFavorite),
    personal: deriveOpenNodes(this.#structure.pages, this.#openness.open),
  })

  #update = () => {
    this.#nav = this.#getState()
    this.#setNav(this.state)
  }

  #updateDTO = () => this.#updateFavorite({ favorite: this.#favorite })
}

export let workspace: WorkspaceLookup = {
  getOwner: () => '',
  getPagesIn: () => [],
  topPaths: () => [],
}

const setWorkspace = (w: WorkspaceLookup) => (workspace = w)

const d = new WorkspaceOpenness()
export function useWorkspace(id: str) {
  const [data, setData] = useData('workspaces', id)
  const [openness, setOpenness] = useLocalStorage('openness', d)

  const [changer] = useState(() => new WorkspaceState(data, setData, openness, setOpenness))
  const [state, setState] = useState(changer.state)
  changer.setStateSetter(setState)

  useUpdateEffect(() => changer.applyUpdate(data), [data])
  setWorkspace(changer)

  return {
    state,
    changer,
  }
}

export function _generateTestWS(nodes: UPageNodes, favorite = [] as strs): WorkspaceDTO {
  nodes = JSON.parse(
    JSON.stringify(nodes, function (k, v) {
      return k === 'id' ? sslugify(this.name) : v
    }),
  )

  const structure: WorkspaceStructure = { pages: nodes, trash: [] }
  const dto: WorkspaceDTO = { favorite, updates: getInitialWorkspace() }
  const wcr = new WorkspaceCR([...dto.updates], (u) => dto.updates.push(u))

  wcr.change(
    produceWithPatches(wcr.state, (draft) => {
      draft.pages = structure.pages // if structure is returned patch will contain single replace op with empty path
    })[1],
  )

  return dto
}

class TestWorkspaceState extends WorkspaceState {
  constructor(structure: WorkspaceStructure, openness: WorkspaceOpenness) {
    const dto = _generateTestWS(structure.pages)
    super(dto, f, openness, f, f)
  }
}

export function useTestWorkspace(
  structure: WorkspaceStructure,
  openness: WorkspaceOpenness = { open: [], openFavorite: [] },
) {
  const [changer] = useState(() => new TestWorkspaceState(structure, openness))
  const [state, setState] = useState(changer.state)
  changer.setStateSetter(setState)

  setWorkspace(changer)

  return {
    ublocks: state,
    changer: changer,
  }
}

function getFavorite(nodes: UPageNodesData, favorite: strs, openFavorite: strs): UPageNodes {
  const r = [] as UPageNodes

  const queue = [...nodes]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node?.children) queue.push(...node.children)
    if (favorite.includes(node.id)) {
      const favoriteNode = structuredClone(node) as UPageNode
      if (openFavorite.includes(favoriteNode.id)) favoriteNode._isOpen = true
      r.push(favoriteNode)
    }
  }

  return r
}

function deriveOpenNodes(nodes: UPageNodesData, open: strs): UPageNodes {
  const r = structuredClone(nodes) as UPageNodes // cannot modify original nodes otherwise isOpen will be serialized

  const queue = [...r]

  while (queue.length) {
    const node = safe(queue.shift())
    if (open.includes(node.id)) {
      node._isOpen = true
    }

    if (node?.children) queue.push(...node.children)
  }

  return r
}

function getNode(nodes: UPageNodesData, id: str): UPageNodeData {
  const queue = [...nodes]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node.id === id) return node
    if (node?.children) queue.push(...node.children)
  }

  throw new Error('WS node not found')
}

function bfsNodes(nodes: UPageNodesData): UPageNodesData {
  const r = [] as UPageNodesData
  const queue = [...nodes]

  while (queue.length) {
    const node = safe(queue.shift())
    r.push(node)
    if (node?.children) queue.push(...node.children)
  }

  return r
}

function getPath(nodes: UPageNodesData, id: str): WorkspacePath {
  const queue = [...nodes]
  const nodeAndParent = new Map<UPageNodeData, UPageNodeData>()

  while (queue.length) {
    let node = safe(queue.shift())
    if (node.id === id) {
      const path = [{ id: node.id, name: node.name }] as WorkspacePath

      while (nodeAndParent.has(node)) {
        node = safe(nodeAndParent.get(node))
        path.unshift({ id: node.id, name: node.name })
      }

      return path
    }

    if (node?.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }

  throw new Error('WS Node not found')
}

function findNode(nodes: UPageNodesData, id: str): UPageNodeData | undefined {
  const queue = [...nodes]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node.id === id) return node
    if (node?.children) queue.push(...node.children)
  }
}

function deleteNode(nodes: UPageNodesData, id: str): UPageNodeData {
  const queue = [...nodes]
  const nodeAndParent = new Map<UPageNodeData, UPageNodeData>()

  while (queue.length) {
    const node = safe(queue.shift())
    if (node.id === id) {
      if (nodeAndParent.has(node)) {
        const parent = safe(nodeAndParent.get(node))
        const children = safe(parent.children)
        const i = children.findIndex((n) => n.id === id)
        children.splice(i, 1)
        if (!parent.children?.length) delete parent.children
      } else {
        const i = nodes.findIndex((n) => n.id === id)
        nodes.splice(i, 1)
      }
      return node
    }

    if (node?.children) {
      queue.push(...node.children)
      node.children.forEach((c) => nodeAndParent.set(c, node))
    }
  }

  throw new Error('WS Node not found')
}

function insertNode(nodes: UPageNodesData, parentId: str, underId: str, id: str) {
  const queue = [...nodes]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node.id === parentId) {
      if (!node.children) {
        node.children = [{ id, color: node.color, name: '' }]
      } else {
        const children = node.children
        const i = children.findIndex((n) => n.id === underId)
        children.splice(i + 1, 0, { id, color: node.color, name: '' })
      }
      return
    }

    if (node?.children) queue.push(...node.children)
  }
}

function insertNodeAsLast(nodes: UPageNodesData, parentId: str, node: UPageNodeData) {
  const queue = [...nodes]

  while (queue.length) {
    const parentNode = safe(queue.shift())
    if (parentNode.id === parentId) {
      if (!parentNode.children) parentNode.children = []
      parentNode.children.push(node)
      return
    }

    if (parentNode?.children) queue.push(...parentNode.children)
  }
}

function getPrevNode(nodes: UPageNodesData, id: str): UPageNodeData | undefined {
  const bfs = bfsNodes(nodes)
  const i = bfs.findIndex((node) => node.id === id)
  if (i < 1) return
  return bfs[i - 1]
}

type O = {
  sendUpdate?: (u: Bytes) => void
  sendDTO?: (d: { favorite: strs }) => void
  updateOpenness?: (o: WorkspaceOpenness) => void
}

export function _getWS(nodes: UPageNodesData, o: O = { sendUpdate: f, sendDTO: f, updateOpenness: f }) {
  const wsUpdates: Bytes[] = getInitialWorkspace()
  const cr = new WorkspaceCR([...wsUpdates], (u) => wsUpdates.push(u))
  nodes.forEach((n, i) => cr.change([{ op: 'add', path: ['pages', i], value: n }]))

  const bfs = bfsNodes(nodes)

  const favorite = [] as strs
  bfs.forEach((n) => {
    if (n.id.startsWith('*')) favorite.push(n.id)
  })

  return new WorkspaceState(
    { updates: wsUpdates, favorite },
    o.sendDTO || f,
    { open: [], openFavorite: [] },
    o.updateOpenness || f,
    o.sendUpdate,
  )
}

export function _navToStr(nav: WorkspaceNav): str {
  const nodeToStr = (node: UPageNode): str => {
    let nodeAsStr = node.color === 'red' ? `${node.name}` : `${node.name}, ${node.color}`
    if (node._isOpen) nodeAsStr += '^'
    if (!node.children) return '{' + nodeAsStr + '}'
    return `{${nodeAsStr}, [${node?.children.map((n) => nodeToStr(n)).join()}]}`
  }

  const personal = nav.personal.map((n) => nodeToStr(n))
  const fav = nav.favorite.map((n) => nodeToStr(n))
  if (!fav.length) return `[${personal.join()}]`
  return `f: [${fav.join()}] p: [${personal.join()}]`
}
