import { got, saw, show, type, click, lost, _disabled, _green, _red } from '../../../../../utils/testUtils'
import { str } from '../../../../../utils/types'
import { ANSWER_REQUIRED } from '../../../UPage/UPageState/crdtParser/UPageRuntimeTree'
import * as UChecks from './UChecks.stories'

describe('UFormBlock', () => {
  it('validates correct answer in checks | error disappears on selection | +/- options & change in option changes answer', () => {
    show(UChecks.MultipleChoiceEditing)

    click('create')
    saw(ANSWER_REQUIRED)

    click('ctick').type('option', ' a') // change correct answer (value)
    lost(ANSWER_REQUIRED)

    click('ctick', 1).type('option', 1, '{selectAll}{backspace}') // change correct answer (removal)
    type(['new option', 'b'], ['new option', 'c']).click(['create'], ['ctick'], ['submit'])

    saw('Retry 100')
  })

  it('checks color for checked correct tick | missed correct tick | checked wrong tick | wrong feedback | right feedback', () => {
    show(UChecks.MultipleChoiceEditing)

    type(['explanation', 'e'], ['new option', 'w'], ['new option', 'aw']).click(['ctick'], ['ctick', 1], ['create'])
    click(['ctick'], ['ctick', 2], ['submit'])
    saw([tickNode(), _disabled], [tickParent(0), _green], [labelText('Option'), _green])
    saw([tickParent(1), _green], [labelText('1'), _green])
    saw([tickParent(2), _red], [labelText('w'), _red])
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
