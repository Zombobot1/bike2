import { assert, describe, expect, it, vi } from 'vitest'
import { f, JSObject, num, str } from '../../../../utils/types'
import { UBlock, UBlocks } from '../types'
import {
  getInitialUPageState,
  CRDTParser,
  UPageStateCRDT,
  _base64ToState,
  _mockServer,
  _stateToBase64,
  _stateToStr,
} from './crdtParser'
import { UPageChange, UPageChanges } from './upageChanges'
import { _getUPageState } from './stubs'
import * as Y from 'yjs'
import { fromUint8Array, toUint8Array } from 'js-base64'
import { Bytes } from 'firebase/firestore'
import { applyStrChanges, getStrChanges } from '../changesGeneration/getStrChange'

type Path = Array<str | num>

const b = (data: str): UBlock => ({ id: data, data, type: 'text' })

const ins = (ublocks: UBlock | UBlocks, path: Path = [0]): UPageChange => ({
  t: 'insert',
  path,
  ublocks: Array.isArray(ublocks) ? ublocks : [ublocks],
  blockId: Array.isArray(ublocks) ? ublocks[0].id : ublocks.id,
  preview: Array.isArray(ublocks) ? JSON.stringify(ublocks[0].data, null, 2) : JSON.stringify(ublocks.data, null, 2),
})

const del = (path: Path): UPageChange => ({ t: 'delete', path, preview: '<s></s>' })

const chg = (old: str, new_: str, path: Path, id: str): UPageChange => ({
  t: 'change-str',
  path,
  changes: getStrChanges(old, new_),
  blockId: id,
})

describe('crdtParser', () => {
  it('', f)
  // it('generates initial state', () => {
  //   const parser = new CRDTParser(getInitialUPageState('red'))
  //   assert.equal(parser.state.color, 'red')
  // })
  // it('inserts new ublock', () => {
  //   const parser = new CRDTParser(_getUPageState('empty'))
  //   const state = parser.updateServerState([ins(b('0'))])
  //   assert.equal(_stateToStr(state), '0')
  // })
  // it('inserts new objects', () => {
  //   const parser = new CRDTParser(_getUPageState('empty'))
  //   const change: UPageChanges = [
  //     ins([
  //       { id: '1', type: 'file', data: { name: 'f1', src: '.ru' } },
  //       { id: '2', type: 'file', data: { name: 'f2', src: '.ru' } },
  //     ]),
  //   ]
  //   const state = parser.updateServerState(change)
  //   assert.equal(_stateToStr(state), '{f1, .ru}_{f2, .ru}')
  // })
  // it('inserts new object with arrays', () => {
  //   const parser = new CRDTParser(_getUPageState('empty'))
  //   const change: UPageChanges = [
  //     ins([
  //       {
  //         id: '1',
  //         type: 'multiple-choice',
  //         data: { question: 'q', explanation: 'e', correctAnswer: ['o1'], options: ['o1', 'o2'] },
  //       },
  //     ]),
  //   ]
  //   const state = parser.updateServerState(change)
  //   assert.equal(_stateToStr(state), '{q, e, [o1], [o1, o2]}')
  // })
  // it('inserts new object as array', () => {
  //   const parser = new CRDTParser(_getUPageState('empty'))
  //   const change: UPageChanges = [
  //     ins([
  //       {
  //         id: '1',
  //         type: 'table',
  //         data: [{ width: 1, rows: ['r1'] }],
  //       },
  //     ]),
  //   ]
  //   const state = parser.updateServerState(change)
  //   assert.equal(_stateToStr(state), '[{1, [r1]}]')
  // })
  // it('inserts nested', () => {
  //   const parser = new CRDTParser(_getUPageState('empty'))
  //   const change: UPageChanges = [
  //     ins([
  //       {
  //         id: '1',
  //         type: 'exercise',
  //         data: { name: 'f', ublocks: [b('0')] },
  //       },
  //     ]),
  //   ]
  //   const state = parser.updateServerState(change)
  //   assert.equal(_stateToStr(state), '{f, [0]}')
  // })
  // it('inserts into nested', () => {
  //   const parser = new CRDTParser(_getUPageState('smallExercise'))
  //   const change: UPageChanges = [ins([b('1')], [0, 'ublocks', 1])]
  //   const state = parser.updateServerState(change)
  //   assert.equal(_stateToStr(state), '{f, [0, 1]}')
  // })
  // it('combines changes in one update', () => {
  //   const sendUpdate = vi.fn()
  //   const parser = new CRDTParser(_getUPageState('0_1_2'), sendUpdate)
  //   const changes: UPageChanges = [del([1]), ins(b('3'), [1]), chg('2', 't', [2], '2')]
  //   const state = parser.updateServerState(changes)
  //   assert.equal(_stateToStr(state), '0_3_t')
  //   expect(sendUpdate).toHaveBeenCalledOnce()
  // })
  // it('merges 2 parallel insertions in the beginning', () => {
  //   const { parser1, parser2, server } = init(_getUPageState('empty'))
  //   // insert in the beginning
  //   parser1.updateServerState([ins([b('0'), b('3')])])
  //   parser2.updateServerState([ins([b('1'), b('2')])])
  //   const state = parser1.applyUpdateFromServer(server.updates)
  //   assert.oneOf(_stateToStr(state), ['1_2_0_3', '0_3_1_2']) // random order: possible conflict...
  // })
  // it('merges 2 states', () => {
  //   const { parser1, parser2, server } = init(_getUPageState('1_2_0_3'))
  //   // insert in the middle
  //   parser1.updateServerState([ins(b('4'), [3])])
  //   parser2.updateServerState([ins(b('5'), [1])])
  //   parser2.applyUpdateFromServer(server.updates)
  //   const state1M1 = parser1.applyUpdateFromServer(server.updates)
  //   assert.equal(_stateToStr(state1M1), '1_5_2_0_4_3')
  //   // change
  //   parser1.updateServerState([chg('4', 'f', [4], '4')])
  //   parser2.updateServerState([chg('2', 't', [2], '2')])
  //   const state1M2 = parser1.applyUpdateFromServer(server.updates)
  //   assert.equal(_stateToStr(state1M2), '1_5_t_0_f_3')
  // })
  // it('merges changes in text', () => {
  //   const { parser1, parser2, server } = init(_getUPageState('nice cat'))
  //   parser1.updateServerState([chg('nice cat', 'nice fat cat', [0], '0')])
  //   parser2.updateServerState([chg('nice cat', 'fluffy nice cat', [0], '0'), ins(b('1'), [1])])
  //   const state = parser1.applyUpdateFromServer(server.updates)
  //   assert.equal(_stateToStr(state), 'fluffy nice fat cat_1')
  // })
  // it('updates root', () => {
  //   const parser = new CRDTParser(_getUPageState('empty'))
  //   const change: UPageChanges = [
  //     {
  //       t: 'change-root',
  //       changes: [{ op: 'replace', path: ['name'], value: 'Page' }],
  //     },
  //   ]
  //   const state = parser.updateServerState(change)
  //   assert.equal(state.name, 'Page')
  // })
  // it.only('updates object', () => {
  //   const parser = new CRDTParser(_getUPageState('{f1 .ru}_{f2 .ru}'))
  //   const state = parser.updateServerState([
  //     { t: 'change-object', blockId: '1', changes: [{ op: 'replace', path: [] }] },
  //   ])
  //   assert.equal(_stateToStr(state), '{f1, .ru}_{f3, .ru}')
  // })
  // it('updates str inside array', () => {
  //   const parser = new CRDTParser(_getUPageState('mcqSimple'))
  //   const state = parser.updateServerState([chg('o2', 'o3', [0, 'options', 1], '0')])
  //   assert.equal(_stateToStr(state), '{q, e, [o1], [o1, o3]}')
  // })
  // it('updates object inside top level array', () => {
  //   const parser = new CRDTParser(_getUPageState('tableCell'))
  //   const state = parser.updateServerState([chgO({ width: 1, rows: ['r1'] }, { width: 2 }, [0, 0], '0')])
  //   assert.equal(_stateToStr(state), '[{2, [r1]}]')
  // })
  // it('updates str deep inside', () => {
  //   const parser = new CRDTParser(_getUPageState('tableCell'))
  //   const state = parser.updateServerState([chg('r1', 'r2', [0, 0, 'rows', 0], '0')])
  //   assert.equal(_stateToStr(state), '[{1, [r2]}]')
  // })
  // it('updates nested', () => {
  //   const parser = new CRDTParser(_getUPageState('smallExercise'))
  //   const state = parser.updateServerState([chg('0', '1', [0, 'ublocks', 0, 'data'], '0')])
  //   assert.equal(_stateToStr(state), '{f, [1]}')
  // })
  // it('deletes nested', () => {
  //   const parser = new CRDTParser(_getUPageState('smallExercise'))
  //   const state = parser.updateServerState([del([0, 'ublocks', 0])])
  //   assert.equal(_stateToStr(state), '{f, []}')
  // })
  // it('deletes page', () => {
  //   const parser = new CRDTParser(_getUPageState('empty'))
  //   const state = parser.updateServerState([{ t: 'delete-page' }])
  //   assert.equal(state.isDeleted, true)
  // })
  // it('deletes by path', () => {
  //   const parser = new CRDTParser(_getUPageState('tableCell'))
  //   const state = parser.updateServerState([del([0, 0])])
  //   assert.equal(_stateToStr(state), '[]')
  // })
  // it('changes type with data', () => {
  //   const parser = new CRDTParser(_getUPageState('0_1_2'))
  //   const state = parser.updateServerState([
  //     { t: 'change-type', type: 'callout', data: { type: 'info', text: '1!' }, path: [1] },
  //   ])
  //   assert.equal(_stateToStr(state), '0_{info, 1!}_2')
  // })
  // it('changes type', () => {
  //   const parser = new CRDTParser(_getUPageState('0_1_2'))
  //   const state = parser.updateServerState([{ t: 'change-type', type: 'heading-1', path: [1] }])
  //   assert.equal(state.ublocks[1].type, 'heading-1')
  // })
})

const init = (updates: Bytes[]) => {
  const server = _mockServer(updates)

  const parser1 = new CRDTParser(server.getInitialUpdates(), server.sendUpdate)
  const parser2 = new CRDTParser(server.getInitialUpdates(), server.sendUpdate)

  return { server, parser1, parser2 }
}

// const _generateState = (changes: UPageChanges) => {
//   const init = parseStateFromServer(getInitialUPageState('red'))
//   const base64 = _stateToBase64(updateServerState(init, changes, f))
//   return _base64ToState(base64)
// }

// const _printStates = (...changesAndNames: unknown[]) => {
//   const init = parseStateFromServer(getInitialUPageState('red'))
//   const states = [`const empty = \`${_stateToBase64(init)}\``]
//   for (let i = 0; i < changesAndNames.length; i += 2) {
//     const changes = changesAndNames[i] as UPageChanges
//     const name = changesAndNames[i + 1]
//     const init = parseStateFromServer(getInitialUPageState('red'))
//     const base64 = _stateToBase64(updateServerState(init, changes, f))
//     states.push(`const ${name} = \`${base64}\``)
//   }
//   console.info(states.join('\n'))
// }
