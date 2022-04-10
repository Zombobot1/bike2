import { num, str } from '../../utils/types'
import { UFormLikeData } from '../editing/UPage/ublockTypes'

export type WordUCardType = 'name' | 'explain' | 'spell' | 'say' // name: meaning -> word, explain: word -> meaning
export type WordUCardTypes = WordUCardType[]

export type TextOcclusionUCard = { ublockId: str; i: num }

export type UCardData = WordUCardTypes | TextOcclusionUCard[]
export interface UCard {
  id: str
  data: UCardData
  timeToAnswer: num
  priority: num
}
export type UCards = UCard[]

export type IdeaType = 'word' | 'text' | 'image'

export interface IdeaData extends UFormLikeData {
  $error?: str
  type?: IdeaType
  ucards?: UCards
}
