import { assert, describe, it } from 'vitest'
import { UPageChangeDescriptionDTO } from '../../fb/FSSchema'
import { getInitialUPageState } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { _generators } from '../editing/UPage/UPageState/crdtParser/_fakeUPage'
import { _ideaRS } from './IdeaRelatedState'
import { _trainings } from './_stubs'

describe('IdeaRelatedState', () => {
  describe('creates', () => {
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

    it('creates inline exercise training', () => {
      const { idea, preview, data } = _ideaRS({ ublocks: [ie('A', subq(0, '_'), 'and', subq(1, '_', ['b']))] })
      idea.save(data)
      assert.equal(preview(), 'A __ and __ (question): a*, b*')
    })
  })

  describe('changes', () => {
    it('detects unsaved changes on new idea', () => {
      const { idea } = _ideaRS({ ublocks: [] }) // new idea is created
      idea.initializeIfNew() // places 1st update
      assert.equal(idea.hasUnsavedChanges, false)

      idea.interceptUpdate('', getInitialUPageState()[0], description) // simulate change (2nd update)
      assert.equal(idea.hasUnsavedChanges, true)

      idea.save({ ublocks: [saq('Q')] })
      assert.equal(idea.hasUnsavedChanges, false)
    })

    it('detects unsaved changes on existing idea', () => {
      const { idea } = _ideaRS({ ublocks: [] }, _trainings.mock) // data doesn't matter
      assert.equal(idea.hasUnsavedChanges, false)

      idea.interceptUpdate('', getInitialUPageState()[0], description) // simulate change 1st update
      assert.equal(idea.hasUnsavedChanges, true)

      idea.save({ ublocks: [saq('Q')] })
      assert.equal(idea.hasUnsavedChanges, false)
    })

    it('changes priority', () => {
      const { idea, preview } = _ideaRS({ ublocks: [saq('Q')] }, _trainings.saq)
      idea.changePriority(0, 'high')
      assert.equal(preview(), 'Q (question): Q!')
    })

    it('toggles freeze', () => {
      const { idea, preview, getTraining } = _ideaRS({ ublocks: [saq('Q')] }, _trainings.saq)

      idea.toggleFreeze(0)
      assert.equal(preview(), 'Q (question): Q! (frozen)')
      assert.equal(getTraining()?.frozen, true)

      idea.toggleFreeze(0)
      assert.equal(preview(), 'Q (question): Q!')
      assert.equal(getTraining()?.frozen, false)
    })

    it('changes preview when data is changed', () => {
      const { idea, preview } = _ideaRS({ ublocks: [saq('Q')] }, _trainings.saq)
      idea.save({ ublocks: [saq('Q2')] })
      assert.equal(preview(), 'Q2 (question): Q2!')
    })

    it('changes indicators when exercise is changed', () => {
      const { idea, preview, getTraining, data } = _ideaRS(
        { ublocks: [ie('A', subq(0, '_'), 'and', subq(1, '_', ['b']))] },
        _trainings.ie,
      )
      data.ublocks = [ie('New', subq(0, '[', ['o1']), 'changed', subq(1, '['), 'deleted')]
      idea.save(data)
      assert.equal(preview(), 'New [] changed [] deleted (question): o1*, a*')
      assert.equal(getTraining()?.indicators[0].stageId, '')
      assert.equal(getTraining()?.indicators[1].stageId, '1')
    })

    it('changes indicators when exercise is turned into another block', () => {
      const { idea, preview, getTraining, data } = _ideaRS(
        { ublocks: [ie('A', subq(0, '_'), 'and', subq(1, '_', ['b']))] },
        _trainings.ie,
      )
      data.ublocks = [saq('Q')]
      idea.save(data)
      assert.equal(preview(), 'Q (question): Q*')
      assert.equal(getTraining()?.indicators[0].stageId, '')
    })
  })
})

const description: UPageChangeDescriptionDTO = {
  date: 0,
  preview: [],
  sha: '',
  upageId: '',
  user: '',
}

const { saq, ie, subq } = _generators
