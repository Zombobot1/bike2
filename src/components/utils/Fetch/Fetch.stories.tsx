// import { useQuery } from 'react-query'
// import { axi } from '../../api/axi'
// import { FetchData } from './FetchedData'
// import { _DTO, _FAIL, _SLOW_LOAD } from '../../api/fapi'
// import { ReactNode } from 'react'

import { doc } from 'firebase/firestore'
import { ReactNode } from 'react'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import { str } from '../../../utils/types'
import { Fetch } from './Fetch'

function useDoc<T>(collection: str, id: str): T {
  const firestore = useFirestore()
  const ref = doc(firestore, collection, id)

  const { data } = useFirestoreDocData(ref)
  if (Object.keys(data).length === 1) throw new Error('Document not found') // how to check doc existence?

  return data as T
}

type DTO = { d: str }

function Fail_() {
  const data = useDoc<DTO>('_t', '2')
  return <p>{data?.d}</p>
}

function Success_() {
  const data = useDoc<DTO>('_t', '1')
  return <p>{data?.d}</p>
}

type T = { component: ReactNode }

function T({ component }: T) {
  return <Fetch>{component}</Fetch>
}

export const Fail = () => <T component={<Fail_ />} />
export const Success = () => <T component={<Success_ />} />

export default {
  title: 'Utils/Fetch',
  component: Fetch,
}
