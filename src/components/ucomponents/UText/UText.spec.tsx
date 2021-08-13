import { FAPI } from '../../../api/fapi'
import { story } from '../../../utils/testUtils'
import * as UTextS from './UText.stories'

const utext = 'pre[class*="ContentEditable"]'
const heading1 = 'h2[class*="ContentEditable"]'

const content = ($els: JQuery<HTMLElement>) =>
  $els[0].ownerDocument.defaultView?.getComputedStyle($els[0], 'before').getPropertyValue('content')

describe('Editable text', () => {
  it('Gets data from server, edits it, sends it back', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')

    story(UTextS.EditsText)
    cy.contains('initial data')

    cy.get(utext).type(' 1').blur()
    cy.wait('@patch').its('request.body.data').should('eq', 'initial data 1')
  })

  it('Displays placeholders | Changes component', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    cy.intercept('PATCH', FAPI.UBLOCK, (r) => r.reply({ i: '' })).as('patch')

    story(UTextS.ChangesComponents)

    cy.get(utext).then(($els) => expect(content($els)).to.eq('none'))
    cy.get(utext).focus()
    cy.get(utext).then(($els) => expect(content($els)).to.contain('"Type'))

    cy.get(utext).type('/heading1 ')
    cy.get(heading1).then(($els) => expect(content($els)).to.eq('"Heading 1"'))

    cy.wait('@patch').its('request.body.type').should('eq', 'HEADING1')
  })

  it('Is disabled when is readonly', () => {
    cy.intercept('GET', FAPI.UBLOCK, (r) => r.reply(FAPI.getUBlock(r.url)))
    story(UTextS.ReadOnlyText)
    cy.get(utext).should('have.attr', 'disabled')
  })
})
