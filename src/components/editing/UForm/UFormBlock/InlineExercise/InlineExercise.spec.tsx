import { got, saw, show, type, click, _green, _red } from '../../../../../utils/testUtils'
import * as InlineExercise from './InlineExercise.stories'
import { ANSWER_REQUIRED, INVALID_EXERCISE } from '../../../UPage/UPageState/crdtParser/UPageRuntimeTree'

describe('InlineExercise', () => {
  it('checks empty exercise', () => {
    show(InlineExercise.Editing)
    click('create')
    saw(ANSWER_REQUIRED)
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
    saw(['not right', _red], ANSWER_REQUIRED)
    type(['answer', 0, 'a'], ['answer', 1, 'a']).click(['chip-right'], ['chip-wrong'], ['submit'])
    saw(['4.', _red], ['also wrong', _green], ['3. right -', _green], '50')
  })
})

const d = `Some dummy text {a} another text {b # explained} the end.
Select right {(*) right () not right # just coz))} it's easy.

One more time: {[] wrong [*] also wrong # gotcha))}, but now it's tricky.`
