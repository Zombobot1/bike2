import { got, saw, show, type, click, _disabled, _green, _red, CYChain } from '../../../../../utils/testUtils'
import { ANSWER_REQUIRED } from '../../../UPage/UPageState/crdtParser/UPageRuntimeTree'
import * as UInput from './UInput.stories'

describe('UInput', () => {
  it('validates correct answer in input | prevents empty submission | provides feedback (caseless comparison, explanation is correct answer if empty) ', () => {
    show(UInput.ShortAnswerEditing)

    click('create')
    saw(ANSWER_REQUIRED)

    type('correct answer', 'A').blur() // anomaly: cannot click create directly - blur happens after click
    click(['create'], ['submit'])
    saw(ANSWER_REQUIRED)

    type('answer', 'b').click('submit')
    saw([input, _disabled], ['A', _red], [input, _red])

    click('retry').type('answer', 'a').click('submit')
    saw(['A', _green], [input, _green])
  })

  it('shows question | shows input explanation', () => {
    show(UInput.ShortAnswerEditing)

    type(['etext', 'Q'], ['correct answer', 'A'], ['explanation', 'E']).click('create')
    saw('Q')

    type('answer', 'A').click('submit')
    saw('E')
  })

  it('text area can be created without correct answer', () => {
    show(UInput.LongAnswerEditing)
    type('explanation', 'E').click('create').type('answer', 'A').click('submit')
    saw('E')
  })
})

const input = (): CYChain => got('answer')
