import { assert, describe, it } from 'vitest'
import { _fakeUTableChanger } from './useUTable'

describe('useUTable', () => {
  it('sets cell', () => {
    const { changer, toStr } = _getTable()
    changer.setCell(2, 1, 'to')
    assert.equal(toStr(), '[[00,01],[10,11],[20,to]]')
  })

  it('adds row', () => {
    const { changer, toStr } = _getTable()
    changer.addRow(0)
    assert.equal(toStr(), '[[00,01],[,],[10,11],[20,21]]') // [,] - row with 2 empty cols
  })

  it('adds row above 0', () => {
    const { changer, toStr } = _getTable()
    changer.addRow(0, 'above')
    assert.equal(toStr(), '[[,],[00,01],[10,11],[20,21]]')
  })

  it('deletes row & col', () => {
    const { changer, toStr } = _getTable()
    changer.removeRow(1)
    assert.equal(toStr(), '[[00,01],[20,21]]')

    changer.removeColumn(0)
    assert.equal(toStr(), '[[01],[21]]')
  })

  it('clears last row instead of removal', () => {
    const { changer, toStr } = _getTable()
    changer.removeRow(0)
    changer.removeRow(0)
    changer.removeRow(0)
    assert.equal(toStr(), '[[,]]')
  })

  it('clears last col instead of removal', () => {
    const { changer, toStr } = _getTable()
    changer.removeColumn(0)
    changer.removeColumn(0)
    assert.equal(toStr(), '[[],[],[]]')
  })
})

const _getTable = () =>
  _fakeUTableChanger([
    ['00', '01'],
    ['10', '11'],
    ['20', '21'],
  ])
