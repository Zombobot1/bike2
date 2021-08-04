import { rest, setupWorker } from 'msw'
import { setupServer } from 'msw/node'
import { cardForUpdate, trainingDecks, trainings } from '../content/content'
import { BASE_URL } from './axi'
import { CARDS, ESTIMATE_ANSWER, TRAININGS, SUBSCRIBE, UBLOCKS, FILES } from './api'
import { w, WR } from '../utils/msw-utils'
import { sleep } from '../utils/utils'
import { blocksS } from '../components/ucomponents/stubs'
import { str } from '../utils/types'

const urlId = (url: str) => url.split('/').slice(-1)[0]

export const _FAIL = '/_fail'
export const _SLOW_LOAD = '/_slow'
export const _DTO = '/_dto'

const dto = () => ({ data: 'some data in dto' })

const e = () => ({})

const TRAININGS_F = `${BASE_URL}${TRAININGS}`
const ESTIMATE_ANSWER_F = `${BASE_URL}${ESTIMATE_ANSWER}`
const TRAINING_F = `${BASE_URL}${TRAININGS}*`
const CARD_F = `${BASE_URL}${CARDS}*`
const FCM_TOKEN_F = `${BASE_URL}${SUBSCRIBE}`
const UBLOCKS_F = `${BASE_URL}${UBLOCKS}`
const UBLOCK_F = `${BASE_URL}${UBLOCKS}*`
const FILES_F = `${BASE_URL}${FILES}`
const FILE_F = `${BASE_URL}${FILES}*`

const getTrainingsGroups = () => trainingDecks
const getTraining = (r: WR) => Object.entries(trainings).filter(([k]) => k === urlId(r.url.toString()))[0][1]
const getTrainingUpdateOnAnswer = (r: WR) => (r.url.searchParams.get('cardId') === 'get update' ? [cardForUpdate] : [])

const getStrBlock = (r: WR) => blocksS.get(urlId(r.url.toString())) || { type: 'TEXT', data: '' }
const postStrBlock = () => ({ _id: 'id' })
const patchStrBlock = e
const uploadFile = () => ({ data: 'http://uni.com/static/complex--name--uuid.pdf' })
const deleteFile = e
const deleteCard = e
const subscribe = e

const handlers = [
  rest.get(TRAININGS_F, w(getTrainingsGroups)),
  rest.get(ESTIMATE_ANSWER_F, w(getTrainingUpdateOnAnswer)),
  rest.get(TRAINING_F, w(getTraining)),
  rest.delete(CARD_F, w(deleteCard)),

  rest.post(UBLOCKS_F, w(postStrBlock)),
  rest.patch(UBLOCK_F, w(patchStrBlock)),
  rest.get(UBLOCK_F, w(getStrBlock)),

  rest.post(FILES_F, w(uploadFile)),
  rest.delete(FILE_F, w(deleteFile)),

  rest.post(FCM_TOKEN_F, w(subscribe)),

  rest.get(`${BASE_URL}${_DTO}`, w(dto)),
  rest.get(`${BASE_URL}${_SLOW_LOAD}`, async (_, res, ctx) => {
    await sleep(2000)
    return res(ctx.json({ data: 'some data in dto' }))
  }),
  rest.get(`${BASE_URL}${_FAIL}`, (_req, res, ctx) => {
    return res(ctx.status(404), ctx.json({ message: `Not found` }))
  }),
]

export const startWorker = () => {
  const worker = setupWorker(...handlers)
  return worker.start()
}

export const startServer = () => {
  const worker = setupServer(...handlers)
  return worker.listen()
}
