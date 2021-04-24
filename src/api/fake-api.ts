import { rest, setupWorker } from 'msw';
import { card3, training, trainingDecks } from '../content';
import { BASE_URL } from './axi';
import { GET_TRAINING, GET_TRAINING_UPDATE_ON_ANSWER, GET_TRAININGS_GROUPS } from './api';

export const handlers = [
  rest.get(`${BASE_URL}${GET_TRAININGS_GROUPS}`, async (req, res, ctx) => {
    return res(ctx.json(trainingDecks));
  }),
  rest.get(`${BASE_URL}${GET_TRAINING_UPDATE_ON_ANSWER}`, async (req, res, ctx) => {
    const id = req.url.searchParams.get('cardId');
    if (id === '2') return res(ctx.json({ updatedAt: 'now', highestPriority: '2', cards: [card3] }));
    return res(ctx.json({ updatedAt: 'now', highestPriority: '2', cards: [] }));
  }),
  rest.get(`${BASE_URL}${GET_TRAINING}`, async (req, res, ctx) => {
    return res(ctx.json(training));
  }),
];

export const worker = setupWorker(...handlers);
