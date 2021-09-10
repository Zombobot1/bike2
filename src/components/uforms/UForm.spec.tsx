import { got, utext, intercept, show, expectCSSPlaceholder } from '../../utils/testUtils'
import * as UForm from './UForm.stories'

// describe('UForm', () => {
//   beforeEach(intercept)
//   it('Is displayed as one block page', () => {
//     show(UForm.EmptyQuestion)

//     utext().then(expectCSSPlaceholder('"Type /checks or /input etc."'))
//     utext().type('/checks ')
//     got('explanation').should('be.visible')
//     utext().should('not.exist')
//   })

//   it('Prevents empty answer submission | shows readonly feedback', () => {
//     show(UForm.SubmittingAnswer)
//     cy.contains('Select right:')

//     got('submit-btn').click()
//     cy.contains('Answer, please!').should('be.visible')

//     got('option tick', 'AL').eq(0).click({ force: true })
//     cy.contains('Answer, please!').should('not.exist')
//     got('option tick', 'AL').eq(3).click({ force: true })

//     got('submit-btn').click()
//     cy.get('.MuiCheckbox-root').eq(0).should('have.css', 'color', 'rgba(5, 166, 119, 0.6)')
//     cy.get('.MuiCheckbox-root').eq(1).should('have.css', 'color', 'rgba(5, 166, 119, 0.6)')
//     cy.get('.MuiCheckbox-root').eq(3).should('have.css', 'color', 'rgba(250, 82, 82, 0.6)')
//     cy.contains('Explanation').should('be.visible')
//   })
// })
