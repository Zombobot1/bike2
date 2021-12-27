import { FC } from 'react'
import { sort } from '../utils/algorithms'
import { sslugify } from '../utils/sslugify'
import { JSObjects, str, strs } from '../utils/types'
import { IdAndSory, SoryBook_, SoryTree } from './sorybook'

type Storieble = { [p: string]: FC }
type SoryBookPart = { tree: SoryTree; sories: IdAndSory }

function _storify(useCaseId: str, componentName: str, obj: Storieble, order: strs = []): SoryBookPart {
  const idAndStory = new Map<str, FC>()

  function getStoryName(name: str) {
    return name.charAt(0) + name.slice(1).replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
  }

  const componentId = `${useCaseId}--${sslugify(componentName)}`

  const stories = sort(Object.entries(obj), ([name]) => order.indexOf(name)).map(([k, s]) => {
    const storyName = getStoryName(k)
    const id = `${componentId}--${sslugify(storyName)}`
    idAndStory.set(id, s)
    return { id, name: storyName }
  })

  return {
    tree: {
      id: componentId,
      name: componentName,
      children: stories,
    },
    sories: idAndStory,
  }
}

type WithTitle = { title: str; order?: strs }
export function storify(storiesWithDefaults: JSObjects, sections: strs): SoryBook_ {
  const useCaseAndComponents = new Map<str, SoryTree[]>()
  let idsAndStories = new Map<str, FC>()

  storiesWithDefaults.map((sWd) => {
    const entires = Object.entries(sWd)
    const info = entires.find(([k]) => k === 'default')
    if (!info) throw new Error('Story file does not contain default export')

    const title = info[1] as WithTitle
    const [useCaseName, componentName] = title.title.split('/')
    const useCaseId = sslugify(useCaseName)
    const stories = Object.fromEntries(entires.filter(([k]) => k !== 'default')) as Storieble
    const { tree: component, sories: newIdsAndStories } = _storify(useCaseId, componentName, stories, title.order)

    idsAndStories = new Map([...idsAndStories, ...newIdsAndStories])
    if (!useCaseAndComponents.has(useCaseName)) useCaseAndComponents.set(useCaseName, [])
    useCaseAndComponents.get(useCaseName)?.push(component)
  })

  const tree = sort(Array.from(useCaseAndComponents.entries()), ([name]) => sections.indexOf(name)).map(
    ([name, components]) => ({
      id: sslugify(name),
      name,
      children: components,
    }),
  )

  return { trees: tree, sories: idsAndStories }
}
