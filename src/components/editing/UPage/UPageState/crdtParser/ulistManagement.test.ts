import { assert, describe, it } from 'vitest'
import { f } from '../../../../../utils/types'
import { UBlock, UBlocks, UListData, UPageData } from '../../ublockTypes'
import { UListChanger } from './ulistManagement'
import { UPageTree } from './UPageTree'
import { _generators, _stateToStr } from './_fakeUPage'

describe('ulistManagement', () => {
  it('does not move left', () => {
    const { mover, state } = getMover(lr(l('0'), l('1')))
    mover.moveLeft('0')
    mover.moveLeft('1')
    assert.equal(_stateToStr(state), '[{0}, {1}]')
  })

  it('moves left simple', () => {
    const { mover, state } = getMover(lr(l('0', [l('01')])))
    mover.moveLeft('01')
    assert.equal(_stateToStr(state), '[{0}, {01}]')
  })

  it('moves left and saves children', () => {
    const { mover, state } = getMover(lr(l('0', [l('01', [l('011')])])))
    mover.moveLeft('01')
    assert.equal(_stateToStr(state), '[{0}, {01, [{011}]}]')
  })

  it('moves left first child - second child becomes its child', () => {
    const { mover, state } = getMover(lr(l('0', [l('01'), l('02')])))
    mover.moveLeft('01')
    assert.equal(_stateToStr(state), '[{0}, {01, [{02}]}]')
  })

  it('moves left through node', () => {
    const { mover, state } = getMover(lr(l('0', [l('01', [l('011')])])))
    mover.moveLeft('011')
    mover.moveLeft('011')
    assert.equal(_stateToStr(state), '[{0, [{01}]}, {011}]')
  })

  it('moves left and separates list', () => {
    const { mover, state } = getMover(lr(l('0'), l('1'), l('2')))
    mover.moveLeft('1', { deleteMark: true })
    const move = mover.moveLeft('1', { deleteMark: true })
    if (move.status === 'failed') throw new Error('Failed moved')

    assert.deepEqual(move?.blockBelow?.data, '1')
    assert.deepEqual((move?.listBelow?.data as UListData)[0].ublock.data, '2')
    assert.equal(_stateToStr(state), '[{0}]')
  })

  it('moves left on backspace depth 1 | list is deleted correctly with separation from top', () => {
    const { mover, state } = getMover(lr(l('0'), l('1', [l('11')])))
    mover.moveLeft('11', { deleteMark: true })
    const move1 = mover.moveLeft('11', { deleteMark: true }) // will be deleted from list
    assert.equal(_stateToStr(state), '[{0}, {1}]')
    if (move1.status === 'failed') throw new Error('Failed moved')
    assert.deepEqual(move1?.blockBelow?.data, '11')

    mover.moveLeft('0', { deleteMark: true })
    const move2 = mover.moveLeft('0', { deleteMark: true })
    if (move2.status === 'failed') throw new Error('Failed moved')
    assert.equal(move2.deletedId, 'l')
    assert.deepEqual(move2?.blockBelow?.data, '0')
    assert.deepEqual((move2?.listBelow?.data as UListData)[0].ublock.data, '1')
    assert.equal(_stateToStr(state), '[]')
  })

  it('does not move right', () => {
    const { mover, state } = getMover(lr(l('0', [l('01')])))
    mover.moveRight('0')
    mover.moveRight('01')
    assert.equal(_stateToStr(state), '[{0, [{01}]}]')
  })

  it('moves right simple', () => {
    const { mover, state } = getMover(lr(l('0'), l('1'), l('2')))
    mover.moveRight('2')
    mover.moveRight('1')
    assert.equal(_stateToStr(state), '[{0, [{1, [{2}]}]}]')
  })

  it('moves right: appends diagonally', () => {
    const { mover, state } = getMover(lr(l('0', [l('01')]), l('1')))
    mover.moveRight('1')
    assert.equal(_stateToStr(state), '[{0, [{01}, {1}]}]')
  })
})

const getMover = (ublocks: UBlocks | UBlock) => {
  if (!Array.isArray(ublocks)) ublocks = [ublocks]
  const state: UPageData = { ublocks }
  const tree = new UPageTree(state, () => '?', f, f, f)
  return { mover: new UListChanger(tree, () => 'l2'), state }
}

const { lr, l } = _generators
