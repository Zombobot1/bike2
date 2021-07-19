import { TableData } from './useTable'
import { UTable } from './UTable'

function Template({ data }: { data?: TableData }) {
  return <UTable data={data} />
}

const data1 = [
  [
    'Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 ',
    'Псина 1',
  ],
  ['Dogmeat 2', 'Псина 2'],
]

export const CanEdit = () => <Template data={data1} />
export const CanExtend = () => <Template />
