import { useState } from 'react'
import { useMount } from '../hooks/hooks'
import { EditableText } from './EditableText'

function T() {
  const [data, setData] = useState('Some text')
  return <EditableText text={data} setText={setData} />
}

function T2() {
  const [data, setData] = useState('Some text')
  const [f, sf] = useState(0)
  useMount(() => sf(1))
  return <EditableText text={data} setText={setData} focus={f} />
}

export const EditsText = T
export const FocusesText = T2

export default {
  title: 'Utils/EditableText',
}
