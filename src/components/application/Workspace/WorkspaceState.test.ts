import { assert, describe, vi, it, expect } from 'vitest'
import { str, strs } from '../../../utils/types'
import { UPageNodesData, UPageNodeData } from './types'
import { WorkspaceOpenness, _getWS, _navToStr } from './WorkspaceState'

describe('workspace', () => {
  it('derives navigation', () => {
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')])
    assert.equal(_navToStr(ws.state), 'f: [{*1},{*02}] p: [{0, [{01},{*02}]},{*1}]')
  })

  it('derives pages in parent', () => {
    const ws = _getWS([p('0', [p('01', [p('001'), p('002')]), p('*02')]), p('*1')])
    assert.equal(ws.getPagesIn('01').join(', '), '01, 001, 002')
  })

  it('derives top level paths', () => {
    const paths = _getWS([p('0', [p('01')]), p('1')]).topPaths()
    assert.equal(paths.map((p) => p.id).join(', '), '0, 1')
  })

  it('triggers favorite', () => {
    let updatedDTO: { favorite: strs } | undefined

    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')], { sendDTO: (d) => (updatedDTO = d) })
    ws.triggerFavorite('*02')
    assert.equal(_navToStr(ws.state), 'f: [{*1}] p: [{0, [{01},{*02}]},{*1}]')
    ws.triggerFavorite('0')
    assert.equal(_navToStr(ws.state), 'f: [{0, [{01},{*02}]},{*1}] p: [{0, [{01},{*02}]},{*1}]')
    assert.equal(ws.isFavorite('0'), true)

    assert.equal(updatedDTO?.favorite.includes('0'), true)
  })

  it('renames | gets color', () => {
    const sendUpdate = vi.fn()
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')], { sendUpdate })

    ws.rename('01', 'zo')
    assert.equal(_navToStr(ws.state), 'f: [{*1},{*02}] p: [{0, [{zo},{*02}]},{*1}]')

    expect(sendUpdate).toHaveBeenCalledOnce()
    assert.equal(ws.name('01'), 'zo')
    assert.equal(ws.color('01'), 'red')
  })

  it('opens', () => {
    let openness: WorkspaceOpenness | undefined
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')], { updateOpenness: (d) => (openness = d) })

    ws.triggerOpen('01')
    assert.equal(_navToStr(ws.state), 'f: [{*1},{*02}] p: [{0, [{01^},{*02}]},{*1}]')
    ws.triggerFavoriteOpen('*1')
    assert.equal(_navToStr(ws.state), 'f: [{*1^},{*02}] p: [{0, [{01^},{*02}]},{*1}]')

    assert.equal(openness?.openFavorite.includes('*1'), true)
    assert.equal(openness?.open.includes('01'), true)
  })

  it('propagates color to new pages', () => {
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')])
    // *1 is on another level, it works but it is supposed to be called with one level pages
    ws.setColor('0', 'blue')
    ws.add('0', '*02', '03')
    ws.rename('03', '03')
    assert.equal(_navToStr(ws.state), 'f: [{*1},{*02}] p: [{0, blue, [{01},{*02},{03, blue}]},{*1}]')
  })

  it('deletes', () => {
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')])
    // *1 is on another level, it works but it is supposed to be called with one level pages
    ws.triggerOpen('01')
    ws.remove(['01', '*02', '*1'])
    assert.equal(_navToStr(ws.state), '[{0}]')
    assert.deepEqual(
      ws.removedPages().map((p) => p.node.id),
      ['01', '*02', '*1'],
    )
  })

  it('deletes permanently', () => {
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')])
    // *1 is on another level, it works but it is supposed to be called with one level pages
    ws.triggerOpen('01')
    ws.removePermanently(['01', '*02', '*1'])
    assert.equal(_navToStr(ws.state), '[{0}]')
  })

  it('moves', () => {
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')])
    ws.remove(['01', '*02'], { moveTo: '*1' })
    assert.equal(_navToStr(ws.state), 'f: [{*1, [{01},{*02}]},{*02}] p: [{0},{*1, [{01},{*02}]}]')
  })

  it('checks existence | gives path', () => {
    const ws = _getWS([p('0', [p('01'), p('*02')]), p('*1')])
    assert.equal(ws.has('01'), true)
    assert.deepEqual(ws.path('*02'), [
      { id: '0', name: '0' },
      { id: '*02', name: '*02' },
    ])
  })

  it('removes current', () => {
    let goTo = ''
    const ws = _getWS([p('0', [p('01'), p('02')])])

    ws.removeCurrent('02', (id) => (goTo = id))
    assert.equal(goTo, '01')

    ws.removeCurrent('01', (id) => (goTo = id))
    assert.equal(goTo, '0')
    assert.equal(_navToStr(ws.state), '[{0}]')

    ws.removeCurrent('0', (id) => (goTo = id))
    assert.equal(goTo, '')
  })

  it('adds new', () => {
    const ws = _getWS([])
    ws.addNew('0')
    assert.equal(_navToStr(ws.state), '[{, }]')
  })
})

const p = (id: str, children?: UPageNodesData): UPageNodeData => ({
  id,
  name: id,
  color: 'red',
  children,
})
