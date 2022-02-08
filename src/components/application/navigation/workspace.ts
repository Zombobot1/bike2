import { bool, f, str, strsP } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { useData } from '../../../fb/useData'
import { NavNodeDTO, NavNodeDTOO, NavNodeDTOs } from './NavBar/NavTree'
import { parallel } from '../../../utils/asyncUtils'

type Scope = 'favorite' | 'personal'

export interface _WSD {
  favorite: NavNodeDTOs
  personal: NavNodeDTOs
}
type SetWSD = (f: Partial<_WSD>) => void

export class WS {
  triggerOpen = (scope: Scope) => (id: str) => {
    const node = safe(this._find(scope, id))
    node.isOpen = !node.isOpen
    this._save()
  }

  isFavorite = (id: str): bool => Boolean(this.favorite.find((n) => n.id === id))
  triggerFavorite = (id: str) => () => this.isFavorite(id) ? this._removeFromFavorite(id) : this._addToFavorite(id)

  delete = (id: str, getIds: (id: str) => strsP, deleteBlock: (id: str) => void): str => {
    const deletePage = (scope: Scope, id: str): str => {
      const parent = this._parents(scope).get(id)
      if (parent) {
        parent.children = parent?.children?.filter((c) => c.id !== id)
        return parent.id
      } else {
        if (scope === 'favorite') this.favorite = this.favorite.filter((n) => n.id !== id)
        else this.personal = this.personal.filter((n) => n.id !== id)
      }
      return this.personal[0].id || 'study'
    }

    const pagesToRemove = bfs(this.find(id)).map((n) => n.id)
    parallel(pagesToRemove.map((pageId) => getIds(pageId))).then((pages) =>
      pages.forEach((ids) => ids.forEach((blockId) => deleteBlock(blockId))),
    )

    if (this._find('favorite', id)) deletePage('favorite', id)
    const parentId = deletePage('personal', id)
    this._save()
    return parentId
  }

  rename = (id: str, name: str) => {
    this.find(id).name = name
    this._save()
  }

  insert = (id: str, parentId?: str, underId?: str) => {
    if (!parentId) this.personal.unshift({ id, name: '' })
    else {
      const parent = this.find(parentId)
      if (!underId || !parent.children || !parent.children.length) parent.children = [{ id, name: '' }]
      else {
        const indexAbove = parent.children.findIndex(({ id }) => id === underId)
        parent.children = parent.children.splice(indexAbove, 0, { id, name: '' })
      }
    }
    this._save()
  }

  path = (id: str): NavNodeDTOs => {
    const parents = this._parents('personal')

    const r: NavNodeDTOs = [this.find(id)]
    while (parents.has(r[0].id)) r.unshift(safe(parents.get(r[0].id)))
    return r
  }

  find = (id: str): NavNodeDTO => safe(this._find('personal', id))
  has = (id: str): bool => Boolean(this._find('personal', id))

  constructor(
    public favorite: NavNodeDTOs,
    public personal: NavNodeDTOs,
    private _id: str,
    private saveFn: SetWSD = f,
  ) {}

  _addToFavorite = (id: str) => {
    this.favorite.unshift(safe(this.find(id)))
    this._save()
  }

  _removeFromFavorite = (id: str) => {
    this.favorite = this.favorite.filter((n) => n.id !== id)
    this._save()
  }

  _find = (scope: Scope, id: str): NavNodeDTOO => {
    return this._bfs(scope).find((n) => n.id === id)
  }

  _bfs = (scope: Scope): NavNodeDTOs => {
    const nodes = scope === 'favorite' ? this.favorite : this.personal

    const queue = [...nodes]
    const r: NavNodeDTOs = []

    while (queue.length) {
      const node = safe(queue.shift())
      if (node?.children) queue.push(...node.children)
      r.push(node)
    }

    return r
  }

  _save = () => this.saveFn({ favorite: this.favorite, personal: this.personal })
  _setSave = (fn: SetWSD) => (this.saveFn = fn)

  _parents = (scope: Scope): Map<str, NavNodeDTO> => {
    const queue = scope === 'personal' ? [...this.personal] : [...this.favorite]
    const idAndParent = new Map<str, NavNodeDTO>()

    while (queue.length) {
      const node = safe(queue.shift())
      if (node?.children) queue.push(...node.children)
      node.children?.forEach((c) => idAndParent.set(c.id, node))
    }

    return idAndParent
  }
}

export function useWorkspace(id: str) {
  const [data, setData] = useData<_WSD>('ws', id)
  const r = new WS(data.favorite, data.personal, id)
  r._setSave(setData)
  return r
}

function bfs(node: NavNodeDTO): NavNodeDTOs {
  const queue = [...(node.children ? node.children : [])]
  const r: NavNodeDTOs = [node]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node?.children) queue.push(...node.children)
    r.push(node)
  }

  return r
}
