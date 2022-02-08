import randomColor from 'randomcolor'
import { NavNodeDTOs } from '../components/application/navigation/NavBar/NavTree'
import { _WSD } from '../components/application/navigation/workspace'
import { safe } from '../utils/utils'

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
          children: [
            {
              id: 'grow-kitten',
              name: 'How to grow a kitten',
            },
            {
              id: 'cats-vs-dogs',
              name: 'Cats vs Dogs',
            },
            {
              id: 'pets-research',
              name: 'Research papers about evolution of pets',
            },
            {
              id: 'how-pets-changed-humanity',
              name: 'How pets changed humanity',
            },
            {
              id: 'pets-test',
              name: 'Pets & Animals',
            },
            {
              id: 'pets-test-small',
              name: 'Pets & Animals',
            },
          ],
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
              children: [
                {
                  id: 'grow-kitten',
                  name: 'How to grow a kitten',
                },
                {
                  id: 'cats-vs-dogs',
                  name: 'Cats vs Dogs',
                },
                {
                  id: 'pets-research',
                  name: 'Research papers about evolution of pets',
                },
                {
                  id: 'how-pets-changed-humanity',
                  name: 'How pets changed humanity',
                },
                {
                  id: 'pets-test',
                  name: 'Pets & Animals',
                },
                {
                  id: 'pets-test-small',
                  name: 'Pets & Animals',
                },
              ],
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

const exclude = [
  'removal',
  'empty-page',
  'pets',
  'pets-test',
  'pets-test-small',
  'grow-kitten',
  'cats-vs-dogs',
  'pets-research',
  'how-pets-changed-humanity',
]
export const _pages = bfs(ws.personal).filter((p) => !exclude.includes(p.id))
// TODO: generate pages
// .map((n): IdAndBlock => {
//   const r: UPageDTO = { ids: [], name: n.name, color: randomColor({ luminosity: 'bright' }) }
//   return [n.id, { data: $(r), type: 'page' }]
// })
