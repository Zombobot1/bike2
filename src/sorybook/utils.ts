import { FC } from 'react';
import { ComponentWithStories } from './sorybook';

type Storieble = { [p: string]: FC };
type RawComponent = { [p: string]: Storieble };
export function storify(obj: RawComponent): ComponentWithStories {
  const [name, stories] = Object.entries(obj)[0];
  return { name: name.slice(1), stories: Object.entries(stories).map(([k, s]) => ({ name: k, story: s })) };
}
