import { Box } from '@mui/material'
import { UText } from './UText'
import { _mockUTextP } from './types'
import { UBlock, UBlockType } from '../UPage/ublockTypes'
import { useState } from 'react'
import { bool } from '../../../utils/types'
import { UPageFocus } from '../types'
import { uuid } from '../../../utils/wrappers/uuid'

type Te = UBlock & { readonly?: bool }
const t = (data = '', type: UBlockType = 'text', readonly = false): Te => ({ id: uuid(), data, type, readonly })

function Te(ps: Te) {
  const focusS = useState<UPageFocus | undefined>(undefined)
  const [t, st] = useState(ps.type)
  return (
    <Box sx={{ width: 500 }}>
      <UText
        {..._mockUTextP}
        type={t}
        setType={(_, t) => st(t)}
        data={ps.data}
        focusS={focusS}
        readonly={ps.readonly}
      />
    </Box>
  )
}

const _link = '<a href="https://www.google.com/" target="_blank">link</a>'
const _eq = '<code data-id="1" contenteditable="false">E^2 = \\frac{1}{2}</code>'
const _eq2 = '<code data-id="2" contenteditable="false">E^3 = \\frac{3}{2}</code>'
const _text = 'Example: ' + _eq + ' <b>bold</b> <mark>code</mark> ' + _link
const coloredText = `<em class="red">Red</em> <em class="green">Green</em> <em class="blue">Blue</em> <em class="purple">Purple</em> <em class="pink">Pink</em>`
const backText = `<em class="red-b">Red</em> <em class="green-b">Green</em> <em class="blue-b">Blue</em> <em class="purple-b">Purple</em> <em class="pink-b">Pink</em>`
const twoTex = `${'nice '.repeat(10)} ${_eq} small cute ${_eq2} cat`

export const Empty = () => <Te {...t()} />
export const ReadOnlyText = () => <Te {...t('Some data', 'text', true)} />
export const TransformedText = () => <Te {...t(_text + '\n\n' + coloredText + ' ' + backText)} />
export const ChangesComponents = () => <Te {...t()} />
export const DisplaysPlaceholderWhenFocused = () => <Te {...t()} />
export const DisplaysPlaceholderWhenUnfocused = () => <Te {...t('', 'heading-1')} />

export const BoldText = () => <Te {...t('bold')} />
export const TextWithLink = () => <Te {...t('Link and <a href="a">old ref</a> and text')} />
export const Tex = () => <Te {...t(_eq)} />
export const TwoTex = () => <Te {...t(twoTex)} />

export default {
  title: 'Editing core/UText',
}
