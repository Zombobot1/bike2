import { assert, describe, it } from 'vitest'
import { getObjectChanges, _applyObjectChanges } from './getObjectChanges'
import { InlineExerciseData, UMediaFileData } from '../../../ublockTypes'
import { prettifyObjectPreview } from '../previewGeneration'

const $ = (o: unknown) => JSON.stringify(o)

describe('getObjectChanges', () => {
  it('basic changes', () => {
    const old: UMediaFileData = { width: 30, src: '.ru' }
    const cur = { width: 40, src: '.com' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepEqual(_applyObjectChanges(old, getObjectChanges($(old), $(cur))), cur as any)
  })

  it('nested changes', () => {
    const old = {
      content: ['wow', { i: 0, type: 'text', correctAnswer: '', explanation: 'e', options: [] }],
    } as InlineExerciseData
    const cur = {
      content: ['wow', { i: 0, type: 'text', correctAnswer: '', explanation: 'e', options: ['1'] }],
    } as InlineExerciseData
    assert.deepEqual(_applyObjectChanges(old, getObjectChanges($(old), $(cur))), cur)
  })

  it('creates new', () => {
    const old = { content: [] } as InlineExerciseData
    const cur = {
      content: ['wow', { i: 0, type: 'audio', correctAnswer: '', explanation: 'e', options: ['1'] }],
    } as InlineExerciseData
    assert.deepEqual(_applyObjectChanges(old, getObjectChanges($(old), $(cur))), cur)
  })

  it('creates new with preview', () => {
    const old = { content: [] } as InlineExerciseData
    const cur = {
      content: [
        'wow',
        { i: 0, type: 'audio', correctAnswer: '', explanation: 'looooooong explanation', options: ['1'] },
      ],
    } as InlineExerciseData
    const changes = getObjectChanges($(old), $(cur))
    const pretty = prettifyObjectPreview(changes.preview)
    assert.equal(pretty[0].data, 'wow audio ...planation ')
  })
})
