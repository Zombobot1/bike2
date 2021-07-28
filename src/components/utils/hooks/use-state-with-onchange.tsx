import { useState } from 'react'
import { StrState } from '../../../utils/types'

export const useSateWithOnChange = (onChange: (current: string, prev: string) => void): StrState => {
  const [value, setValue] = useState('')
  const [prev, setPrev] = useState('')
  if (value !== prev) {
    onChange(value, prev)
    setPrev(value)
  }
  return [value, setValue]
}
