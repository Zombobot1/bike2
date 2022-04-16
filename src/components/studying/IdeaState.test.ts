import { assert, describe, it } from 'vitest'
import { str } from '../../utils/types'
import { _previewToStr } from '../editing/UPage/UPageState/crdtParser/previewGeneration'
import { BAD_IDEA } from './IdeaRelatedState'
import { _ideaS, _mockIdeaServer } from './IdeaState'
import { _ideaToStr, _trainings } from './_stubs'

describe('IdeaState', () => {
  it('creates new with empty Bytes[]', () => {
    const idea = _ideaS('')

    idea.add('', 'multiple-choice')
    idea.change('0', { correctAnswer: ['Option 1'] })
    idea.save()

    assert.equal(_ideaToStr(idea.state.data), '{, , true, [Option 1], [Option 1, Option 2]}')
  })

  it('prevents empty creation', () => {
    const idea = _ideaS('')
    idea.save()
    assert.equal(_ideaToStr(idea.state.data), 'Add question and provide answer!')

    idea.add('', 'multiple-choice')
    idea.save()
    assert.equal(_ideaToStr(idea.state.data), bad('{, , true, [], [Option 1, Option 2], Provide answer!}'))

    idea.change('0', { correctAnswer: ['Option 1'], $error: '' })
    idea.save()
    assert.equal(_ideaToStr(idea.state.data), '{, , true, [Option 1], [Option 1, Option 2], }')
  })

  it('collects changes into one update for idea creation and change', () => {
    const server = _mockIdeaServer([])
    const idea = _ideaS('', { sendUpdate: server.sendUpdate, create: server.create })

    idea.onFactoryChange('0', 'text')
    idea.add('0', 'short-answer')

    idea.save() // shouldn't trigger sendUpdate

    idea.change('1', { correctAnswer: 'a', $error: '' })
    idea.save()

    assert.equal(server.updates.length, 1)

    idea.add('1', 'callout')
    idea.change('2', { type: 'success', text: 'cat' })
    idea.save()

    assert.equal(server.updates.length, 2)
    assert.equal(
      _previewToStr(server.descriptions[0].preview),
      '<b>Added callout</b><em>cat</em><s>info</s><em>success</em>',
    )
  })

  it('loads data from server', () => {
    const server = _mockIdeaServer([])
    const idea = _ideaS('', { create: server.create })
    idea.setType('error')
    idea.add('', 'short-answer')
    idea.change('0', { correctAnswer: 'a' })
    idea.save()

    assert.equal(server.updates.length, 1)

    // use mock training to avoid flakiness (if idea isNew it will append initial state to updates)
    const idea2 = _ideaS('', { updates: [...server.updates], training: _trainings.mock })

    assert.equal(_ideaToStr(idea2.state.data), '(error) {, , a, false, , true}')
  })
})

const bad = (state: str) => `${BAD_IDEA} ${state}`
