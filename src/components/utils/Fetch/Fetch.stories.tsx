import { ReactNode } from 'react'
import { str } from '../../../utils/types'
import { Fetch } from './Fetch'
import { useData } from '../../../fb/useData'
import { Button } from '@mui/material'

type DTO = { d: str }

function Fail_() {
  const [data] = useData<DTO>('_t', '2')
  return <p>{data?.d}</p>
}

function Success_() {
  const [data] = useData<DTO>('_t', '1')
  return <p>{data?.d}</p>
}

function InstantNewData_() {
  const [data, set] = useData<DTO>('_t', '3', { d: 'instant data' })
  return (
    <Button onClick={() => set({ d: 'updated data' })} variant="outlined">
      Click to change: {data?.d}
    </Button>
  )
}

type T = { component: ReactNode }

function T({ component }: T) {
  return <Fetch>{component}</Fetch>
}

export const Fail = () => <T component={<Fail_ />} />
export const Success = () => <T component={<Success_ />} />
export const InstantNewData = () => <T component={<InstantNewData_ />} />

export default {
  title: 'Utils/Fetch',
}
