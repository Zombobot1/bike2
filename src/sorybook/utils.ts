import { FC } from 'react';
import { ComponentWithStories } from './sorybook';
import { capitalizeOnlyFirstLetter } from '../utils/utils';

type Storieble = { [p: string]: FC };
type RawComponent = { [p: string]: Storieble };
export function storify(obj: RawComponent): ComponentWithStories {
  const [name, stories] = Object.entries(obj)[0];
  function storyName(name: string) {
    return capitalizeOnlyFirstLetter(name.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`));
  }
  return { name: name.slice(1), stories: Object.entries(stories).map(([k, s]) => ({ name: storyName(k), story: s })) };
}
