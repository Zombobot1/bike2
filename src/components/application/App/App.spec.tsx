import { got, saw, show } from '../../../utils/testUtils'
import { _initFB } from '../../../_seeding'
import * as App from './App.stories'

describe('App', () => {
  before(_initFB)
  it('Shows study after login', () => {
    show(App.ShowsStudyAfterLogin)

    got('email').type('test@gmail.com')
    got('sign-in-with-email').click()
    saw('We sent you an email with further instructions')
    got('sign-in-oob').click()
    saw('Regular trainings')
  })

  it('Shows 404 and lets go home', () => {
    show(App.Shows404AndLetsGoToStudy)

    saw('Whooops!')
    got('go-home').click()
    saw('Regular trainings')
  })
})
