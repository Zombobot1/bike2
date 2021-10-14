import { mount } from '@cypress/react'
import { Provider } from 'jotai'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { OuterShell } from '../components/application/Shell'
import { FetchingState } from '../components/utils/Fetch/FetchingState/FetchingState'
import { useMount } from '../components/utils/hooks/hooks'
import { _fs } from '../content/fs'
import { FSProvider, useFS } from '../fb/fs'
import { num, str } from './types'
import { uuid, uuidS } from './uuid'

// sometimes it is not possible to assign data-* attribute (e.g. Checkbox)
export const got = (selector: str, type: 'CY' | 'AL' = 'CY') =>
  cy.get(`[${type === 'CY' ? 'data-cy' : 'aria-label'}="${selector}"]`)
export const utext = () => got('utext')

export const saw = (text: str) => cy.contains(text) // RegExp(`^${text}$`) doesn't detect text correctly
export const r = (key: str, n: num) => key.repeat(n)
export const type = (text: str, n = 1) => cy.focused().type(r(text, n))

export const doNotFret = () => cy.on('uncaught:exception', () => false)

export const fakedId = () => cy.stub(uuid, 'v4').callsFake(uuidS())

export const show = (Component: React.FC) =>
  mount(
    <OuterShell>
      <ErrorBoundary fallbackRender={({ error }) => <FetchingState message={error.message} />}>
        <FSProvider>
          <Component />
        </FSProvider>
      </ErrorBoundary>
    </OuterShell>,
  )

function cssPlaceholder($els: JQuery<HTMLElement>) {
  return $els[0].ownerDocument.defaultView?.getComputedStyle($els[0], 'before').getPropertyValue('content')
}

export function expectCSSPlaceholder(target: str) {
  return ($els: JQuery<HTMLElement>) => expect(cssPlaceholder($els)).to.eq(target)
}
