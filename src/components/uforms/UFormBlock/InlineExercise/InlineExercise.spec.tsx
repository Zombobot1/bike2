import _ from 'lodash'
import { str, strs } from '../../../../utils/types'
import { InlineExerciseDTO, INVALID_EXERCISE, SubQuestion } from '../../types'
import { extractQuestions, inlineQuestions } from './questionsParser'
import { got, saw, show, type, click, _green, _red } from '../../../../utils/testUtils'
import * as InlineExercise from './InlineExercise.stories'

describe('InlineExercise', () => {
  it('parses from string', () => {
    compareQuestions(extractQuestions(d), q)
  })

  it('parses to string', () => {
    const raw = `["Some dummy text",{"correctAnswer":["a"],"explanation":"","options":[],"type":"short-answer"},"another text",{"correctAnswer":["b"],"explanation":"explained","options":[],"type":"short-answer"},"the end.\\nSelect right",{"correctAnswer":["right"],"explanation":"just coz))","options":["right","not right"],"type":"single-choice"},"it's easy.\\n\\nOne more time:",{"correctAnswer":["also wrong"],"explanation":"gotcha))","options":["wrong","also wrong"],"type":"multiple-choice"},", but now it's tricky."]`
    expect(inlineQuestions(JSON.parse(raw))).eq(d)
  })

  it('checks empty exercise', () => {
    show(InlineExercise.Editing)
    click('create')
    saw(INVALID_EXERCISE)
  })

  it('checks missing answers in creation', () => {
    show(InlineExercise.Editing)
    const data = `Some dummy text {a}, {() right () not right # just coz))} but now it's tricky.`
    got('etext').paste({ pasteType: 'text/plain', pastePayload: data })

    cy.get('.invalid').should('exist')
    cy.get('.short-answer').should('exist')

    click('create')
    saw(INVALID_EXERCISE)
  })

  it('highlights form block strs | prevents empty submit | highlights correct | gives feedback | calculates grade', () => {
    show(InlineExercise.Editing)
    got('etext').focus().paste({ pasteType: 'text/plain', pastePayload: d }) // breaks without focusing

    cy.get('.multiple-choice').should('exist')
    cy.get('.single-choice').should('exist')
    cy.get('.explanation').should('exist')

    click(['create'], ['submit'])
    saw(['not right', _red], 'Answer required')
    type(['answer', 0, 'a'], ['answer', 1, 'a']).click(['chip-right'], ['chip-wrong'], ['submit'])
    saw(['4.', _red], ['also wrong', _green], ['3. right -', _green], '50')
  })
})

const d = `Some dummy text {a} another text {b # explained} the end.
Select right {(*) right () not right # just coz))} it's easy.

One more time: {[] wrong [*] also wrong # gotcha))}, but now it's tricky.`

const q = [
  'Some dummy text ',
  `short-answer\na`,
  ' another text ',
  `short-answer\nb\nexplained`,
  ' the end.\nSelect right ',
  `single-choice\nright, not right\nright\njust coz))`,
  " it's easy.\n\nOne more time: ",
  `multiple-choice\nwrong, also wrong\nalso wrong\ngotcha))`,
  ", but now it's tricky.",
]

function questionToStr(q: SubQuestion | str): str {
  if (_.isString(q)) return q
  let r = ''

  r += q.type + '\n'
  if (q.options.length) r += q.options.join(', ') + '\n'
  r += q.correctAnswer.join(', ') + '\n'
  if (q.explanation) r += q.explanation

  return r.trim()
}

function compareQuestions(qs: InlineExerciseDTO, targets: strs) {
  qs.forEach((q, i) => {
    const actual = questionToStr(q)
    const expected = targets[i]
    expect(actual).eq(expected)
  })
}
