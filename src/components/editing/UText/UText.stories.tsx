import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { UBlock } from '../UBlock/UBlock'

function T(props: UBlock) {
  const [f, sf] = useState(props.focus)

  return (
    <Box sx={{ width: 500 }}>
      <Button onClick={() => sf((f) => ({ ...f, type: f?.type === 'end' ? 'start' : 'end' }))}>Focus</Button>
      <UBlock {...props} focus={f} />
    </Box>
  )
}

const data1: UBlock = {
  id: 'f-full',
  focus: { type: 'start', xOffset: 20 },
}

const readonly: UBlock = {
  ...data1,
  readonly: true,
}

const data2: UBlock = {
  id: 'newEmptyText',
  initialData: { data: '', type: 'text' },
}

const data3: UBlock = {
  id: 'newEmptyHeader',
  initialData: { data: '', type: 'heading-1' },
}

const empty: UBlock = {
  id: 'emptyString',
}

const bold: UBlock = {
  id: 'bold',
  initialData: { data: 'bold', type: 'text' },
}

const link: UBlock = {
  id: 'link',
  initialData: { data: 'Link and <a href="a">old ref</a> and text', type: 'text' },
}

const _link = '<a href="https://www.google.com/" target="_blank">link</a>'
const _eq = '<code data-id="1" contenteditable="false">E^2 = \\frac{1}{2}</code>'
const _eq2 = '<code data-id="2" contenteditable="false">E^3 = \\frac{3}{2}</code>'
const _text = 'Example: ' + _eq + ' <b>bold</b> <mark>code</mark> ' + _link
const coloredText = `<em class="red">Red</em> <em class="green">Green</em> <em class="blue">Blue</em> <em class="purple">Purple</em> <em class="pink">Pink</em>`
const backText = `<em class="red-b">Red</em> <em class="green-b">Green</em> <em class="blue-b">Blue</em> <em class="purple-b">Purple</em> <em class="pink-b">Pink</em>`

const transformedText: UBlock = {
  id: 'transformedText',
  initialData: { data: _text + '\n\n' + coloredText + ' ' + backText, type: 'text' },
}

const tex: UBlock = {
  id: 'tex',
  initialData: { data: _eq, type: 'text' },
}

const twoTex: UBlock = {
  id: 'twoTex',
  initialData: { data: `${'nice '.repeat(10)} ${_eq} small ${_eq2} cat`, type: 'text' },
}

export const Empty = () => <T {...empty} />
export const SetsFocus = () => <T {...data1} />
export const ReadOnlyText = () => <T {...readonly} />
export const TransformedText = () => <T {...transformedText} />
export const ChangesComponents = () => <T {...empty} />
export const DisplaysPlaceholderWhenFocused = () => <T {...data2} />
export const DisplaysPlaceholderWhenUnfocused = () => <T {...data3} />

export const BoldText = () => <T {...bold} />
export const TextWithLink = () => <T {...link} />
export const Tex = () => <T {...tex} />
export const TwoTex = () => <T {...twoTex} />

export default {
  title: 'Editing/UText',
}
