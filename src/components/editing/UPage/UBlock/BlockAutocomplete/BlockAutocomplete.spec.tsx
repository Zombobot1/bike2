import * as BlockAutocomplete from './BlockAutocomplete.stories'
import { got, saw, type, show, click, lost } from '../../../../../utils/testUtils'
import { num } from '../../../../../utils/types'

const utext = (n?: num) => got('utext', n)

describe('BlockAutocomplete', () => {
  it('opens | saves focus on exit | filters suggestions and creates new block', () => {
    show(BlockAutocomplete.AutocompleteCompletes)
    utext().type('{leftarrow}/')
    saw('block-autocomplete-cy')

    type(['{esc}'], ['/'])
    saw('block-autocomplete-cy')
    saw('//')

    type(['li{downarrow}{downarrow}{enter}'])
    saw('1.')
  })

  it('turns block if it is empty', () => {
    show(BlockAutocomplete.AutocompleteCompletes)
    utext(1).type('/')
    click('heading-1')
    utext(3).should('not.exist')
    cy.get('h2').should('exist')
  })

  it('creates inline tex', () => {
    show(BlockAutocomplete.AutocompleteCompletes)
    utext().type('{leftarrow}/')
    type(['eq{downarrow}{downarrow}{enter}'], ['+{enter}'])
    saw('+')
    lost('cat')
  })

  it('turns block and preserves data', () => {
    show(BlockAutocomplete.AutocompleteCompletes, '2rem')
    got('block-menu-h').click({ force: true }) // realClick produces anomalies
    got('turn-into').trigger('mouseenter')
    got('heading-1').click()
    saw('cat')
    cy.get('h2').should('exist')
  })
})
