import { Datum } from '@nivo/line';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformedMax = (arr: any, f: any) => Math.max(...arr.map(f));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sum = (arr: any, f: any) => arr.reduce(f, 0);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const avg = (arr: any, f: any): number => arr.reduce(f, 0) / arr.length;
export const datumAvg = (arr: Datum[]) => avg(arr, (p: number, e: Datum) => p + Number(e.y));
