import { str } from '../../utils/types'
import { UFormLikeData } from '../editing/UPage/ublockTypes'

// export type WordUCardType = 'name' | 'explain' | 'spell' | 'say' // name: meaning -> word, explain: word -> meaning
// export type WordUCardTypes = WordUCardType[]

// export type TextOcclusionUCard = { ublockId: str; i: num }

// export type UCardData = WordUCardTypes | TextOcclusionUCard[]
// export interface UCard {
//   id: str
//   data: UCardData
// }
// export type UCards = UCard[]

export type IdeaType = 'question' | 'error' | 'word' | 'text' | 'image'

export type IdeaSchedule = 'usual' | 'short'
export interface IdeaRelatedData {
  type?: IdeaType
  // ucards?: UCards
  schedule?: IdeaSchedule // TODO: on creation user can set schedule, on edit it can be changed
}

export interface IdeaData extends UFormLikeData, IdeaRelatedData {
  $error?: str
}
