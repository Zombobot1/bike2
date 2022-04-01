import { str, bool, num } from '../../../utils/types'

export interface UPageNodeDTO {
  id: str
  name: str
  color: str
  children?: UPageNodeDTO[]
}
export type UPageNodeDTOs = UPageNodeDTO[]

export interface UPageNode {
  id: str
  name: str
  color: str
  _isOpen?: bool
  children?: UPageNodes
}
export type UPageNodes = UPageNode[]

export interface DeletedUPageNode {
  node: UPageNode
  deletedAt: num
}
export type DeletedUPageNodes = DeletedUPageNode[]

export class WorkspaceStructure {
  pages = [] as UPageNodes
  trash = [] as DeletedUPageNodes
}

export type WorkspacePath = { id: str; name: str }[]
