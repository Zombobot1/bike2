import { doNotFret, saw, show } from '../../../utils/testUtils'
import { _initFB } from '../../../_seeding'
import * as Fetch from './Fetch.stories'

describe('Fetch', () => {
  before(_initFB)
  it('Shows data', () => {
    show(Fetch.Success)
    saw('test')
  })

  it('Shows error', () => {
    doNotFret()
    show(Fetch.Fail)
    saw('Error!')
  })
})
