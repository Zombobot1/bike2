import { assert, describe, vi, it } from 'vitest'
import { now } from '../../../../utils/wrappers/timeUtils'
import { f, JSObject } from '../../../../utils/types'
import { setUserId } from '../userId'
import { describeChanges } from './upageChanges'

vi.mock('../../../../utils/wrappers/timeUtils', () => {
  return { now: () => 16e8 }
})

describe('upageChange', () => {
  it('describes update | selects right block id', () => {
    setUserId('u1')

    const preview = describeChanges(
      [
        { t: 'delete', preview: '<s>1</s>', path: [0] },
        { t: 'change-str', changes: { changes: [], preview: '<em>2</em>' }, path: [0], blockId: '2' },
      ],
      new TextEncoder().encode('1'),
    )
    assert.deepEqual(preview, {
      block: '2',
      date: 16e8,
      preview: '<s>1</s><br><em>2</em>',
      sha: '6b86b2',
      user: 'u1',
    })
  })

  it('skips description if change is not describable', () => {
    setUserId('u1')

    const preview = describeChanges(
      [
        { t: 'change-type', path: [0], type: 'numbered-list' },
        { t: 'change-root', changes: { changes: [{ key: 'color', value: 'fff' }], preview: 'wow' } },
        { t: 'delete-page' },
      ],
      new TextEncoder().encode('1'),
    )

    assert.equal(preview, undefined)
  })
})
