import { Bytes } from 'firebase/firestore'
import { bool, num, str, strs } from '../utils/types'

export type FSSchema = {
  upages: UPageDTO
  workspaces: WorkspaceDTO
  ideas: IdeaDTO
  trainings: TrainingDTO
  upageChanges: UPageChangeDescriptionDTO
  deletedFiles: DeleteFileDTO
  _t: { d: str }
}

export interface WorkspaceDTO {
  favorite: strs
  updates: Bytes[]
}

export interface UPageDTO {
  updates: Bytes[]
}

export class IdeaDTO {
  ownerId = ''
  upageId = ''
  updates: Bytes[] = []
  deletedAt?: num
  builtIn?: bool
}

export interface TrainingDTO {
  upageId: str
  preview: str
  dataId: str
  idAndIndicators: { [key: str]: TrainingIndicators }
  frozen?: bool
  repeatAt: num
  createdAt: num // consistent sorting is required
}
export type TrainingDTOs = TrainingDTO[]
export type UCardPriority = 'low' | 'medium' | 'high'
export type TrainingIndicators = {
  repeatAt: num
  timeToAnswer: num
  priority: UCardPriority
  stageId: str
  errorRate: num
  frozen?: bool
}

export interface UPageChangeDescriptionDTO {
  upageId: str
  sha: str
  user: str
  date: num
  preview: ChangePreview
  block?: str
}
export type UPageChangeDescriptionDTOs = UPageChangeDescriptionDTO[]
export enum PreviewTag {
  no,
  em,
  s,
  b,
  br,
}
export type PreviewItem = { data?: str; tag: PreviewTag }
export type ChangePreview = PreviewItem[]

export interface DeleteFileDTO {
  src: str
  deletedAt: num
}
export type DeleteFileDTOs = DeleteFileDTO[]
