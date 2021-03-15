export interface PriorityQueue<T> {
  insert(item: T | T[]): PriorityQueue<T>;

  _insert(item: T): void;

  top(): T;

  pop(): PriorityQueue<T>;

  _pop(): T;

  size(): number;

  isEmpty(): boolean;

  toArray(): T[];
}

export const priorityQueue = <T>(getPriority: (o: T) => number, initialData: T[] = []): PriorityQueue<T> => {
  const priority = getPriority;
  const data: [number, T][] = initialData.map((e) => [priority(e), e]);

  const clone = (): PriorityQueue<T> =>
    priorityQueue(
      priority,
      data.map((e) => e[1]),
    );

  return {
    insert: (elems: T | T[]) => {
      const result = clone();
      if (!Array.isArray(elems)) elems = [elems];
      elems.forEach((e) => result._insert(e));
      return result;
    },

    _insert: (i: T) => data.push([priority(i), i]),

    isEmpty: () => data.length == 0,

    top: () => data.reduce((min, current) => (current[0] < min[0] ? current : min))[1],

    pop: (): PriorityQueue<T> => {
      const result = clone();
      result._pop();
      return result;
    },

    _pop: () => {
      let min = data[0];
      let minIndex = 0;
      data.forEach((item, index) => {
        if (item[0] < min[0]) {
          min = item;
          minIndex = index;
        }
      });

      data.splice(minIndex, 1);

      return min[1];
    },

    size: () => data.length,

    toArray: () => data.map((e) => e[1]),
  };
};
