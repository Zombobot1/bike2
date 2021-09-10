import * as UPageS from './UBlocksSet.stories'
import { fakedId, got, intercept, sent, sentTo, show } from '../../../../utils/testUtils'

const utext = () => got('utext')

// describe('UPage', () => {
//   beforeEach(intercept)
//   it('Factory preserves focus when adding empty blocks | create ublock api', () => {
//     fakedId()

//     show(UPageS.CreatesBlocks)

//     utext().type('{enter}')

//     utext().last().should('have.focus')

//     sent('@postUBlock', '0', '_id')
//     sent('@patchUBlock', '["0"]')
//   })

//   it('Factory loses focus when adding not empty blocks | post ublock api | block adds new block', () => {
//     show(UPageS.CreatesBlocks)

//     utext().type('/')

//     utext().first().should('have.focus').contains('/')

//     sent('@postUBlock', '/')

//     utext().first().type('{enter}')
//     utext().eq(1).should('have.focus')
//   })

//   it('Factory loses focus on backspace | focus moves on block deletion | delete api', () => {
//     show(UPageS.DeletesBlocks)
//     cy.contains('d')

//     utext().eq(2).type('{Backspace}')

//     utext().eq(1).should('have.focus').type('{Backspace}{Backspace}')
//     utext().first().should('have.focus')

//     sentTo('@deleteUBlock', 'data2')
//     sent('@patchUBlock', '["data4"]')
//   })

//   it('Factory loses focus on adding not empty block and block is pushed back', () => {
//     show(UPageS.DeletesBlocks)
//     cy.contains('d')

//     utext().eq(2).type('/')

//     utext().eq(2).should('have.focus').contains('/')
//   })

//   it('Readonly', () => {
//     show(UPageS.Readonly)
//     cy.contains('d')

//     utext().eq(0).should('have.attr', 'disabled')
//     utext().eq(1).should('have.attr', 'disabled')
//   })
// })
