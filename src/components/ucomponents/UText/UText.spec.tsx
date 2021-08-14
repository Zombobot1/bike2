import { got, intercept, sent, show } from '../../../utils/testUtils'
import * as UTextS from './UText.stories'

const utext = () => got('utext')

const content = ($els: JQuery<HTMLElement>) =>
  $els[0].ownerDocument.defaultView?.getComputedStyle($els[0], 'before').getPropertyValue('content')

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

    utext().then(($els) => expect(content($els)).to.eq('none'))
    utext().focus()
    utext().then(($els) => expect(content($els)).to.contain('"Type'))

    utext().type('/heading1 ')
    utext().then(($els) => expect(content($els)).to.eq('"Heading 1"'))

    sent('@patchUBlock', 'HEADING1', 'type')
  })

  it('Is disabled when is readonly', () => {
    show(UTextS.ReadOnlyText)
    utext().should('have.attr', 'disabled')
  })
})
