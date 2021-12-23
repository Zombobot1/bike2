import { show, expectCSSPlaceholder, utext, type, saw, got, lost, click, _greenUText } from '../../../utils/testUtils'
import { safe } from '../../../utils/utils'
import { select, setCursor } from '../../utils/Selection/selection'
import * as UText from './UText.stories'

describe('UText', () => {
  it('Displays placeholders | Changes component', () => {
    show(UText.ChangesComponents)

    utext().then(expectCSSPlaceholder('none'))
    utext().focus()
    utext().then(expectCSSPlaceholder('"Type \'/\' for commands"'))

    utext().type('{ctrl+shift+1}')
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

    cy.get('strong').contains('Link')

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

  it('after tex editing focus moves behind it | edits tex', () => {
    show(UText.TransformedText)
    cy.get(`[data-id="1"]`).realClick()
    type([' + b{enter}'], ['!'])
    saw('!bold')

    cy.get(`[data-id="1"]`).realClick()
    saw('{2} + b')
  })

  it('Inserts tex in empty block', () => {
    show(UText.Empty)
    utext().focus()
    type(['{ctrl+shift+E}'], ['w{enter}'])
    saw('w')
  })

  it('Inserts tex in text', () => {
    show(UText.BoldText)
    cy.then(() => select(document.getElementsByTagName('pre')[0], 1, 3))
    utext().focus()
    type(['{ctrl+shift+E}'], ['+{esc}'])
    saw('ol+', 'b', 'd')
  })

  it('shows options and modifies text', () => {
    show(UText.BoldText)
    type('utext', '{selectall}')
    click(['colors'], ['green'])
    saw(['bold', _greenUText])
  })

  it('shows tex placeholder | inserts tex after tex in the end', () => {
    show(UText.Tex)
    cy.then(() => setCursor(document.getElementsByTagName('pre')[0], 0, 'backward'))
    utext().focus()
    type('{ctrl+shift+E}')
    saw('write TeX')

    type(['{esc}'])
    lost('write TeX')

    type(['{ctrl+shift+E}'], ['+{esc}'])
    saw('+')
  })

  it('shows tex editor with correct offset | returns cursor after 2nd tex in block', () => {
    show(UText.TwoTex)
    cy.get(`[data-id="2"]`).realClick()

    got('tex-box')
      .should('have.css', 'top')
      .then((height) => +String(height).replace('px', ''))
      .should('be.closeTo', 88, 10)

    got('tex-box')
      .should('have.css', 'left')
      .then((height) => +String(height).replace('px', ''))
      .should('be.closeTo', 43, 2)
    type(['{esc}'], ['!'])

    saw('!cat')
  })

  // it('unwraps tag partially <b>bold</b> -> <b>bo</b>o<b>ld</b> (check that attributes are preserved', () => {

  // })
})
