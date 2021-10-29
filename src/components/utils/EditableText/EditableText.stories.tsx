import { useState } from 'react'
import { EditableText } from './EditableText'

function T() {
  const [data, setData] = useState('Some text')
  return <EditableText text={data} setText={setData} />
}

export const EditsText = T

export default {
  title: 'Utils/EditableText',
}
