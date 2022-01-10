import { useState } from 'react'
import { SetState, SetStr, State, str } from '../../../utils/types'
import { ucast } from '../../../utils/utils'
import { useC, useReactiveObject } from '../../utils/hooks/hooks'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { AddedBlocks } from '../types'

export function useNestedUBlockData<T>(
  dataAsStr: str,
  setDataAsStr: SetStr,
  default_: T,
): [T, SetState<T>, State<AddedBlocks>] {
  const [data, setData_] = useReactiveObject(ucast(dataAsStr, default_))

  const [newData, setNewData] = useState('')
  useUpdateEffect(() => {
    setDataAsStr(newData)
  }, [newData])

  const setData = useC((f: ((old: T) => T) | T) => {
    setData_((old) => {
      const newData = typeof f === 'function' ? (f as (old: T) => T)(old) : f
      setNewData(JSON.stringify(newData))
      return newData
    })
  })

  const addedBlocksS = useState<AddedBlocks>([])

  return [data, setData, addedBlocksS]
}
