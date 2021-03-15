import { priorityQueue } from './priority-queue';
type PD = { p: number; d: string };

test('top returns min', () => {
  const top = { p: 1, d: '1' };
  const pq = priorityQueue((pd: PD) => pd.p, [{ p: 2, d: '2' }, top]);
  expect(pq.top()).toBe(top);
});

test('pop returns min', () => {
  const secondTop = { p: 2, d: '2' };
  const pq = priorityQueue((pd: PD) => pd.p, [{ p: 1, d: '1' }, secondTop]);
  const newPQ = pq.pop();
  expect(newPQ.top()).toBe(secondTop);
});

test('insert empty [] does not affect size', () => {
  const pq = priorityQueue((pd: PD) => pd.p, [{ p: 1, d: '1' }]);
  expect(pq.insert([]).size()).toBe(1);
});
