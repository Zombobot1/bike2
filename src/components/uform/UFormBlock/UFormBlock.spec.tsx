import { FAPI } from '../../../api/fapi'
import { got, story } from '../../../utils/testUtils'
import { qS } from '../../ucomponents/stubs'
import * as UFormBlockS from './UFormBlock.stories'

describe('UFormBlock', () => {
  it('Edits input', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')

    story(UFormBlockS.InputEditing)

    got('question').type('question')
    got('correct answer').type('answer')
    got('explanation').type('explanation').blur()

    cy.wait('@patch')
      .wait('@patch')
      .wait('@patch')
      .its('request.body.data')
      .should('eq', qS(['answer'], 'explanation', [], 'question'))
  })

  it('Edits text area', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')

    story(UFormBlockS.TextAreaEditing)

    got('explanation').type('explanation').blur()

    cy.wait('@patch').its('request.body.data').should('eq', qS([], 'explanation', [], ''))
  })

  it('Edits radio | Change in option leads to change in answer', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')

    story(UFormBlockS.RadioEditing)
    cy.contains('Select correct answer')

    got('option').eq(1).type(' changed').blur() // anomaly: blur is necessary
    got('option tick', 'AL').eq(1).click({ force: true }) // MUI sets opacity to 0

    cy.contains('Select correct answer').should('not.exist')

    cy.wait('@patch')
      .wait('@patch')
      .its('request.body.data')
      .should('eq', qS(['Option 2 changed'], '', ['Option 1', 'Option 2 changed'], ''))

    got('option').eq(1).type(' !').blur()

    cy.wait('@patch')
      .its('request.body.data')
      .should('eq', qS(['Option 2 changed !'], '', ['Option 1', 'Option 2 changed !'], ''))
  })

  it('Creates | Deletes options', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')

    story(UFormBlockS.ChecksEditing)

    got('new option').type('O')

    cy.wait('@patch')
      .its('request.body.data')
      .should('eq', qS([], '', ['Option 1', 'Option 2', 'O'], ''))

    got('option').eq(2).type('{Backspace}{Backspace}')

    cy.wait('@patch')
      .its('request.body.data')
      .should('eq', qS([], '', ['Option 1', 'Option 2'], ''))
  })
})
