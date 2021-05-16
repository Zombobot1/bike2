import { rest, setupWorker } from 'msw';
import { card3, trainingDecks, uTraining } from '../content';
import { BASE_URL } from './axi';
import { DELETE_CARD, GET_TRAINING, GET_TRAINING_UPDATE_ON_ANSWER, GET_TRAININGS_GROUPS } from './api';
import { w, WR } from '../utils/msw-utils';

/* eslint prefer-const: 0 */

let getTrainingsGroups = () => trainingDecks;
let getTraining = () => uTraining;
let getTrainingUpdateOnAnswer = (r: WR) => (r.url.searchParams.get('cardId') === '1' ? [card3] : []);
let deleteCard = () => [];
// let isFirst = true;
// getTraining = () => {
//   if (isFirst) {
//     isFirst = false;
//     return { ...uTraining, cards: [{ ...uCard, stageColor: 'red' }] };
//   }
//   return { ...uTraining, cards: [{ ...uCard, stageColor: 'blue' }] };
// };
// getTrainingUpdateOnAnswer = () => [];

export const handlers = [
  rest.get(`${BASE_URL}${GET_TRAININGS_GROUPS}`, w(getTrainingsGroups)),
  rest.get(`${BASE_URL}${GET_TRAINING_UPDATE_ON_ANSWER}`, w(getTrainingUpdateOnAnswer)),
  rest.get(`${BASE_URL}${GET_TRAINING}`, w(getTraining)),
  rest.delete(`${BASE_URL}${DELETE_CARD}`, w(deleteCard)),
];

export const startWorker = async () => {
  const worker = setupWorker(...handlers);
  await worker.start();
};
