import { assert, describe, it, vi } from 'vitest'
import { bool, str, strs } from '../../../../../utils/types'
import { UBlock, UBlockData, UBlocks, UBlockType, UFormData, UTableData } from '../../ublockTypes'
import { getInitialUPageState, UPageChange, _getUPSCR, _mockServer } from './UPageStateCR'
import { _getUPageState } from './_stubs'
import { Bytes } from 'firebase/firestore'
import { _stateToStr } from './_fakeUPage'
import { getSha } from '../../../../../utils/wrappers/shaUtils'
import { setUserId } from '../../userId'
import { safe } from '../../../../../utils/utils'

vi.mock('../../../../../utils/wrappers/timeUtils', () => {
  return {
    now: () => 16e8,
  }
})
describe('UPageStateCR', () => {
  it('generates initial state', () => {
    const parser = _getUPSCR(getInitialUPageState())
    assert.equal(parser.state.ublocks.length, 0)
  })

  describe('insertion', () => {
    it('inserts new ublock | changes it', () => {
      const parser = _getUPSCR(_getUPageState(''))
      const b0 = b('0')
      parser.change(ins(b0, chgR(b0)))
      assert.equal(_stateToStr(parser.state), '0')

      parser.change(chg('0', 'o'))
      assert.equal(_stateToStr(parser.state), 'o')
    })

    it('inserts new object with arrays', () => {
      const parser = _getUPSCR(_getUPageState(''))
      const bq = b(
        'q',
        { question: 'q', explanation: 'e', correctAnswer: [], options: ['o1', 'o2'] },
        'multiple-choice',
      )
      const change = ins(bq, chgR(bq))
      parser.change(change)
      assert.equal(_stateToStr(parser.state), '{q, e, [], [o1, o2]}')
    })

    it('inserts new object as array', () => {
      const parser = _getUPSCR(_getUPageState(''))
      const t = b('t', [{ width: 1, rows: ['r1'] }], 'table')
      parser.change(ins(t, chgR(t)))
      assert.equal(_stateToStr(parser.state), '[{1, [r1]}]')
    })

    it('inserts nested', () => {
      const parser = _getUPSCR(_getUPageState(''))

      const form: UFormData = { name: 'e', ublocks: [] }
      const e = b('e', form, 'exercise')
      parser.change(ins(e, chgR(e)))

      const b0 = b('0')
      form.ublocks.push(b0)
      parser.change(ins(b0, chg('e', form)))

      assert.equal(_stateToStr(parser.state), '{e, [0]}')
    })

    it('inserts into nested', () => {
      const parser = _getUPSCR(_getUPageState('eb0'))
      assert.equal(_stateToStr(parser.state), '{e, [0]}')
      const b1 = b('1')
      const change = ins(b1, chg('e', { name: 'e', ublocks: [b('0'), b1] }))
      parser.change(change)
      assert.equal(_stateToStr(parser.state), '{e, [0, 1]}')
    })
  })

  describe('merge two CR', () => {
    it('merges 2 parallel insertions in the beginning', () => {
      const { parser1, parser2, server } = init(_getUPageState(''))
      // insert in the beginning
      const b0 = b('0')
      const b3 = b('3')
      parser1.change(ins([b0, b3], chgR([b0, b3])))
      assert.equal(_stateToStr(parser1.state), '0_3')

      const b1 = b('1')
      const b2 = b('2')
      parser2.change(ins([b('1'), b('2')], chgR([b1, b2])))
      const state = parser1.applyUpdate(server.updates)
      assert.oneOf(_stateToStr(safe(state)), ['1_2_0_3', '0_3_1_2']) // random order: possible conflict...
    })

    it('merges 2 parallel insertions in the uform beginning', () => {
      const { parser1, parser2, server } = init(_getUPageState(''))
      const formData: UFormData = { name: 'e', ublocks: [] }
      const e = b('e', formData, 'exercise')
      parser1.change(ins(e, chgR(e)))
      parser2.applyUpdate(server.updates)

      const b0 = b('0')
      formData.ublocks = [b0]
      parser1.change(ins(b0, chg('e', formData)))
      const b1 = b('1')
      formData.ublocks = [b1]
      parser2.change(ins(b1, chg('e', formData)))

      const state = parser1.applyUpdate(server.updates)
      assert.oneOf(_stateToStr(safe(state)), ['{e, [0, 1]}', '{e, [1, 0]}']) // random order: possible conflict...
    })

    it('merges 2 parallel changes in inline exercise', () => {
      const { parser1, parser2, server } = init(_getUPageState(''))
      const ie = b('ie', { content: [] }, 'inline-exercise')
      parser1.change(ins(ie, chgR(ie)))
      parser2.applyUpdate(server.updates)

      parser1.change(chg('ie', { content: ['0'] }))
      parser2.change(chg('ie', { content: ['1'] }))

      const state = parser1.applyUpdate(server.updates)
      assert.oneOf(_stateToStr(safe(state)), ['{[0, 1]}', '{[1, 0]}'])
    })

    it('merges 2 states', () => {
      const { parser1, parser2, server } = init(_getUPageState('1_2_0_3'))

      // insert in the middle
      parser1.change(ins(b('4'), chgR([b('1'), b('2'), b('0'), b('4'), b('3')]))) // technically its not intended usage because all these blocks aren't connected referentially
      parser2.change(ins(b('5'), chgR([b('1'), b('5'), b('2'), b('0'), b('3')]))) // it works because id & data matches
      parser2.applyUpdate(server.updates)
      const state1M1 = parser1.applyUpdate(server.updates)
      assert.equal(_stateToStr(safe(state1M1)), '1_5_2_0_4_3')

      // change
      parser1.change(chg('4', 'f'))
      parser2.change(chg('2', 't'))
      const state1M2 = parser1.applyUpdate(server.updates)
      assert.equal(_stateToStr(safe(state1M2)), '1_5_t_0_f_3')
    })

    it('merges changes in text', () => {
      const { parser1, parser2, server } = init(_getUPageState('nice cat'))
      parser1.change(chg('nice cat', 'nice fat cat'))

      parser2.change(chg('nice cat', 'fluffy nice cat'))

      const data = parser2.state // append b1
      const b1 = b('1')
      data.ublocks.push(b1)
      parser2.change(ins(b1, chgR(data.ublocks)))

      const state = parser1.applyUpdate(server.updates)
      assert.equal(_stateToStr(safe(state)), 'fluffy nice fat cat_1')
    })
  })

  describe('update', () => {
    it('provides preview for change', () => {
      setUserId('u1')
      const { parser1, server } = init(_getUPageState('0'))

      parser1.change(chg('0', '1', undefined, true))

      assert.deepEqual(server.descriptions[0], {
        upageId: 'id',
        block: '0',
        date: 1600000000,
        preview: [
          {
            data: '0',
            tag: 2,
          },
          {
            data: '1',
            tag: 1,
          },
        ],
        sha: server.descriptions[0].sha, // they are random somehow
        user: 'u1',
      })
    })

    it('updates object', () => {
      const parser = _getUPSCR(_getUPageState('{f1 .ru}_{f2 .ru}'))
      parser.change(chg('f2', { name: 'f3', src: '.ru' }))
      assert.equal(_stateToStr(parser.state), '{f1, .ru}_{f3, .ru}')
    })

    it('updates object inside top level array', () => {
      const parser = _getUPSCR(_getUPageState('tableCell'))
      const tableCell: UTableData = [{ width: 1, rows: [] }]
      parser.change(chg('tc', tableCell))
      assert.equal(_stateToStr(parser.state), '[{1, []}]')
    })

    it('deletes nested', () => {
      const parser = _getUPSCR(_getUPageState('eb0'))
      parser.change(del(['0'], chg('e', { name: 'e', ublocks: [] })))
      assert.equal(_stateToStr(parser.state), '{e, []}')
    })

    it('changes type with data', () => {
      const parser = _getUPSCR(_getUPageState('0_1_2'))
      parser.change({
        changes: [{ t: 'change-type', id: '1', type: 'callout', data: { type: 'info', text: 'i' } }],
        preview: [],
      })
      assert.equal(_stateToStr(parser.state), '0_{info, i}_2')
    })

    it('does not serialize updates of runtime fields', () => {
      const { server, parser1 } = init(_getUPageState('mcqSimple'))
      parser1.change({
        changes: [
          {
            t: 'change',
            id: 'mcq',
            data: {
              question: 'q',
              explanation: 'e',
              options: ['o1', 'o2'],
              correctAnswer: ['o1'],
              $answer: ['o2'],
              $submitted: true,
            },
          },
        ],
        preview: [],
      })
      assert.equal(_stateToStr(parser1.state), '{q, e, [o1, o2], [o1]}')
      assert.equal(server.updates.length, 0)
    })
  })

  describe('undo / rollback', () => {
    it('basic undo & redo', () => {
      {
        const server = _mockServer(_getUPageState(''))
        const parser = _getUPSCR(server.getInitialUpdates(), server.sendUpdate)
        parser.change(ins(b('0'), chgR(b('0'))))
        parser.change(ins(b('1'), chgR([b('0'), b('1')])))
        assert.equal(_stateToStr(parser.state), '0_1')

        const s2 = parser.undo()
        assert.equal(_stateToStr(s2), '0')

        const s3 = parser.redo()
        assert.equal(_stateToStr(s3), '0_1')

        assert.equal(server.updates.length, 4)
      }

      {
        const parser = _getUPSCR(_getUPageState('0_1_2'))
        parser.change(chg('0', 'z'))
        parser.change(chg('2', 't'))
        assert.equal(_stateToStr(parser.state), 'z_1_t')

        const s3 = parser.undo()
        assert.equal(_stateToStr(s3), 'z_1_2')

        const s4 = parser.undo()
        assert.equal(_stateToStr(s4), '0_1_2')

        const s5 = parser.redo()
        assert.equal(_stateToStr(s5), 'z_1_2')

        const s6 = parser.redo()
        assert.equal(_stateToStr(s6), 'z_1_t')
      }
    })

    it('does not send update when there is nothing to undo / redo', () => {
      const server = _mockServer([])
      const parser = _getUPSCR(_getUPageState(''), server.sendUpdate)

      parser.undo()
      parser.redo()

      assert.equal(server.updates.length, 0)
    })

    it('rolls back updates', () => {
      const initialState = _getUPageState('0_1_2')
      const initialStateSha = getSha(initialState[0].toUint8Array())
      const { parser1, server } = init(initialState)

      parser1.change(chg('0', 'z'))
      parser1.change(chg('2', 't'))
      assert.equal(_stateToStr(parser1.state), 'z_1_t')

      const s2 = parser1.rollBackTo(initialStateSha)
      assert.equal(_stateToStr(s2), '0_1_2')

      assert.equal(server.deletedShas.length, 2)
    })
  })

  // it.only('s', () => {
  //   const $ = (o: JSObject) => JSON.stringify(o, (_, v) => (Array.isArray(v) ? [D, ...v] : v))
  //   // all arrays must have D
  //   const f1: UFileData = { name: 'f1', src: '.ru' }
  //   const f2: UFileData = { name: 'f2', src: '.ru' }
  //   const mcqSimple: UChecksData = {
  //     question: 'q',
  //     explanation: 'e',
  //     options: ['o1', 'o2'],
  //     correctAnswer: ['o1'],
  //   }
  //   const tableCell: UTableData = [{ width: 0, rows: ['r1'] }]
  //   const callout: CalloutData = { text: 'cute cat', type: 'info' }
  //   _printStates(
  //     'simpleE',
  //     ['zero', ['0']],
  //     ['z_1_2', ['0', '1', '2']],
  //     ['one_2_0_3', ['1', '2', '0', '3']],
  //     ['niceCat', ['nice cat']],
  //     ['callout', [['callout', $(callout), 'callout']]],
  //     [
  //       'twoFiles',
  //       [
  //         ['f1', $(f1), 'file'],
  //         ['f2', $(f2), 'file'],
  //       ],
  //     ],
  //     ['mcqSimple', [['mcq', $(mcqSimple), 'multiple-choice']]],
  //     ['tableCell', [['tc', $(tableCell), 'table']]],
  //     ['eb0', [['e', $({ name: 'e', ublocks: ['0'] }), 'exercise'], '-0']],
  //     [
  //       'simpleE',
  //       [
  //         ['e', $({ name: 'e', ublocks: ['mcq'] }), 'exercise'],
  //         ['-mcq', $(mcqSimple), 'multiple-choice'],
  //       ],
  //     ],
  //     ['bl0_1', [['* 0', $([{ ublock: '0' }]), 'bullet-list'], '-0', '1']],
  //     ['tl01', [['> 0', $([{ ublock: '0' }, { ublock: '1' }]), 'toggle-list'], '-0', '-1']],
  //     [
  //       'bl0_1_bl2',
  //       [['* 0', $([{ ublock: '0' }]), 'bullet-list'], '-0', '1', ['* 2', $([{ ublock: '2' }]), 'bullet-list'], '-2'],
  //     ],
  //     ['z_bl1', ['0', ['* 1', $([{ ublock: '1' }]), 'bullet-list'], '-1']],
  //     [
  //       'simpleList',
  //       [
  //         [
  //           'l',
  //           $([
  //             { ublock: '0', children: [{ ublock: '01' }, { ublock: '02' }] },
  //             { ublock: '1', children: [{ ublock: '11' }] },
  //           ]),
  //           'bullet-list',
  //         ],
  //         '-0',
  //         '-1',
  //         '-01',
  //         '-02',
  //         '-11',
  //       ],
  //     ],
  //   )
  // })
})

const init = (updates: Bytes[]) => {
  const server = _mockServer(updates)

  const parser1 = _getUPSCR(server.getInitialUpdates(), server.sendUpdate, server.deleteUPageChanges)
  const parser2 = _getUPSCR(server.getInitialUpdates(), server.sendUpdate, server.deleteUPageChanges)

  return { server, parser1, parser2 }
}

const b = (id: str, data?: UBlockData, type: UBlockType = 'text'): UBlock => ({ id, data: data || id, type })
// const r = (ublocks: UBlocks | UBlock) => ({ ublocks: Array.isArray(ublocks) ? ublocks : [ublocks] })
const ins = (ublocks: UBlock | UBlocks, next?: UPageChange): UPageChange => ({
  changes: [{ t: 'insert', ublocks: Array.isArray(ublocks) ? ublocks : [ublocks] }, ...(next?.changes || [])],
  preview: [],
})

const del = (ids: strs, next?: UPageChange): UPageChange => ({
  changes: [{ t: 'delete', ids }, ...(next?.changes || [])],
  preview: [],
})

const chg = (id: str, data: UBlockData, next?: UPageChange, addPreview?: bool): UPageChange => ({
  changes: [{ t: 'change', id, data, addPreview }, ...(next?.changes || [])],
  preview: [],
  blockId: id,
})

const chgR = (ublocks: UBlocks | UBlock): UPageChange => ({
  changes: [{ t: 'change', id: 'r', data: { ublocks: Array.isArray(ublocks) ? ublocks : [ublocks] } }],
  preview: [],
})

//  it.only('s', () => {
//   const updates = [] as Uint8Array[]

//   const update = (d: Y.Doc) => {
//     const update = Y.mergeUpdatesV2(updates)
//     Y.applyUpdateV2(d, update)
//     return d
//   }

//   const d1 = new Y.Doc()
//   d1.on('updateV2', (u: Uint8Array) => updates.push(u))

//   const t1 = d1.getText('t')
//   t1.insert(0, '[","]')

//   const d2 = update(new Y.Doc())
//   d2.on('updateV2', (u: Uint8Array) => updates.push(u))

//   const t2 = d2.getText('t')

//   t1.insert(4, ',"1"')
//   t2.insert(4, ',"2"')

//   update(d1)
//   update(d2)

//   assert.oneOf(t1.toJSON(), ['[",","1","2"]', '[",","2","1"]'])
// })
