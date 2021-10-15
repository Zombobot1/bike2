import { got, saw, show } from '../../../utils/testUtils'
import * as ThemeBtn from './ThemeBtn.stories'

describe('ThemeBtn', () => {
  beforeEach(() => {
    localStorage.setItem('themeType', 'LIGHT')
  })

  it('Changes Theme', () => {
    show(ThemeBtn.ChangesTheme)

    got('theme-btn-l').click()
    saw('Press me').should('have.css', 'background-color', 'rgb(255, 122, 0)')
    got('theme-btn-d').click()
    saw('Press me').should('have.css', 'background-color', 'rgb(4, 15, 48)')
  })
})
