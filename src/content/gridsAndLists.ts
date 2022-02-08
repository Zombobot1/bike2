import { UBlock, UGridData, UListData, UPageBlockData } from '../components/editing/UPage/types'
import { _es } from './types'

const bathYourCat: UBlock = { id: 'bath-your-cat', type: 'text', data: 'Bath your cat' }
const bathListStep1: UBlock = { id: 'bath-your-cat-step1', type: 'text', data: 'Gather your supplies' }
const bathListStep2: UBlock = { id: 'bath-your-cat-step2', type: 'text', data: 'Rinse your cat' }
const bathList: UListData = [
  { ublock: bathListStep1 },
  { ublock: bathListStep2 },
  { ublock: { id: 'bath-your-cat-step3', type: 'text', data: 'Lather your cat with shampoo' } },
  { ublock: { id: 'bath-your-cat-step4', type: 'text', data: 'Rinse your cat again' } },
  { ublock: { id: 'bath-your-cat-step5', type: 'text', data: 'Clean the face' } },
]
const bathYourCatList: UBlock = { id: 'bath-your-cat-list', type: 'numbered-list', data: bathList }

const healthyCat: UBlock = { id: 'healthy-cat', type: 'text', data: 'Keep your cat healthy' }
const healthyList: UListData = [
  {
    ublock: { id: 'healthy-cat1', type: 'text', data: 'How to keep your cat healthy' },
    children: [
      { ublock: { id: 'healthy-cat11', type: 'text', data: 'Brush your cat every day.' } },
      { ublock: { id: 'healthy-cat12', type: 'text', data: 'Do not feed your cat too much dry food.' } },
      { ublock: { id: 'healthy-cat13', type: 'text', data: "Pay Attention to Your Pet's Thirst." } },
    ],
  },
  {
    ublock: { id: 'unhealthy-cat1', type: 'text', data: 'Signs & Symptoms of unhealthy cat' },
    children: [
      { ublock: { id: 'unhealthy-cat11', type: 'text', data: 'Sudden change in mood.' } },
      { ublock: { id: 'unhealthy-cat12', type: 'text', data: 'No inclination to play or appearing lethargic.' } },
      { ublock: { id: 'unhealthy-cat13', type: 'text', data: 'Much less or much more vocal than usual.' } },
    ],
  },
]
const healthyCatList: UBlock = { id: 'healthy-cat-list', type: 'toggle-list', data: healthyList }

const whyOwnCat: UBlock = { id: 'why-own-cat', type: 'text', data: 'Why you should own a cat' }
const whyOwnCat1: UBlock = { id: 'why-own-cat-point1', type: 'text', data: 'Cats can bathe themselves' }
const whyOwnCat2: UBlock = {
  id: 'why-own-cat-point2',
  type: 'text',
  data: 'Cats will keep your house and yard rodent-free',
}
const whyOwnList: UListData = [
  { ublock: whyOwnCat1 },
  { ublock: whyOwnCat2 },
  { ublock: { id: 'why-own-cat-point3', type: 'text', data: 'Cats are low-maintenance and independent' } },
  { ublock: { id: 'why-own-cat-point4', type: 'text', data: 'Cats are an eco-friendly pet choice' } },
  { ublock: { id: 'why-own-cat-point5', type: 'text', data: 'Cats can help reduce stress' } },
]
const whyOwnCatList: UBlock = { id: 'why-own-cat-list', type: 'bullet-list', data: whyOwnList }

const hypoallergenicCat: UBlock = { id: 'hypoallergenic-cat', type: 'text', data: 'Best hypoallergenic cat breeds' }
const hypoallergenicList: UListData = [
  { ublock: { id: 'hypoallergenic-cat1', type: 'text', data: 'Balinese' }, unmarked: true },
  { ublock: { id: 'hypoallergenic-cat2', type: 'text', data: 'Oriental Short Hair' }, unmarked: true },
  { ublock: { id: 'hypoallergenic-cat3', type: 'text', data: 'Devon Rex' }, unmarked: true },
  { ublock: { id: 'hypoallergenic-cat4', type: 'text', data: 'Sphynx' }, unmarked: true },
  { ublock: { id: 'hypoallergenic-cat5', type: 'text', data: 'Siberian' }, unmarked: true },
]
const hypoallergenicCatList: UBlock = { id: 'hypoallergenic-cat-list', type: 'bullet-list', data: hypoallergenicList }

const catsGridData: UGridData = [
  { ublocks: [bathYourCat, bathYourCatList, _es(), healthyCat, healthyCatList], width: '45%', id: 'c-g-1' },
  { ublocks: [whyOwnCat, whyOwnCatList, _es(), hypoallergenicCat, hypoallergenicCatList], width: '55%', id: 'c-g-2' },
]
export const _catsGrid: UBlock = { id: 'cats-grid', type: 'grid', data: catsGridData }

const catP1: UPageBlockData = { name: 'How to grow a kitten', color: '#0066FF', id: 'grow-kitten' }
const catP2: UPageBlockData = { name: 'Cats vs Dogs', color: '#0066FF', id: 'cats-vs-dogs' }
const catP3: UPageBlockData = { name: 'Research papers about evolution of pets', color: '#0066FF', id: 'pets-research' }
const catP4: UPageBlockData = { name: 'How pets changed humanity', color: '#0066FF', id: 'how-pets-changed-humanity' }
const catsLinksGridData: UGridData = [
  {
    ublocks: [
      { id: 'grow-kitten', type: 'page', data: catP1 },
      { id: 'cats-vs-dogs', type: 'page', data: catP2 },
    ],
    width: '50%',
    id: 'c-l-g-1',
  },
  {
    ublocks: [
      { id: 'pets-research', type: 'page', data: catP3 },
      { id: 'how-pets-changed-humanity', type: 'page', data: catP4 },
    ],
    width: '50%',
    id: 'c-l-g-2',
  },
]
export const _catsLinksGrid: UBlock = { id: 'cats-links-grid', type: 'grid', data: catsLinksGridData }

const listsInColumns: UGridData = [
  { ublocks: [bathYourCat, bathListStep1, bathListStep2], width: '50%', id: 'g-1' },
  { ublocks: [whyOwnCat, whyOwnCat1, whyOwnCat2], width: '50%', id: 'g-2' },
]

export const _catListsColumns: UBlock = { id: 'cat-lists-columns', type: 'grid', data: listsInColumns }
