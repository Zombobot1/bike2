import { NavBar } from './NavBar'

const T = (props: NavBar) => NavBar(props)

const data1: NavBar = {
  trees: [
    {
      id: 'page1',
      name: 'opened page 1',
      isOpen: true,
      children: [
        {
          id: 'sub-page1',
          name: 'sub-page 1',
          isOpen: false,
        },
      ],
    },
    {
      id: 'page2',
      name: 'page 2',
      isOpen: false,
      children: [
        {
          id: 'sub-page2',
          name: 'sub-page 2',
          isOpen: false,
        },
        {
          id: 'sub-page3',
          name: 'sub-page 3',
          isOpen: false,
        },
      ],
    },
  ],
}
// check sub-page 1 is visible
export const FoldsAndUnfolds = () => T(data1)

export default {
  title: 'Utilities/NavBar',
  component: NavBar,
}
