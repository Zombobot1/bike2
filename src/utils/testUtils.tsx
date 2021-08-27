import { mount } from '@cypress/react'
import React from 'react'
import { FAPI } from '../api/fapi'
import { OuterShell } from '../components/utils/Shell/Shell'
import { _seed } from '../_seeding'
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

export const fakedId = () => cy.stub(uuid, 'v4').callsFake(uuidS())

export const show = (Component: React.FC) =>
  mount(
    <OuterShell>
      <Component />
    </OuterShell>,
  )

export async function prepare() {
  console.time('preparing')
  await _seed()
  // await _signIn()
  console.timeEnd('preparing')
}

/**
 * @deprecated Use bar() instead
 */
export function intercept() {
  cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
  cy.intercept('POST', FAPI.UBLOCKS, (r) => r.reply({ i: '' })).as('postUBlock')
  cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patchUBlock')
  cy.intercept('DELETE', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('deleteUBlock')
}

function cssPlaceholder($els: JQuery<HTMLElement>) {
  return $els[0].ownerDocument.defaultView?.getComputedStyle($els[0], 'before').getPropertyValue('content')
}

export function expectCSSPlaceholder(target: str) {
  return ($els: JQuery<HTMLElement>) => expect(cssPlaceholder($els)).to.eq(target)
}
