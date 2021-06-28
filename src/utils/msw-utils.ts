import { DefaultRequestBody, RequestParams, RestRequest } from 'msw';
import { JSObject } from './types';

export type WR = RestRequest<DefaultRequestBody, RequestParams>;

export const w =
  (f: (r: WR) => JSObject) =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any,
  ) =>
    res(ctx.json(f(req)));
