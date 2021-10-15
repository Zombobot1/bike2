import { show, expectCSSPlaceholder, utext, type, saw } from '../../../utils/testUtils'
import { safe } from '../../../utils/utils'
import { select } from '../../utils/Selection/selection'
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
    show(UText.BoldText)
    utext().type('{selectall}{ctrl+b}')
    cy.get('b').contains('bold')
  })

  it('creates link', () => {
    show(UText.TextWithLink)
    cy.then(() => select(safe(document.querySelector('pre')), 0, 4))
    utext().focus()

    type('{ctrl+k}')

    cy.get('span').contains('Link')

    type('a{enter}')
    type('!')

    saw('Link!')
  })

  it('removes link', () => {
    show(UText.TextWithLink)
    cy.then(() => select(safe(document.querySelector('pre')), 9, 9 + 7))
    utext().focus()

    type('{ctrl+k}')
    type('{esc}')
    type('!')

    cy.get('a').should('not.exist')
    saw('ref!')
  })

  it('Is disabled when is readonly', () => {
    show(UText.ReadOnlyText)
    utext().should('have.attr', 'disabled')
  })
})
