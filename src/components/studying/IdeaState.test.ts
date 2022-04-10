import { assert, describe, it } from 'vitest'
import { f, str } from '../../utils/types'
import { uuidS } from '../../utils/wrappers/uuid'
import { _previewToStr } from '../editing/UPage/UPageState/crdtParser/previewGeneration'
import { _mockServer } from '../editing/UPage/UPageState/crdtParser/UPageStateCR'
import { BAD_IDEA, IdeaState, _ideaS } from './IdeaState'
import { _ideaToStr } from './_stubs'

describe('IdeaState', () => {
  it('creates new with empty Bytes[]', () => {
    const idea = new IdeaState('', [], { editing: true, getId: uuidS(0), sendUpdate: f })

    idea.add('', 'multiple-choice')
    idea.change('0', { correctAnswer: ['Option 1'] })
    idea.handleUCardEvent('toggle-edit')

    assert.equal(_ideaToStr(idea.state.data), '{, , false, [Option 1], [Option 1, Option 2]}')
  })

  it('prevents empty creation', () => {
    const idea = _ideaS('', { editing: true })
    idea.handleUCardEvent('toggle-edit')
    assert.equal(_ideaToStr(idea.state.data), 'Add question and provide answer!')

    idea.add('', 'multiple-choice')
    idea.handleUCardEvent('toggle-edit')
    assert.equal(_ideaToStr(idea.state.data), bad('{, , true, [], [Option 1, Option 2], Provide answer!}'))

    idea.change('0', { correctAnswer: ['Option 1'], $error: '' })
    idea.handleUCardEvent('toggle-edit')
    assert.equal(_ideaToStr(idea.state.data), '{, , false, [Option 1], [Option 1, Option 2], }')
  })

  it('collects changes into one update', () => {
    const server = _mockServer([])
    const idea = _ideaS('', { editing: true, sendUpdate: server.sendUpdate })

    idea.onFactoryChange('0', 'text')
    idea.add('0', 'short-answer')

    idea.handleUCardEvent('toggle-edit') // shouldn't trigger sendUpdate

    idea.change('1', { correctAnswer: 'a', $error: '' })
    idea.handleUCardEvent('toggle-edit')

    assert.equal(server.updates.length, 1)
    assert.equal(_previewToStr(server.descriptions[0].preview), '<em>0</em><b>Added short-answer</b><em>a</em>')
  })

  it('loads data from server', () => {
    const server = _mockServer([])
    const idea = new IdeaState('', [...server.updates], {
      editing: true,
      getId: uuidS(0),
      sendUpdate: server.sendUpdate,
    })

    idea.add('', 'short-answer')
    idea.change('0', { correctAnswer: 'a' })
    idea.handleUCardEvent('toggle-edit')

    assert.equal(server.updates.length, 1)
    const idea2 = new IdeaState('', [...server.updates], { editing: true, getId: uuidS(1), sendUpdate: f })
    assert.equal(_ideaToStr(idea2.state.data), '{, , a, false, , true}')
  })
})

const bad = (state: str) => `${BAD_IDEA} ${state}`
