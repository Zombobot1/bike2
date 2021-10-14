import { show, expectCSSPlaceholder, utext } from '../../../utils/testUtils'
import * as UText from './UText.stories'

describe('Editable text', () => {
  it('Displays placeholders | Changes component', () => {
    show(UText.ChangesComponents)

    utext().then(expectCSSPlaceholder('none'))
    utext().focus()
    utext().then(expectCSSPlaceholder('"Type \'/\' for commands"'))

    utext().type('/heading1 ')
    utext().then(expectCSSPlaceholder('"Heading 1"'))
  })

  it('Makes text bold', () => {
    show(UText.TransformedText)
    utext().type('{selectall}{ctrl+b}')
    cy.get('b').contains('bold')
  })

  it('Is disabled when is readonly', () => {
    show(UText.ReadOnlyText)
    utext().should('have.attr', 'disabled')
  })
})
