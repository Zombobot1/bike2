import { cutData } from '../../../utils/algorithms'
import { type, show, saw, got } from '../../../utils/testUtils'
import { safe } from '../../../utils/utils'
import {
  insertTag,
  removeTag,
  removeTagBefore,
  replaceCode,
  replaceTag,
  codeOffset,
  removeCode,
  sliceHtml,
  scrollThroughTags,
} from './htmlAsStr'
import { cursorOffset } from './selection'
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
    cy.get('strong').eq(0).contains('Example')
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

  it('calculates selection position in empty block', () => {
    show(Selection.CalculatesEmptySelectionPosition)
    got('rec').should('have.css', 'top', '34.2857px')
    got('rec').should('have.css', 'left', '0px')
  })

  it('ignores code children when calculates offset', () => {
    show(Selection.IgnoresCode)
    cy.then(() => expect(cursorOffset(safe(document.getElementById('ce')))).eq(3))
  })

  it('inserts code', () => {
    show(Selection.InsertsCode)
    cy.get('code').contains('ata')
  })

  it('inserts tag at start', () => {
    const actual = insertTag('Example: <b>bold</b>', 'b', '', 'Example')
    expect(actual).eql('<b>Example</b>: <b>bold</b>')
  })

  it('scrolls through tags', () => {
    const html = 'Example: <i><b>italic</b></i> and <b><u>bold<u/></b>'

    const offsetFromStart = scrollThroughTags(0, html, 'Example: it')
    expect(html.slice(0, offsetFromStart)).eql('Example: <i><b>it')

    const offsetInMiddle = scrollThroughTags(offsetFromStart, html, 'alic and bol')
    expect(html.slice(offsetFromStart, offsetInMiddle)).eql('alic</b></i> and <b><u>bol')
    // it will not include all tags at the end (<u/></b>)
    const offsetAtEnd = scrollThroughTags(offsetInMiddle, html, 'd')
    expect(html.slice(0, offsetAtEnd)).eql('Example: <i><b>italic</b></i> and <b><u>bold')
  })

  it('slices html', () => {
    expect(sliceHtml('a <b>bold</b>', 3)).eql('a <b>b')
    expect(sliceHtml('cat', 2)).eql('ca')
    expect(sliceHtml('a <code>E==mc^2</code> big', 4)).eql('a <code>E==mc^2</code> b')
  })

  it('inserts tag', () => {
    const actual = insertTag('Example: <i><b>italic</b></i> and <b><u>bold<u/></b>', 's', 'Example: it', 'alic and bol')
    expect(actual).eql('Example: <i><b>it<s>alic</b></i> and <b><u>bol</s>d<u/></b>')
  })

  it('inserts code tag', () => {
    expect(cutData('bold', 1, 2)).eql('bld')
    const actual = insertTag('bold', 'code', 'b', 'o', 'data-id="3" contenteditable="false"', 'BODY')
    expect(actual).eql('b<code data-id="3" contenteditable="false">BODY</code>ld')
  })

  it('when body is not provided inserts code as usual tag', () => {
    const actual = insertTag('bold', 'code', 'b', 'o', 'data-id="3" contenteditable="false"')
    expect(actual).eql('b<code data-id="3" contenteditable="false">o</code>ld')
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

  it('replaces code', () => {
    const actual = replaceCode(
      'Example: <code data-id="1" contenteditable="false">E^2</code> text',
      '1',
      'E^2 = \\frac{1}{2}',
    )
    expect(actual).eql('Example: <code data-id="1" contenteditable="false">E^2 = \\frac{1}{2}</code> text')
  })

  it('removes code', () => {
    expect(removeCode('bold <code data-id="1" contenteditable="false">E^2</code>', '1')).eql('bold ')
    expect(removeCode('bold<code data-id="1" contenteditable="false"></code>', '1')).eql('bold')
  })

  it('calculates cursor offset for code', () => {
    const actual = codeOffset('Example: <code data-id="1" contenteditable="false">E^2</code> text', '1')
    expect(actual).eql(10)
    const a2 = codeOffset(
      't <code data-id="2" contenteditable="false">E^2</code> d <code data-id="1" contenteditable="false">E</code> p',
      '1',
    )
    expect(a2).eql(6)
  })

  it('slices text with code', () => {
    const actual = sliceHtml('Example: <code data-id="1" contenteditable="false">E^2</code> text', 11)
    expect(actual).eql('Example: <code data-id="1" contenteditable="false">E^2</code> t')
    expect(sliceHtml(`cats ${tex} and`, 7)).eql(`cats ${tex} a`)
  })
})
const tex = `<code data-id="2" contenteditable="false"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>h</mi><mrow><mi>t</mi><mi>o</mi><mi>t</mi><mi>a</mi><mi>l</mi></mrow></msub><mo>≈</mo><mn>5.5</mn><mo>∗</mo><mn>2.5</mn><mo>=</mo><mn>13.77</mn><mi>m</mi></mrow><annotation encoding="application/x-tex">h_{total} \\approx 5.5 * 2.5 = 13.77m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.84444em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">a</span><span class="mord mathnormal mtight" style="margin-right:0.01968em;">l</span></span></span></span></span><span class="vlist-s"></span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">≈</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;"></span><span class="mord">5.5</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;"></span><span class="mord">2.5</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;"></span><span class="mord">13.77</span><span class="mord mathnormal">m</span></span></span></span></code>`
