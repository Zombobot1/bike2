import { doNotFret, saw, show } from '../../../utils/testUtils'
import * as Fetch from './Fetch.stories'

describe('Fetch', () => {
  it('Shows data', () => {
    show(Fetch.ExistingData)
    saw('test')
  })

  it('Shows error', () => {
    doNotFret()
    show(Fetch.Fail404)
    saw('Error!')
  })

  // no idea how to check that data is preserved
  // it('Shows instantly initial data and preserves it when document is just created', () => {
  //   show(Fetch.InstantNewData)
  //   saw('instantData')
  // })
})
