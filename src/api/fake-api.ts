import { rest, setupWorker } from 'msw'
import { setupServer } from 'msw/node'
import { cardForUpdate, trainingDecks, trainings } from '../content/content'
import { BASE_URL } from './axi'
import { CARDS, ESTIMATE_ANSWER, TRAININGS, SUBSCRIBE, UBLOCKS } from './api'
import { w, WR } from '../utils/msw-utils'
import { sleep } from '../utils/utils'
import { blocksS } from '../components/ucomponents/stubs'
import { str } from '../utils/types'

const urlId = (url: str) => url.split('/').slice(-1)[0]

export const _FAIL = '/_fail'
export const _SLOW_LOAD = '/_slow'
export const _DTO = '/_dto'

const dto = () => ({ data: 'some data in dto' })

export const FAPI = {
  TRAININGS: `${BASE_URL}${TRAININGS}`,
  ESTIMATE_ANSWER: `${BASE_URL}${ESTIMATE_ANSWER}`,
  TRAINING: `${BASE_URL}${TRAININGS}*`,
  CARD: `${BASE_URL}${CARDS}*`,
  FCM_TOKEN: `${BASE_URL}${SUBSCRIBE}`,
  UBLOCKS: `${BASE_URL}${UBLOCKS}`,
  UBLOCK: `${BASE_URL}${UBLOCKS}*`,

  getTrainingsGroups: () => trainingDecks,
  getTraining: (url: str) => Object.entries(trainings).filter(([k]) => k === urlId(url))[0][1],
  getStrBlock: (url: str) => blocksS.get(urlId(url)) || { type: 'TEXT', data: '' },
  postStrBlock: () => ({ _id: 'id' }),
  patchStrBlock: () => ({}),
  getTrainingUpdateOnAnswer: (url: str) => (urlId(url) === 'get update' ? [cardForUpdate] : []),
  deleteCard: () => [],
  subscribe: () => ({}),
}

const handlers = [
  rest.get(FAPI.TRAININGS, w(FAPI.getTrainingsGroups)),
  rest.get(
    FAPI.ESTIMATE_ANSWER,
    w((r: WR) => FAPI.getTrainingUpdateOnAnswer(r.url.searchParams.get('cardId') || '')),
  ),
  rest.get(
    FAPI.TRAINING,
    w((r: WR) => FAPI.getTraining(r.url.toString())),
  ),
  rest.delete(FAPI.CARD, w(FAPI.deleteCard)),

  rest.post(FAPI.FCM_TOKEN, w(FAPI.subscribe)),

  rest.post(FAPI.UBLOCKS, w(FAPI.postStrBlock)),
  rest.patch(FAPI.UBLOCK, w(FAPI.patchStrBlock)),
  rest.get(
    FAPI.UBLOCK,
    w((r: WR) => FAPI.getStrBlock(r.url.toString())),
  ),

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
