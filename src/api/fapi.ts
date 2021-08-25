import { rest, setupWorker } from 'msw'
import { cardForUpdate, trainingDecks, trainings } from '../content/content'
import { BASE_URL } from './axi'
import { CARDS, ESTIMATE_ANSWER, TRAININGS, SUBSCRIBE, UBLOCKS, FILES } from './api'
import { w, WR } from '../utils/msw-utils'
import { sleep } from '../utils/utils'
import { blocksFileUploadS, blocksS } from '../components/editing/stubs'
import { str } from '../utils/types'

const urlId = (url: str) => url.split('/').slice(-1)[0]

export const _FAIL = '/_fail'
export const _SLOW_LOAD = '/_slow'
export const _DTO = '/_dto'

const dto = () => ({ data: 'some data in dto' })

const e = () => ({})

export const FAPI = {
  TRAININGS: `${BASE_URL}${TRAININGS}`,
  ESTIMATE_ANSWER: `${BASE_URL}${ESTIMATE_ANSWER}`,
  TRAINING: `${BASE_URL}${TRAININGS}*`,
  CARD: `${BASE_URL}${CARDS}*`,
  FCM_TOKEN: `${BASE_URL}${SUBSCRIBE}`,
  UBLOCKS: `${BASE_URL}${UBLOCKS}`,
  UBLOCK: `${BASE_URL}${UBLOCKS}*`,
  FILES: `${BASE_URL}${FILES}`,
  FILE: `${BASE_URL}${FILES}*`,

  getTrainingsGroups: () => trainingDecks,
  getTraining: (r: WR) => Object.entries(trainings).filter(([k]) => k === urlId(r.url.toString()))[0][1],
  getTrainingUpdateOnAnswer: (r: WR) => (r.url.searchParams.get('cardId') === 'get-update' ? [cardForUpdate] : []),
  getUBlock: (url: str) => blocksS.get(urlId(url)) || { type: 'TEXT', data: '' },
  postUBlock: e,
  patchUBlock: e,
  deleteUBlock: e,
  uploadFile: (r: WR) => ({ data: blocksFileUploadS(r.body) }),
  deleteFile: e,
  deleteCard: e,
  subscribe: e,
}

const handlers = [
  rest.get(FAPI.TRAININGS, w(FAPI.getTrainingsGroups)),
  rest.get(FAPI.ESTIMATE_ANSWER, w(FAPI.getTrainingUpdateOnAnswer)),
  rest.get(FAPI.TRAINING, w(FAPI.getTraining)),
  rest.delete(FAPI.CARD, w(FAPI.deleteCard)),

  rest.post(FAPI.UBLOCKS, w(FAPI.postUBlock)),
  rest.patch(FAPI.UBLOCK, w(FAPI.patchUBlock)),
  rest.get(
    FAPI.UBLOCK,
    w((r) => FAPI.getUBlock(r.url.toString())),
  ),
  rest.delete(FAPI.UBLOCK, w(FAPI.deleteUBlock)),

  rest.post(FAPI.FILES, w(FAPI.uploadFile)),
  rest.delete(FAPI.FILE, w(FAPI.deleteFile)),

  rest.post(FAPI.FCM_TOKEN, w(FAPI.subscribe)),

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
  return worker.start({ onUnhandledRequest: 'bypass' })
}
