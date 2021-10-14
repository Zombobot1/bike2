import { TableData } from './useTable'
import { UTable } from './UTable'
import { Typography, Stack } from '@mui/material'
function Template({ data, pasteData }: { data?: TableData; pasteData?: string }) {
  return (
    <Stack spacing={4}>
      <UTable data={data} />
      {pasteData && <Typography component="pre">Copy & Paste:{pasteData}</Typography>}
    </Stack>
  )
}

const data1 = [
  [
    'Dogmeat 4 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 Dogmeat 1 ',
    'Псина 1',
  ],
  ['Dogmeat 2', 'Псина 2'],
]

export const CanBeEdited = () => <Template data={data1} />
export const CanBeSelected = () => <Template data={data1} />
export const CanBeExtended = () => <Template />
export const ParsesPastedData = () => <Template pasteData={'\na - b\nc - d'} />
export const GoesToCardsGeneration = () => <Template />
