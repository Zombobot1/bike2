import { mount } from '@cypress/react'
import { Box, hexToRgb } from '@mui/material'
import { Provider } from 'jotai'
import _ from 'lodash'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { OuterShell } from '../components/application/Shell'
import { COLORS } from '../components/application/theming/theme'
import { UTextGreen } from '../components/editing/UText/UTextOptions/UTextOptions'
import { FetchingState } from '../components/utils/Fetch/FetchingState/FetchingState'
import { isCypress } from '../components/utils/hooks/isCypress'
import { _fs } from '../content/fs'
import { FSProvider, setFSD } from '../fb/fs'
import { Fn, num, str } from './types'

export type CYChain = Cypress.Chainable<JQuery<HTMLElement>>

// sometimes it is not possible to assign data-* attribute (e.g. Checkbox)
export const got = (selector: str, eq = 0): CYChain => {
  const r = cy.get(`[data-cy="${selector}"]`)
  if (eq === -1) return r.last()
  return r.eq(eq)
}
export const utext = () => got('utext')

function _type(textOrCY: str, textOrEQ?: str | num, text?: str) {
  if (textOrEQ === undefined) cy.focused().type(textOrCY)
  else if (textOrEQ && !text) got(textOrCY).type(textOrEQ as str)
  else got(textOrCY, textOrEQ as num).type(text as str)
}

// type('t') type('utext', 't') type('utext', 1, 't') - basic calls
// type(['t'], ['t']) type(['t'], ['utext', 1, 't']) - advanced calls
type TypeArgs = Array<str | num>
type TypeFn = (
  textOrCYorArr: str | TypeArgs, // 1st arg determines basic or advanced call
  textOrEQ?: str | num | TypeArgs,
  text?: str | TypeArgs,
  ...rest: TypeArgs[]
) => { click: (cy: str | TypeArgs, eq?: num | TypeArgs, ...rest: TypeArgs[]) => { type: TypeFn }; blur: Fn }
export const type: TypeFn = (textOrCYorArr, textOrEQ, text, ...rest) => {
  if (_.isString(textOrCYorArr)) _type(textOrCYorArr as str, textOrEQ as str | num, text as str)
  else {
    const args: TypeArgs[] = [textOrCYorArr, textOrEQ as TypeArgs, text as TypeArgs, ...rest].filter(Boolean)
    // type(['t'], ['utext', 1, 't'])
    // eslint-disable-next-line @typescript-eslint/ban-types
    args.forEach((a) => (_type as Function)(...a))
  }

  return { click, blur }
}

export const blur = () => cy.focused().blur()

const _click = (cy: str, eq = 0): { type: TypeFn } => {
  if (cy.endsWith('-h')) got(cy, eq).realHover().realClick()
  else cy.endsWith('tick') ? tick(cy, eq) : got(cy, eq).click()
  return { type }
}

// to unify actions click can call tick
// click('btn')
// click(['b1'], ['b2', 1])
export const click = (cy: str | TypeArgs, eq?: num | TypeArgs, ...rest: TypeArgs[]): { type: TypeFn } => {
  if (!Array.isArray(cy)) _click(cy as str, eq as num)
  else {
    const args: TypeArgs[] = [cy, eq as TypeArgs, ...rest]
    // eslint-disable-next-line @typescript-eslint/ban-types
    args.filter(Boolean).forEach((a) => (_click as Function)(...a))
  }
  return { type }
}

export const tick = (cy: str, eq = 0): { type: TypeFn } => {
  got(cy, eq).click({ force: true }) // MUI sets opacity to 0
  return { type }
}

const _saw = (text: str, strict = false) =>
  text.endsWith('-cy') ? got(text.slice(0, -3)).should('be.visible') : cy.contains(strict ? RegExp(`^${text}$`) : text) // RegExp(`^${text}$`) doesn't detect text correctly

type Color = 'c' | 'bg' | undefined
type Colored = Array<str | (() => CYChain) | Color>
function sawColored([el, color, type = 'c']: Colored) {
  const element = (_.isString(el) ? () => cy.contains(el as str) : el) as () => CYChain
  if (color === 'disabled') disabled(element())
  else {
    if (type === 'c') element().should('have.css', 'color', hexToRgb(color as str))
    else element().should('have.css', 'background-color', hexToRgb(color as str))
  }
}

// saw('t')
// saw('t-cy') - checks by cy (DO NOT ADD "-cy" TO ELEMENTS)
// saw('t', 't')
// saw('t', ['t', 'red'])
// saw([el, 'red'])
export const saw = (...args: Array<str | Colored>) =>
  args.forEach((a) => {
    if (Array.isArray(a)) a[1] === 'strict' ? _saw(a[0] as str, true) : sawColored(a)
    else _saw(a)
  })
export const lost = (text: str) => cy.contains(text).should('not.exist')
export const doNotFret = () => cy.on('uncaught:exception', () => false)

export const show = (Component: React.FC, pd = '') => {
  isCypress.isCypress = true
  setFSD(_fs)

  mount(
    <OuterShell>
      <ErrorBoundary fallbackRender={({ error }) => <FetchingState error={error} />}>
        {/* Without provider atoms don't clean up */}
        <Provider>
          <FSProvider>
            <Box sx={{ paddingLeft: pd || 0 }}>
              <Component />
            </Box>
          </FSProvider>
        </Provider>
      </ErrorBoundary>
    </OuterShell>,
  )
}
function cssPlaceholder($els: JQuery<HTMLElement>) {
  return $els[0].ownerDocument.defaultView?.getComputedStyle($els[0], 'before').getPropertyValue('content')
}

export function expectCSSPlaceholder(target: str) {
  return ($els: JQuery<HTMLElement>) => expect(cssPlaceholder($els)).to.eq(target)
}

export const disabled = (e: CYChain) => e.should('have.attr', 'disabled')

export const _red = COLORS.error
export const _green = COLORS.success
export const _greenUText = UTextGreen
export const _disabled = 'disabled'
