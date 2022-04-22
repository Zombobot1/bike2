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
  // builtIn?: bool // users remove each other ideas if they have write access
}

export interface TrainingDTO {
  userId: str
  upageId: str // to access trainings in UPage
  preview: str
  ideaId: str
  indicators: TrainingIndicators[]
  frozen?: bool
  repeatAt: num
  createdAt: num // consistent sorting is required
}
export type TrainingIdAndDTO = TrainingDTO & { id: str }
export type TrainingIdAndDTOs = TrainingIdAndDTO[]
export type TrainingDTOs = TrainingDTO[]
export type UCardPriority = 'low' | 'medium' | 'high'
export type TrainingIndicators = {
  id: str // provide unique id for flashcards to transfer indicators when data is changed
  repeatAt: num
  timeToAnswer: num
  priority: UCardPriority
  stageId: str
  failNumber: num
  repeatNumber: num
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
  upageId: str
}
export type DeleteFileDTOs = DeleteFileDTO[]
