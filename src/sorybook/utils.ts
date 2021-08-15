import { FC } from 'react'
import { JSObjects, str } from '../utils/types'
import { ComponentWithStories, UseCases } from './sorybook'

type Storieble = { [p: string]: FC }

function _storify(componentName: str, obj: Storieble): ComponentWithStories {
  function storyName(name: string) {
    return name.charAt(0) + name.slice(1).replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
  }

  return {
    name: componentName,
    stories: Object.entries(obj).map(([k, s]) => ({ name: storyName(k), story: s })),
  }
}

type ComponentsWithStories = ComponentWithStories[]
type WithTitle = { title: str }
export function storify(storiesWithDefaults: JSObjects): UseCases {
  const useCaseAndComponents = new Map<str, ComponentsWithStories>()

  storiesWithDefaults.map((sWd) => {
    const entires = Object.entries(sWd)
    const info = entires.find(([k]) => k === 'default')
    if (!info) throw new Error('Story file does not contain default export')

    const title = info[1] as WithTitle
    const [useCaseName, componentName] = title.title.split('/')

    const stories = Object.fromEntries(entires.filter(([k]) => k !== 'default')) as Storieble
    const components = _storify(componentName, stories)

    if (!useCaseAndComponents.has(useCaseName)) useCaseAndComponents.set(useCaseName, [])
    useCaseAndComponents.get(useCaseName)?.push(components)
  })

  return Array.from(useCaseAndComponents.entries()).map(([name, components]) => ({ name, components }))
}
