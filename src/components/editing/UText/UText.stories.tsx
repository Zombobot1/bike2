import { Box } from '@mui/material'
import { UBlock, mockUblock } from '../UBlock/UBlock'

function T(props: UBlock) {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const readonly: UBlock = {
  ...mockUblock,
  id: 'newEmptyText',
  initialData: { data: 'Some data', type: 'text' },
  readonly: true,
}

const data2: UBlock = {
  ...mockUblock,
  id: 'newEmptyText',
  initialData: { data: '', type: 'text' },
}

const data3: UBlock = {
  ...mockUblock,
  id: 'newEmptyHeader',
  initialData: { data: '', type: 'heading-1' },
}

const empty: UBlock = {
  ...mockUblock,
  id: 'emptyString',
}

const bold: UBlock = {
  ...mockUblock,
  id: 'bold',
  initialData: { data: 'bold', type: 'text' },
}

const link: UBlock = {
  ...mockUblock,
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
  ...mockUblock,
  id: 'transformedText',
  initialData: { data: _text + '\n\n' + coloredText + ' ' + backText, type: 'text' },
}

const tex: UBlock = { ...mockUblock, id: 'tex', initialData: { data: _eq, type: 'text' } }

const twoTex: UBlock = {
  ...mockUblock,
  id: 'twoTex',
  initialData: { data: `${'nice '.repeat(10)} ${_eq} small cute ${_eq2} cat`, type: 'text' },
}

export const Empty = () => <T {...empty} />
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
