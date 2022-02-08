import { UBlock, UPageData } from '../components/editing/UPage/types'
import { str } from '../utils/types'
import { uuid } from '../utils/uuid'

export type IdAndPage = [str, UPageData]

export const _es = (): UBlock => ({ id: uuid(), type: 'text', data: '' })
