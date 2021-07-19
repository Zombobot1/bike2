import { useQuery } from 'react-query'
import { axi } from '../../api/axi'
import { FetchData } from './fetched-data'
import { _DTO, _FAIL, _SLOW_LOAD } from '../../api/fake-api'
import { ReactNode } from 'react'

type DTO = { data: string }

const useDTO = (endpoint = _DTO) =>
  useQuery<DTO, Error, DTO>([endpoint], () => axi.get(endpoint).then((res) => res.data), {
    refetchOnWindowFocus: false,
    cacheTime: 1, // https://github.com/tannerlinsley/react-query/issues/2367
  })

function Fail_() {
  const { data } = useDTO(_FAIL)
  return <p>{data?.data}</p>
}

function Slow_() {
  const { data } = useDTO(_SLOW_LOAD)
  return <p>{data?.data}</p>
}

function Success_() {
  const { data } = useDTO()
  return <p>{data?.data}</p>
}

type Template = { component: ReactNode }

function Template({ component }: Template) {
  return <FetchData>{component}</FetchData>
}

export const Fail = () => <Template component={<Fail_ />} />
export const SlowLoading = () => <Template component={<Slow_ />} />
export const Success = () => <Template component={<Success_ />} />
