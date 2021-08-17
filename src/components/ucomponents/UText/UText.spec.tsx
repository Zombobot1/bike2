import { intercept, sent, show, expectCSSPlaceholder, utext } from '../../../utils/testUtils'
import * as UTextS from './UText.stories'

describe('Editable text', () => {
  beforeEach(intercept)
  it('Gets data from server, edits it, sends it back', () => {
    show(UTextS.EditsText)
    cy.contains('initial data')

    utext().type(' 1').blur()
    sent('@patchUBlock', 'initial data 1')
  })

  it('Displays placeholders | Changes component', () => {
    show(UTextS.ChangesComponents)

    utext().then(expectCSSPlaceholder('none'))
    utext().focus()
    utext().then(expectCSSPlaceholder('"Type \'/\' for commands"'))

    utext().type('/heading1 ')
    utext().then(expectCSSPlaceholder('"Heading 1"'))

    sent('@patchUBlock', 'HEADING1', 'type')
  })

  it('Is disabled when is readonly', () => {
    show(UTextS.ReadOnlyText)
    utext().should('have.attr', 'disabled')
  })
})
