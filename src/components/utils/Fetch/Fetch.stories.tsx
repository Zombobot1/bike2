import { ReactNode } from 'react'
import { Fetch } from './Fetch'
import { useData } from '../../../fb/useData'
import { Button } from '@mui/material'
import { uuid } from '../../../utils/wrappers/uuid'
import { str } from '../../../utils/types'
import { useSuspense_ } from '../hooks/useSuspense_'

// doc       | initial   | createIfNotExists | avoidCreation
// exists    | provided  | false (default)   | false (default) | => returns initial data and then doc
// exists    | undefined | false (default)   | false (default) | => returns doc (suspense)
// undefined | undefined | false (default)   | false (default) | => throws error

// undefined | provided  | false (default)   | false (default) | => creates doc and returns it
// undefined | provided  | false (default)   | true            | => returns initial data
// undefined | provided  | true              | false (default) | => returns initial data if doc doesn't exist, then creates doc, then returns doc
// undefined | provided  | true              | true            | => throws error

function Fail404_() {
  const [data] = useData('_t', '2')
  return <p>{data?.d}</p>
}
function FailCollidingFlags_() {
  const [data] = useData('_t', '2', { d: 't' }, { createIfNotExist: true, avoidCreation: true })
  return <p>{data?.d}</p>
}
let i = 0
function ExistingData_() {
  const [data, setData] = useData('_t', '1')
  return <Button onClick={() => setData({ d: data.d + i++ })}>{data?.d}</Button>
}

//if doc exists and initial data provided it returns initial data then doc
function InstantInitialThenExistingData_() {
  const [data, set] = useData('_t', '1', { d: 'instant data' })
  console.info(data.d)
  return (
    <Button onClick={() => set({ d: 'updated data' })} variant="outlined">
      Click to change: {data?.d}
    </Button>
  )
}

// if doc doesn't exist and initial data provided, doc will be created from initial data and initial data will be returned
function InstantInitialDataThenDoc_({ id }: { id: str }) {
  const [data, set] = useData('_t', id, { d: 'instant data' })
  return (
    <Button onClick={() => set({ d: 'updated data' })} variant="outlined">
      Click to change: {data?.d}
    </Button>
  )
}

// if doc doesn't exist and initial data provided + avoidCreation, initial data will be returned
function InstantInitialData_({ id }: { id: str }) {
  const [data, set] = useData('_t', id, { d: 'instant data' }, { avoidCreation: true })
  return (
    <Button onClick={() => set({ d: 'updated data' })} variant="outlined">
      Click to change: {data?.d}
    </Button>
  )
}

// if doc doesn't exist and initial data provided + createIfNotExists, doc will be created first, then returned
function DocCreatedFirst_({ id }: { id: str }) {
  const [data, set] = useData('_t', id, { d: 'test' }, { createIfNotExist: true })
  return (
    <Button onClick={() => set({ d: 'updated data' })} variant="outlined">
      Click to change: {data?.d}
    </Button>
  )
}

function FailOnMountAttempt() {
  useSuspense_('1', () => Promise.reject(new Error('Error'))) // it works here, but it does not work in more complex cases
  return <p>You won't see this</p>
}

//if fail happens before loading
function FailWrapper() {
  return (
    <Fetch>
      <FailOnMountAttempt />
    </Fetch>
  )
}

type T = { component: ReactNode }

function T({ component }: T) {
  return <Fetch>{component}</Fetch>
}

export const Fail404 = () => <T component={<Fail404_ />} />
export const FailCollidingFlags = () => <T component={<FailCollidingFlags_ />} />
export const ExistingData = () => <T component={<ExistingData_ />} />
export const InstantInitialDataThenDoc = () => <T component={<InstantInitialDataThenDoc_ id={uuid()} />} />
export const InstantInitialData = () => <T component={<InstantInitialData_ id={uuid()} />} />
export const InstantInitialThenExistingData = () => <T component={<InstantInitialThenExistingData_ />} />
export const DocCreatedFirst = () => <T component={<DocCreatedFirst_ id={uuid()} />} />
export const FailOnMount = FailWrapper

export default {
  title: 'Utils/Fetch',
}
