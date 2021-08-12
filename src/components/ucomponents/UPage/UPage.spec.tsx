import { mount } from '@cypress/react'
import { FAPI } from '../../../api/fapi'
import * as UPageS from './UPage.stories'
import { uuid, uuidS } from '../../../utils/uuid'

const utext = 'pre[class*="ContentEditable"]'

describe('UPage', () => {
  it('Factory preserves focus when adding empty blocks | create ublock api', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('POST', FAPI.UBLOCKS, (r) => r.reply({ i: '' })).as('post')
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')
    cy.stub(uuid, 'v4').callsFake(uuidS())

    mount(<UPageS.CreatesBlocks />)

    cy.get(utext).type('{enter}')

    cy.get(utext).last().should('have.focus')

    cy.wait('@post')
    cy.get('@post').its('request.body._id').should('eq', '0')

    cy.wait('@patch')
    cy.get('@patch').its('request.body.data').should('eq', '["0"]')
  })

  it('Factory loses focus when adding not empty blocks | post ublock api | block adds new block', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('POST', FAPI.UBLOCKS, (r) => r.reply({ i: '' })).as('post')
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')
    cy.stub(uuid, 'v4').callsFake(uuidS())

    mount(<UPageS.CreatesBlocks />)

    cy.get(utext).type('/')

    cy.get(utext).first().should('have.focus').contains('/')

    cy.wait('@post').its('request.body.data').should('eq', '/')

    cy.get(utext).first().type('{enter}')
    cy.get(utext).eq(1).should('have.focus')
  })

  it('Factory loses focus on backspace | focus moves on block deletion | delete api', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url))).as('get')
    cy.intercept('DELETE', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('delete')
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')
    cy.stub(uuid, 'v4').callsFake(uuidS())

    mount(<UPageS.DeletesBlocks />)
    cy.contains('d')

    cy.get(utext).eq(2).type('{Backspace}')

    cy.get(utext).eq(1).should('have.focus').type('{Backspace}{Backspace}')
    cy.get(utext).first().should('have.focus')

    cy.wait('@delete').its('request.url').should('contain', 'data2')
    cy.wait('@patch').its('request.body.data').should('eq', '["data4"]')
  })

  it('Factory loses focus on adding not empty block and block is pushed back', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url))).as('get')
    cy.intercept('POST', FAPI.UBLOCK, (r) => r.reply({ i: '' }))
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')
    cy.stub(uuid, 'v4').callsFake(uuidS())

    mount(<UPageS.DeletesBlocks />)
    cy.contains('d')

    cy.get(utext).eq(2).type('/')

    cy.get(utext).eq(2).should('have.focus').contains('/')
  })
})
