import { type, show, saw, click } from '../../utils/testUtils'
import { ANSWER_REQUIRED, SELECT_CORRECT } from './types'
import * as UForm from './UForm.stories'

describe('UForm', () => {
  it('forbids empty submit | calculates score | retries', () => {
    show(UForm.Submit)

    click('submit')
    saw(ANSWER_REQUIRED)

    click(['rtick'], ['ctick', 1]).type('answer', 'c').click('submit')
    saw('Score: 0%')

    click(['retry'], ['rtick', 2], ['ctick'], ['ctick', 2]).type('answer', 'persian').click('submit')
    saw('Score: 100%')
  })

  it('creates | submits | edits', () => {
    show(UForm.Empty)

    type('New form')
    type(['utext', '['], ['] '], ['etext', 1, 'Q1']).click('ctick')
    type(['utext', '{'], ['} '], ['etext', 2, 'Q2'], ['correct answer', 'a'])
    click('view')
    saw('Q1', 'Q2')

    click('ctick').type('answer', 'a').click('submit')
    saw('Score: 100%')

    click('edit').type('correct answer', 'b').click('view')
    click('ctick').type('answer', 'a').click('submit')
    saw('Score: 50%')
  })

  it('validates without answer', () => {
    show(UForm.Empty)

    type(['utext', '['], ['] '])
    click('view')
    saw(SELECT_CORRECT)

    click(['ctick'], ['view'], ['ctick'], ['submit'])
  })
})
