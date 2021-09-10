import { _WSD } from '../components/application/navigation/workspace'

export const ws: _WSD = {
  favorite: [
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      children: [
        {
          id: 'pets',
          name: 'Pets',
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
  ],
}
