import { got, saw, show } from '../../../utils/testUtils'
import * as ThemeBtn from './ThemeBtn.stories'

const light = 'rgb(255, 122, 0)'
const dark = 'rgb(4, 15, 48)'

describe('ThemeBtn', () => {
  // eslint-disable-next-line mocha/no-hooks-for-single-case
  after(() => localStorage.setItem('themeType', 'light'))

  it('Changes Theme', () => {
    localStorage.setItem('themeType', 'light')
    show(ThemeBtn.ChangesTheme)

    got('theme-btn-l').click()
    saw(['Press me', light, 'bg'])
    got('theme-btn-d').click()
    saw(['Press me', dark, 'bg'])
  })
})
