import { ReactNode } from 'react'
import { Fetch } from './Fetch'
import { useData } from '../../../fb/useData'
import { Button } from '@mui/material'

function Fail_() {
  const [data] = useData('_t', '2')
  return <p>{data?.d}</p>
}
let i = 0
function Success_() {
  const [data, setData] = useData('_t', '1')
  return <Button onClick={() => setData({ d: data.d + i++ })}>{data?.d}</Button>
}

function InstantNewData_() {
  const [data, set] = useData('_t', '3', { d: 'instant data' })
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

function FailOnMountAttempt() {
  // useSuspense_('1', () => Promise.reject(new Error('Error'))) // it works here but it does not work in more complex cases
  return <p>You won't see this</p>
}

function FailWrapper() {
  return (
    <Fetch>
      <FailOnMountAttempt />
    </Fetch>
  )
}

export const Fail = () => <T component={<Fail_ />} />
export const Success = () => <T component={<Success_ />} />
export const InstantNewData = () => <T component={<InstantNewData_ />} />
export const FailOnMount = FailWrapper

export default {
  title: 'Utils/Fetch',
}
