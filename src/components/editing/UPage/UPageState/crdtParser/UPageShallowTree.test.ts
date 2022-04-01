import { assert, describe, it } from 'vitest'
import { str } from '../../../../../utils/types'
import { UBlock, UBlocks, UBlockType, UGridData } from '../../ublockTypes'
import { _getTestFlattenUpage } from './UPageShallowTree'
import { _stateToStr } from './_fakeUPage'

describe('UPageShallowTree', () => {
  it('triggers flag', () => {
    const page = _getTestFlattenUpage([])
    page.triggerFlag('fullWidth', 'set')
    assert.equal(page._data.fullWidth, true)
    page.triggerFlag('fullWidth', 'unset')
    assert.equal(page._data.fullWidth, undefined)
  })

  it('deletes from root', () => {
    const page = _getTestFlattenUpage(['0', '1'])
    assert.equal(_stateToStr(page.data), '0_1')
    page.change('r', r([]))
    page.delete(['0', '1'])
    assert.equal(_stateToStr(page.data), '')
  })

  it('changes data', () => {
    const page = _getTestFlattenUpage([['0', $({ type: 'info', text: '0' }), 'callout']])
    page.change('0', { type: 'error', text: '01' })
    assert.equal(_stateToStr(page.data), '{error, 01}')
  })

  it('changes type', () => {
    const page = _getTestFlattenUpage(['0'])
    page.changeType('0', 'callout', { type: 'info', text: '0' })
    assert.equal(_stateToStr(page.data), '{info, 0}')

    page.changeType('0', 'text', '0')
    assert.equal(_stateToStr(page.data), '0')
  })

  it('inserts in empty page', () => {
    const page = _getTestFlattenUpage([])
    const bs = _bs(['0', '1'])

    page.change('r', r(bs))
    page.insert(bs)

    assert.equal(_stateToStr(page.data), '0_1')
  })

  it('appends data when blocks are moved to a new page', () => {
    const page = _getTestFlattenUpage([])
    const grid: UGridData = [{ ublocks: [{ id: '0', data: '0', type: 'text' }], width: '' }]
    page.append([
      { id: 'g', data: grid, type: 'grid' },
      { id: '1', data: '1', type: 'text' },
    ])
    assert.equal(_stateToStr(page.data), '[{, [0]}]_1')
  })
})

const $ = JSON.stringify
const b = (id: str, data?: str, type: UBlockType = 'text'): UBlock => ({ id, data: data || id, type })
const _bs = (blocks: Array<str | [str, str?, UBlockType?]>): UBlocks =>
  blocks.map((bl) => (!Array.isArray(bl) ? b(bl) : b(...bl)))
const r = (ublocks: UBlocks) => ({ ublocks })
