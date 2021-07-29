import { rest, setupWorker } from 'msw'
import { cardForUpdate, trainingDecks, trainings } from '../content/content'
import { BASE_URL } from './axi'
import {
  CARD,
  GET_TRAINING,
  GET_TRAINING_UPDATE_ON_ANSWER,
  GET_TRAININGS_GROUPS,
  POST_FCM_TOKEN,
  UBLOCKS,
  UBLOCK,
} from './api'
import { w, WR } from '../utils/msw-utils'
import { sleep, uuid } from '../utils/utils'
import { blocksS } from '../components/ucomponents/UText/stubs'

/* eslint prefer-const: 0 */

let getTrainingsGroups = () => trainingDecks
let getTraining = (r: WR) => Object.entries(trainings).filter(([k]) => k === r.params.id)[0][1]
let getStrBlock = (r: WR) => blocksS.get(r.params.id) || {}
let postStrBlock = () => ({ _id: uuid() })
let putStrBlock = () => ({})
let getTrainingUpdateOnAnswer = (r: WR) => (r.url.searchParams.get('cardId') === 'get update' ? [cardForUpdate] : [])
let deleteCard = () => []
let subscribe = () => ({})

export const _FAIL = '/_fail'
export const _SLOW_LOAD = '/_slow'
export const _DTO = '/_dto'

const dto = () => ({ data: 'some data in dto' })

export const handlers = [
  rest.get(`${BASE_URL}${GET_TRAININGS_GROUPS}`, w(getTrainingsGroups)),
  rest.get(`${BASE_URL}${GET_TRAINING_UPDATE_ON_ANSWER}`, w(getTrainingUpdateOnAnswer)),
  rest.get(`${BASE_URL}${GET_TRAINING}`, w(getTraining)),
  rest.delete(`${BASE_URL}${CARD}`, w(deleteCard)),

  rest.post(`${BASE_URL}${POST_FCM_TOKEN}`, w(subscribe)),

  rest.post(`${BASE_URL}${UBLOCKS}`, w(postStrBlock)),
  rest.put(`${BASE_URL}${UBLOCK}`, w(putStrBlock)),
  rest.get(`${BASE_URL}${UBLOCK}`, w(getStrBlock)),

  rest.get(`${BASE_URL}${_DTO}`, w(dto)),
  rest.get(`${BASE_URL}${_SLOW_LOAD}`, async (_, res, ctx) => {
    await sleep(2000)
    return res(ctx.json({ data: 'some data in dto' }))
  }),
  rest.get(`${BASE_URL}${_FAIL}`, (_req, res, ctx) => {
    return res(ctx.status(404), ctx.json({ message: `Not found` }))
  }),
]

export const startWorker = async () => {
  const worker = setupWorker(...handlers)
  await worker.start()
}
