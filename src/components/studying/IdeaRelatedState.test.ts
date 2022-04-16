import { assert, describe, it } from 'vitest'
import { UPageChangeDescriptionDTO } from '../../fb/FSSchema'
import { getInitialIdeaState } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { _generators } from '../editing/UPage/UPageState/crdtParser/_fakeUPage'
import { _ideaRS } from './IdeaRelatedState'
import { _trainings } from './_stubs'

describe('IdeaRelatedState', () => {
  it('creates regular training', () => {
    const { idea, preview, data, getTraining } = _ideaRS({ ublocks: [saq('Q')] })
    idea.save(data)
    assert.equal(getTraining()?.ideaId, 'ideaId')
    assert.equal(preview(), 'Q (question): Q*')
  })

  it('creates error training', () => {
    const { idea, preview, data } = _ideaRS({ ublocks: [saq('Q')] })
    idea.setType(data, 'error')
    idea.save(data)
    assert.equal(preview(), 'Q (error): Q!')
  })

  it('detects unsaved changes on new idea', () => {
    const { idea } = _ideaRS({ ublocks: [] }) // new idea is created
    idea.initializeIfNew() // places 1st update
    assert.equal(idea.hasUnsavedChanges, false)

    idea.interceptUpdate('', getInitialIdeaState()[0], description) // simulate change (2nd update)
    assert.equal(idea.hasUnsavedChanges, true)

    idea.save({ ublocks: [saq('Q')] })
    assert.equal(idea.hasUnsavedChanges, false)
  })

  it('detects unsaved changes on existing idea', () => {
    const { idea } = _ideaRS({ ublocks: [] }, _trainings.mock) // data doesn't matter
    assert.equal(idea.hasUnsavedChanges, false)

    idea.interceptUpdate('', getInitialIdeaState()[0], description) // simulate change 1st update
    assert.equal(idea.hasUnsavedChanges, true)

    idea.save({ ublocks: [saq('Q')] })
    assert.equal(idea.hasUnsavedChanges, false)
  })

  it('changes priority', () => {
    const { idea, preview } = _ideaRS({ ublocks: [saq('Q')] }, _trainings.saq)
    idea.changePriority('r', 'high')
    assert.equal(preview(), 'Q (question): Q!')
  })

  it('toggles freeze', () => {
    const { idea, preview, getTraining } = _ideaRS({ ublocks: [saq('Q')] }, _trainings.saq)

    idea.toggleFreeze('r')
    assert.equal(preview(), 'Q (question): Q! (frozen)')
    assert.equal(getTraining()?.frozen, true)

    idea.toggleFreeze('r')
    assert.equal(preview(), 'Q (question): Q!')
    assert.equal(getTraining()?.frozen, false)
  })
})

const description: UPageChangeDescriptionDTO = {
  date: 0,
  preview: [],
  sha: '',
  upageId: '',
  user: '',
}

const { saq } = _generators
