import { Datum } from '@nivo/line';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformedMax = (arr: any, f: any) => Math.max(...arr.map(f));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sum = (arr: any, f: any) => arr.reduce(f, 0);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const avg = (arr: any, f: any): number => arr.reduce(f, 0) / arr.length;
export const datumAvg = (arr: Datum[]) => avg(arr, (p: number, e: Datum) => p + Number(e.y));

export const safeSplit = (str: string, sep: string | RegExp) => {
  const parts = str.split(sep);
  return parts.map((s) => s.trim()).filter((e) => e);
};

export const findAll = (str: string, regex: RegExp): string[] => {
  const result: string[] = [];

  let m = null;
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++; // This is necessary to avoid infinite loops with zero-width matches
    m.forEach((match) => result.push(match));
  }

  return result;
};

export const shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
