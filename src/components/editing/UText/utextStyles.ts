import { str } from '../../../utils/types'

export function getUTextStyles(minWidth: str) {
  return {
    h1: { fontSize: '1.75rem', paddingBottom: '1.5rem' },
    h2: { fontSize: '1.25rem', paddingBottom: '0.75rem', paddingTop: '0.75rem' },
    h3: { fontSize: '1rem', paddingBottom: '0.6875rem', paddingTop: '0.6875rem' },
    h4: { fontSize: '0.875rem', paddingBottom: '0.625rem', paddingTop: '0.625rem' },
    pre: { fontSize: '1rem', paddingBottom: '0.5rem', paddingTop: '0.5rem' },

    [minWidth]: {
      h1: { fontSize: '3.5rem', paddingBottom: '2rem' },
      h2: { fontSize: '2.5rem', paddingBottom: '1rem', paddingTop: '1rem' },
      h3: { fontSize: '2rem', paddingBottom: '0.875rem', paddingTop: '0.875rem' },
      h4: { fontSize: '1.75rem', paddingBottom: '0.75rem', paddingTop: '0.75rem' },
      pre: { fontSize: '1.5rem', paddingBottom: '0.5rem', paddingTop: '0.5rem' },
    },
  }
}

export const utextPaddings = new Map([
  ['heading-1', `${1 + 0.5}rem`],
  ['heading-2', `${0.875 + 0.2}rem`],
  ['heading-3', `0.75rem`],
  ['text', `0.5rem`],
])

// paddingBottom + constant to move up * constant for cypress
export const arrowNavigationSizeMultipliers = new Map([
  ['code', 3],
  ['h1', 2 * 1.1],
  ['h2', (1 + 0.2) * 1.3],
  ['h3', (0.875 + 0.2) * 1.3],
  ['h4', (0.75 + 0.2) * 1.3],
  ['pre', (0.5 + 0.15) * 1.3],
])
