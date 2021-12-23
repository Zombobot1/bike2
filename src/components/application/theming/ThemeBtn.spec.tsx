import { got, saw, show } from '../../../utils/testUtils'
import { COLORS } from './theme'
import * as ThemeBtn from './ThemeBtn.stories'

const orange = COLORS.secondary
const darkBlue = COLORS.primary

describe('ThemeBtn', () => {
  // eslint-disable-next-line mocha/no-hooks-for-single-case
  after(() => localStorage.setItem('themeType', 'light'))

  it('Changes Theme', () => {
    localStorage.setItem('themeType', 'light')
    show(ThemeBtn.ChangesTheme)

    got('theme-btn-l').click()
    saw(['Press me', orange, 'bg'])
    got('theme-btn-d').click()
    saw(['Press me', darkBlue, 'bg'])
  })
})
