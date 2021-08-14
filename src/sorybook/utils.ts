import { FC } from 'react'
import { JSObject } from '../utils/types'
import { ComponentWithStories, Sories, UseCases } from './sorybook'

type Storieble = { [p: string]: FC }

export function storify(obj: JSObject): ComponentWithStories {
  const [name, rawStories] = Object.entries(obj)[0]
  function storyName(name: string) {
    const r = name.slice(1).replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
    return name.charAt(0) + r
  }

  const stories = Object.fromEntries(Object.entries(rawStories).filter(([k]) => k !== 'default')) as Storieble

  return {
    name: name.slice(0, name.length - 1),
    stories: Object.entries(stories).map(([k, s]) => ({ name: storyName(k), story: s })) as Sories,
  }
}
