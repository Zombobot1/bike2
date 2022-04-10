import { enablePatches } from 'immer'
import { UPageNodes } from '../components/application/Workspace/types'
import { _generateTestWS } from '../components/application/Workspace/WorkspaceState'
import { UPageData } from '../components/editing/UPage/ublockTypes'
import { _generators } from '../components/editing/UPage/UPageState/crdtParser/_fakeUPage'
import { str } from '../utils/types'
import { safe } from '../utils/utils'
import { sslugify } from '../utils/sslugify'

enablePatches()

const color = '#0066FF'

const medium: UPageNodes = [
  {
    id: '',
    name: 'Medium',
    color,
    children: [{ id: '', name: 'Small', color }],
  },
]

const pets: UPageNodes = [
  {
    id: '',
    name: 'Pets and Animals',
    color,
    children: [
      { id: '', name: 'How to grow a kitten', color },
      { id: '', name: 'Cats vs Dogs', color },
      { id: '', name: 'Pets evolution', color },
      { id: '', name: 'How pets changed humanity', color },
    ],
  },
]

const ws: UPageNodes = [
  {
    id: '',
    name: 'Informatics',
    color,
    children: [
      {
        id: 'Python',
        name: 'Python',
        color,
        children: [{ id: '', name: 'Iteration vs generation', color }],
      },
    ],
  },
  {
    id: '',
    name: 'English',
    color,
    children: [
      {
        id: '',
        name: 'Vocabulary',
        color,
        children: [
          pets[0],
          {
            id: '',
            name: 'Medicine',
            color,
          },
        ],
      },
      {
        id: '',
        name: 'Rules',
        color,
        children: [
          {
            id: '',
            name: 'Verbs and Collocations',
            color,
            children: [{ id: '', name: 'Present perfect continues', color }],
          },
          {
            id: '',
            name: 'Articles',
            color,
          },
        ],
      },
    ],
  },
]

function generateIDs(nodes: UPageNodes) {
  nodes.map((node) => {
    node.id = sslugify(node.name)
    if (node.children) {
      generateIDs(node.children)
    }
  })
}

generateIDs(ws)
generateIDs(medium)
generateIDs(pets)

export const _wsDTOs = {
  lover: _generateTestWS(ws, ['vocabulary', 'python']),
  pets: _generateTestWS(pets),
  medium: _generateTestWS(medium),
  small: _generateTestWS([{ id: '', name: 'Small', color }]),
}

function bfsWs(): UPageNodes {
  const r = [] as UPageNodes

  const queue = [...ws]
  while (queue.length) {
    const node = safe(queue.shift())
    r.push(node)
    if (node.children) queue.push(...node.children)
  }

  return r
}

const { p } = _generators

export const _pagesForWs: [string, UPageData][] = bfsWs().map((node): [str, UPageData] => [
  node.id,
  { ublocks: node.children ? node.children.map((c) => p(c.id)) : [] },
])
