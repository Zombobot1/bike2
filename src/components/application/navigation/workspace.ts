import { bool, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { addData, useData } from '../../utils/hooks/useData'
import { NavNodeDTO, NavNodeDTOO, NavNodeDTOs } from './NavBar/NavTree'

type Scope = 'FAVORITE' | 'PERSONAL'

export interface _WSD {
  favorite: NavNodeDTOs
  personal: NavNodeDTOs
}

export class WS {
  triggerOpen = (scope: Scope) => (id: str) => {
    const node = safe(this._find(scope, id))
    node.isOpen = !node.isOpen
    this._save()
  }

  isFavorite = (id: str): bool => Boolean(this.favorite.find((n) => n.id === id))
  triggerFavorite = (id: str) => () => this.isFavorite(id) ? this._removeFromFavorite(id) : this._addToFavorite(id)

  delete = (id: str): str => {
    const deletePage = (scope: Scope, id: str): str => {
      const parent = this._parents(scope).get(id)
      if (parent) {
        parent.children = parent?.children?.filter((c) => c.id !== id)
        return parent.id
      } else {
        if (scope === 'FAVORITE') this.favorite = this.favorite.filter((n) => n.id !== id)
        else this.personal = this.personal.filter((n) => n.id !== id)
      }
      return this.personal[0].id || 'study'
    }

    if (this._find('FAVORITE', id)) deletePage('FAVORITE', id)
    const parentId = deletePage('PERSONAL', id)
    this._save()
    return parentId
  }

  path = (id: str): NavNodeDTOs => {
    const parents = this._parents('PERSONAL')

    const r: NavNodeDTOs = [this.find(id)]
    while (parents.has(r[0].id)) r.unshift(safe(parents.get(r[0].id)))
    return r
  }

  find = (id: str): NavNodeDTO => safe(this._find('PERSONAL', id))
  has = (id: str): bool => Boolean(this._find('PERSONAL', id))

  constructor(public favorite: NavNodeDTOs, public personal: NavNodeDTOs, private _id: str) {}

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
    const nodes = scope === 'FAVORITE' ? this.favorite : this.personal

    const queue = [...nodes]
    const r: NavNodeDTOs = []

    while (queue.length) {
      const node = safe(queue.shift())
      if (node?.children) queue.push(...node.children)
      r.push(node)
    }

    return r
  }

  _save = () => addData<_WSD>('ws', this._id, { favorite: this.favorite, personal: this.personal })

  _parents = (scope: Scope): Map<str, NavNodeDTO> => {
    const queue = scope === 'PERSONAL' ? [...this.personal] : [...this.favorite]
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
  const [data] = useData<_WSD>('ws', id)
  return new WS(data.favorite, data.personal, id)
}
