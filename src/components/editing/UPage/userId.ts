import { str } from '../../../utils/types'

let userId = ''

export const getUserId = () => userId
export const setUserId = (id: str) => (userId = id)
