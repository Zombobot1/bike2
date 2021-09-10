import { got, intercept, sent, show } from '../../../utils/testUtils'
import * as UFormBlockS from './UFormBlock.stories'

// describe('UFormBlock', () => {
//   beforeEach(intercept)
//   it('Edits input', () => {
//     show(UFormBlockS.InputEditing)

//     got('question').type('question')
//     got('correct answer').type('answer')
//     got('explanation').type('explanation').blur()

//     cy.wait('@patchUBlock').wait('@patchUBlock')
//     sent('@patchUBlock', qS(['answer'], 'explanation', [], 'question'))
//   })

//   it('Edits text area', () => {
//     show(UFormBlockS.TextAreaEditing)
//     got('explanation').type('explanation').blur()
//     sent('@patchUBlock', qS([], 'explanation', [], ''))
//   })

//   it('Edits radio | Change in option leads to change in answer', () => {
//     show(UFormBlockS.RadioEditing)
//     cy.contains('Select correct answer')

//     got('option').eq(1).type(' changed').blur() // anomaly: blur is necessary
//     got('option tick', 'AL').eq(1).click({ force: true }) // MUI sets opacity to 0

//     cy.contains('Select correct answer').should('not.exist')

//     cy.wait('@patchUBlock')
//     sent('@patchUBlock', qS(['Option 2 changed'], '', ['Option 1', 'Option 2 changed'], ''))

//     got('option').eq(1).type(' !').blur()
//     sent('@patchUBlock', qS(['Option 2 changed !'], '', ['Option 1', 'Option 2 changed !'], ''))
//   })

//   it('Creates | Deletes options', () => {
//     show(UFormBlockS.ChecksEditing)

//     got('new option').type('O')
//     sent('@patchUBlock', qS([], '', ['Option 1', 'Option 2', 'O'], ''))

//     got('option').eq(2).type('{Backspace}{Backspace}')
//     sent('@patchUBlock', qS([], '', ['Option 1', 'Option 2'], ''))
//   })
// })
