import { got, saw, show } from '../../../../utils/testUtils'
import * as AppBar from './AppBar.stories'

describe('AppBar', () => {
  it('shows path in a compact way on mobile', () => {
    cy.viewport(400, 750)
    show(AppBar.OverflowWithThreeElements)
    saw('Informa...')
    saw('Iteration vs...')

    got('...-btn').click()
    got('...-page-btn').click()

    saw('Informati...')
    saw('Python')
  })
})
