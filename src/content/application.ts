import randomColor from 'randomcolor'
import { NavNodeDTOs } from '../components/application/navigation/NavBar/NavTree'
import { _WSD } from '../components/application/navigation/workspace'
import { UPageDataDTO } from '../components/editing/UPage/UPage'
import { safe } from '../utils/utils'
import { IdAndBlock } from './types'

const $ = JSON.stringify

export const ws: _WSD = {
  favorite: [
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      children: [
        {
          id: 'pets',
          name: 'Pets & Animals',
        },
        {
          id: 'medicine',
          name: 'Medicine',
        },
      ],
    },
    {
      id: 'python',
      name: 'Python',
    },
  ],
  personal: [
    {
      id: 'informatics',
      name: 'Informatics',
      isOpen: true,
      children: [
        {
          id: 'python',
          name: 'Python',
          children: [
            {
              id: 'iteration-vs-generation',
              name: 'Iteration vs generation',
            },
          ],
        },
        {
          id: 'software-design-patterns',
          name: 'Software design patterns',
        },
      ],
    },
    {
      id: 'english',
      name: 'English',
      children: [
        {
          id: 'vocabulary',
          name: 'Vocabulary',
          children: [
            {
              id: 'pets',
              name: 'Pets & Animals',
            },
            {
              id: 'medicine',
              name: 'Medicine',
            },
          ],
        },
        {
          id: 'rules',
          name: 'Rules',
          children: [
            {
              id: 'verbs-collocations',
              name: 'Verbs & Collocations',
              children: [
                {
                  id: 'present-perfect-continues',
                  name: 'Present perfect continues',
                },
              ],
            },
            {
              id: 'articles',
              name: 'Articles',
            },
          ],
        },
      ],
    },
    {
      id: 'removal',
      name: 'Removal',
    },
    {
      id: 'empty-page',
      name: '',
    },
  ],
}

function bfs(nodes: NavNodeDTOs): NavNodeDTOs {
  const queue = [...nodes]
  const r: NavNodeDTOs = []

  while (queue.length) {
    const node = safe(queue.shift())
    if (node?.children) queue.push(...node.children)
    r.push(node)
  }

  return r
}

const exclude = ['removal', 'empty-page', 'pets']
export const _pages = bfs(ws.personal)
  .filter((p) => !exclude.includes(p.id))
  .map((n): IdAndBlock => {
    const r: UPageDataDTO = { ids: [], name: n.name, color: randomColor({ luminosity: 'bright' }) }
    return [n.id, { data: $(r), type: 'page' }]
  })