import { styled } from '@mui/material'
import ContentEditable from 'react-contenteditable'
import { str } from '../../../utils/types'

export function getUTextStyles(minWidth: str) {
  return {
    h1: { fontSize: '2rem', paddingBottom: '1.5rem' },
    h2: { fontSize: '1.75rem', paddingBottom: '0.75rem', paddingTop: '0.75rem' },
    h3: { fontSize: '1.5rem', paddingBottom: '0.625rem', paddingTop: '0.625rem' },
    h4: { fontSize: '1.25rem', paddingBottom: '0.5rem', paddingTop: '0.5rem' },
    pre: { fontSize: '1rem', paddingBottom: '0.25rem', paddingTop: '0.25rem' },

    [minWidth]: {
      h1: { fontSize: '3.5rem', paddingBottom: '2rem' },
      h2: { fontSize: '2.25rem', paddingBottom: '0.75rem', paddingTop: '0.75rem' },
      h3: { fontSize: '1.75rem', paddingBottom: '0.625rem', paddingTop: '0.625rem' },
      h4: { fontSize: '1.5rem', paddingBottom: '0.5rem', paddingTop: '0.5rem' },
      pre: { fontSize: '1.25rem', paddingBottom: '0.25rem', paddingTop: '0.25rem' },
    },
  }
}

export const Editable = styled(ContentEditable, { label: 'ContentEditable ' })(({ theme }) => ({
  width: '100%',
  margin: 0,

  outline: 'none',
  fontFamily: theme.typography.fontFamily,
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',
}))

export const utextPaddings = new Map([
  ['heading-1', `${0.75 + 0.5}rem`],
  ['heading-2', `${0.625 + 0.2}rem`],
  ['heading-3', `0.75rem`],
  ['text', `0.15rem`],
  ['list', `0.15rem`],
  ['numbered-list', `0.15rem`],
  ['bullet-list', `0.15rem`],
  ['toggle-list', `0.15rem`],
  ['exercise', `0.75rem`],
])

// paddingBottom + constant to move up * constant for cypress
export const arrowNavigationSizeMultipliers = new Map([
  ['code', 3],
  ['h1', 2 * 1.1],
  ['h2', (0.75 + 0.2) * 1.3],
  ['h3', (0.675 + 0.2) * 1.3],
  ['h4', (0.5 + 0.2) * 1.3],
  ['pre', (0.25 + 0.15) * 1.3],
])
