import { got, saw, show, type, click, lost, _disabled, _green, _red } from '../../../utils/testUtils'
import { str } from '../../../utils/types'
import * as UFormBlockS from './UFormBlock.stories'

describe('UFormBlock', () => {
  it('validates correct answer in input | prevents empty submission | provides feedback (caseless comparison, explanation is correct answer if empty) ', () => {
    show(UFormBlockS.InputEditing)

    click('create')
    saw('Select correct answer!')

    type('correct answer', 'A').blur() // anomaly: cannot click create directly - blur happens after click
    click(['create'], ['submit'])
    saw('Answer required!')

    type('answer', 'b').click('submit')
    saw([input, _disabled], ['A', _red], [input, _red])

    click('retry').type('answer', 'a').click('submit')
    saw(['A', _green], [input, _green])
  })

  it('shows question | shows input explanation', () => {
    show(UFormBlockS.InputEditing)

    type(['etext', 'Q'], ['correct answer', 'A'], ['explanation', 'E']).click('create')
    saw('Q')

    type('answer', 'A').click('submit')
    saw('E')
  })

  it('text area can be created without correct answer', () => {
    show(UFormBlockS.TextAreaEditing)
    type('explanation', 'E').click('create').type('answer', 'A').click('submit')
    saw('E')
  })

  it('validates correct answer in checks | error disappears on selection | +/- options & change in option changes answer', () => {
    show(UFormBlockS.ChecksEditing)

    click('create')
    saw('Select correct answer!')

    click('ctick')
    lost('Select correct answer!')

    type('option', ' a') // change correct answer (value)
    type('new option', 'b').click('ctick', 1).type('option', 1, '{backspace}{backspace}') // change correct answer (removal)
    type('new option', 'c').click(['create'], ['ctick'], ['submit'])
    saw('Retry 100')
  })

  it('checks color for checked correct tick | missed correct tick | checked wrong tick | wrong feedback | right feedback', () => {
    show(UFormBlockS.ChecksEditing)

    type(['explanation', 'e'], ['new option', '1'], ['new option', '2']).click(['ctick'], ['ctick', 1], ['create'])
    click(['ctick'], ['ctick', 2], ['submit'])
    saw([tickNode(), _disabled], [tickParent(0), _green], [labelText('Option'), _green])
    saw([tickParent(1), _green], [labelText('1'), _green])
    saw([tickParent(2), _red], [labelText('2'), _red])
    saw(['e', _red])

    click(['retry'], ['ctick'], ['ctick', 1], ['submit'])
    saw(['e', _green])
  })
})

const tickNode =
  (eq = 0, type: '✓' | '⊙' = '✓') =>
  () =>
    got(type === '⊙' ? 'rtick' : 'ctick', eq)
const tickParent =
  (eq = 0, type: '✓' | '⊙' = '✓') =>
  () =>
    tickNode(eq, type)().parent()
const labelText = (text: str) => () => cy.contains(text).find('.MuiTypography-root')
const input = () => got('answer')
