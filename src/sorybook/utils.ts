import { FC } from 'react'
import { ComponentWithStories } from './sorybook'

type Storieble = { [p: string]: FC }
type RawComponent = { [p: string]: Storieble }
export function storify(obj: RawComponent): ComponentWithStories {
  const [name, stories] = Object.entries(obj)[0]
  function storyName(name: string) {
    const r = name.slice(1).replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
    return name.charAt(0) + r
  }
  return { name, stories: Object.entries(stories).map(([k, s]) => ({ name: storyName(k), story: s })) }
}
