import { str, bool, num } from '../../../utils/types'

export interface UPageNodeData {
  id: str
  name: str
  color: str
  children?: UPageNodeData[]
}
export type UPageNodesData = UPageNodeData[]

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
export type WorkspacePaths = WorkspacePath[]
