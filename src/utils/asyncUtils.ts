import { num } from './types'
import { sort } from './algorithms'

// sequence without results impossible
export const sequence = async <T>(queue: Promise<T>[]): Promise<T[]> => {
  const result: { d: T; i: num }[] = []
  // eslint-disable-next-line no-restricted-syntax,no-await-in-loop
  for (let i = 0; i < queue.length; i++) result.push({ d: await queue[i], i })
  return sort(result, (e) => e.i).map((e) => e.d)
}

export const parallel = <T>(queue: Promise<T>[]): Promise<T[]> => Promise.all(queue)
