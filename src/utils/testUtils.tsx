import { mount } from '@cypress/react'
import React from 'react'
import { OuterShell } from '../components/application/Shell'
import { str } from './types'
import { uuid, uuidS } from './uuid'

// sometimes it is not possible to assign data-* attribute (e.g. Checkbox)
export const got = (selector: str, type: 'CY' | 'AL' = 'CY') =>
  cy.get(`[${type === 'CY' ? 'data-cy' : 'aria-label'}="${selector}"]`)
export const utext = () => got('utext')

export const saw = (text: str) => cy.contains(text)

export const sent = (alias: str, target: unknown, field = 'data') =>
  cy.wait(alias).its(`request.body.${field}`).should('eq', target)

export const sentTo = (alias: str, target: str) => cy.wait(alias).its(`request.url`).should('contain', target)
export const doNotFret = () => cy.on('uncaught:exception', () => false)

export const fakedId = () => cy.stub(uuid, 'v4').callsFake(uuidS())

export const show = (Component: React.FC) =>
  mount(
    <OuterShell>
      <Component />
    </OuterShell>,
  )

/**
 * @deprecated Use bar() instead
 */
export function intercept() {}

function cssPlaceholder($els: JQuery<HTMLElement>) {
  return $els[0].ownerDocument.defaultView?.getComputedStyle($els[0], 'before').getPropertyValue('content')
}

export function expectCSSPlaceholder(target: str) {
  return ($els: JQuery<HTMLElement>) => expect(cssPlaceholder($els)).to.eq(target)
}
