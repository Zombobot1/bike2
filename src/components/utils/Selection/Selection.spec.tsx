import { type, show, expectCSSPlaceholder, utext, saw, got } from '../../../utils/testUtils'
import { insertTag, removeTag, removeTagBefore, replaceTag } from './htmlAsStr'
import { selectionCoordinates } from './selection'
import * as Selection from './Selection.stories'

describe('Selection', () => {
  it('selects text range', () => {
    show(Selection.SelectsRange)
    cy.then(() => expect(window.getSelection()?.toString()).eq('alic and bol'))
  })

  it('sets cursor', () => {
    show(Selection.SetsCursor)
    type('{backspace}')
    saw('ialic')
  })

  it('sets cursor backwards', () => {
    show(Selection.SetsCursorFromEnd)
    type('{backspace}')
    saw('ialic')
  })

  it('sets cursor backwards with offset in characters', () => {
    show(Selection.SetsCursorFromEndWithCharactersOffset)
    type('{backspace}')
    saw('ialic')
  })

  it('wraps tag', () => {
    show(Selection.WrapsTag)
    cy.get('s').eq(0).contains('alic')
    cy.get('s').eq(1).contains(' and bol')
  })

  it('wraps several tags', () => {
    show(Selection.WrapsSeveralTags)
    cy.get('span').eq(0).contains('Example')
  })

  it('focuses empty block', () => {
    show(Selection.FocusEmpty)
    type('a')
    saw('a')
  })

  it('unwraps tag', () => {
    show(Selection.UnwrapsTag)
    cy.get('s').should('not.exist')
  })

  it('calculates offset', () => {
    show(Selection.CalculatesOffset)
    type('{backspace}')
    saw('ialic')
  })

  it('calculates selection position across 2 rows', () => {
    show(Selection.CalculatesSelectionPosition2Rows)
    got('rec').should('have.css', 'top', '69.2857px')
    got('rec').should('have.css', 'left', '38.6094px')
  })

  it('calculates selection position', () => {
    show(Selection.CalculatesSelectionPosition)
    got('rec').should('have.css', 'top', '42.2857px')
    got('rec').should('have.css', 'left', '135.133px')
  })

  it('inserts tag at start', () => {
    const actual = insertTag('Example: <b>bold</b>', 'b', '', 'Example')
    expect(actual).eql('<b>Example</b>: <b>bold</b>')
  })

  it('inserts tag', () => {
    const actual = insertTag('Example: <i><b>italic</b></i> and <b><u>bold<u/></b>', 's', 'Example: it', 'alic and bol')
    expect(actual).eql('Example: <i><b>it<s>alic</b></i> and <b><u>bol</s>d<u/></b>')
  })

  it('removes simple tag', () => {
    expect(removeTagBefore('<b>bold</b>', 'b', '', 'bold')).eql('bold')
    expect(removeTagBefore('-<b>bold</b>-', 'b', '-', 'bold')).eql('-bold-')
    expect(removeTagBefore('<a href="a">link</a>', 'a', '', 'link')).eql('link')
  })

  it('removes tag', () => {
    const actual = removeTagBefore(
      'Example: <i><b>it<s>alic</s></b></i><s> and <b><u>bol</u></b></s><b><u>d<u></u></u></b>',
      's',
      'Example: it',
      'alic and bol',
    )
    expect(actual).eql('Example: <i><b>italic</b></i> and <b><u>bol</u></b><b><u>d<u></u></u></b>')
  })

  it('removes single tag', () => {
    const actual = removeTag('Example: <span>link</span>', 'span')
    expect(actual).eql('Example: link')
  })

  it('replaces single tag', () => {
    const actual = replaceTag('Example: <span>link</span>', 'span', 'a href=""')
    expect(actual).eql('Example: <a href="">link</a>')
  })
})
