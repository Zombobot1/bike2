import { rest, setupWorker } from 'msw';
import { card3, training, trainingDecks } from '../content';
import { BASE_URL } from './axi';

export const handlers = [
  rest.get(`${BASE_URL}/trainings`, async (req, res, ctx) => {
    return res(ctx.json(trainingDecks));
  }),
  rest.get(`${BASE_URL}/trainings/:id/answers`, async (req, res, ctx) => {
    const id = req.url.searchParams.get('id');
    if (id === '2') return res(ctx.json([card3]));
    return res(ctx.json([]));
  }),
  rest.get(`${BASE_URL}/trainings/:id`, async (req, res, ctx) => {
    return res(ctx.json(training));
  }),
  rest.delete(`${BASE_URL}/trainings/:id`, async (req, res, ctx) => {
    return res(ctx.json({}));
  }),
];

export const worker = setupWorker(...handlers);
