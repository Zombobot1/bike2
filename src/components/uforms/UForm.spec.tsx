import { got, type, show, saw, click, _red } from '../../utils/testUtils'
import * as UForm from './UForm.stories'

describe('UForm', () => {
  it('forbids empty submit | calculates score | retries', () => {
    show(UForm.Submit)

    click('submit')
    saw('Answer required!')

    click(['rtick'], ['ctick', 1]).type('answer', 'c').click('submit')
    saw('Score: 0%')

    click(['retry'], ['rtick', 2], ['ctick'], ['ctick', 2]).type('answer', 'persian').click('submit')
    saw('Score: 100%')
  })

  it('creates | submits | edits', () => {
    show(UForm.Empty)

    type('New form')
    type(['utext', '/'], ['checks '], ['etext', 1, 'Q1']).click('ctick')
    type(['utext', '/'], ['input '], ['etext', 2, 'Q2'], ['correct answer', 'a'])
    click('view')
    saw('Q1', 'Q2')

    click('ctick').type('answer', 'a').click('submit')
    saw('Score: 100%')

    click('edit').type('correct answer', 'b').click('view')
    click('ctick').type('answer', 'a').click('submit')
    saw('Score: 50%')
  })

  it('validates empty | without answer', () => {
    show(UForm.Empty)

    click('view')
    saw('Add questions!', [() => got('view'), _red])

    type(['utext', '/'], ['checks '])
    click('view')
    saw('Select correct answer!')

    click(['ctick'], ['view'], ['ctick'], ['submit'])
  })

  it('shows error when empty and readonly | when does not contains correct answer', () => {
    show(UForm.EmptyWithName)

    saw('Missing questions!')
    click(['edit'], ['view'])
    saw('Add questions!')

    type(['utext', '/'], ['checks ']).click('view')
    saw('Select correct answer!')

    click(['ctick'], ['view'], ['ctick'], ['submit'])
  })
})
