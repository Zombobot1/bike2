import * as React from 'react'
import { mount } from '@cypress/react'
import { UTextS } from './EditableText.stories'
import { FAPI } from '../../../api/fake-api'

const content = ($els: JQuery<HTMLElement>) =>
  $els[0].ownerDocument.defaultView?.getComputedStyle($els[0], 'before').getPropertyValue('content')

const text = 'div[class*="EditableText"]'
const heading1 = 'h2[class*="EditableText"]'

describe('Editable text', () => {
  it('Gets data from server, edits it, sends it back', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getStrBlock(r.url))).as('mount')
    cy.intercept('PUT', FAPI.UBLOCK, FAPI.putStrBlock()).as('put')

    mount(<UTextS.EditsText />)
    cy.wait('@mount')

    cy.get(text).type(' 1').blur()

    cy.wait('@put')
    cy.get('@put').its('request.body.data').should('eq', 'initial data 1')
  })

  it('Becomes readonly', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getStrBlock(r.url))).as('mount')

    mount(<UTextS.ReadOnlyText />)

    cy.get(text).should('have.attr', 'disabled')
    cy.get(text).should('have.attr', 'contenteditable', 'false')
  })

  it('Creates itself if id is empty, shows placeholders, changes component', () => {
    cy.intercept('POST', FAPI.UBLOCKS, (r) => r.reply(FAPI.postStrBlock())).as('mount')
    cy.intercept('PUT', FAPI.UBLOCK, FAPI.putStrBlock()).as('put')

    mount(<UTextS.ChangesComponents />)
    cy.wait('@mount')

    cy.get(text).then(($els) => expect(content($els)).to.eq('none'))
    cy.get(text).focus()
    cy.get(text).then(($els) => expect(content($els)).to.contain('"Type'))

    cy.get(text).type('/heading1 ')
    cy.get(heading1).then(($els) => expect(content($els)).to.eq('"Heading 1"'))

    cy.wait('@put')
    cy.get('@put').its('request.body.type').should('eq', 'HEADING1')
  })
})
