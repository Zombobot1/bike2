import { Bytes } from 'firebase/firestore'
import { assert, describe, vi, it, expect } from 'vitest'
import * as Y from 'yjs'
import { removeAt, reverse } from '../../../../utils/algorithms'
import { getSha } from '../../../../utils/wrappers/shaUtils'
import { now } from '../../../../utils/wrappers/timeUtils'
import { f, JSObject, str, strs } from '../../../../utils/types'
import { safe } from '../../../../utils/utils'
import { setUserId } from '../userId'
import { UndoManager } from './undoManager'
import { describeChanges } from './upageChanges'

describe('undoManager', () => {
  it('basic undo & redo', () => {
    const d = new Y.Doc()
    const t = d.getText('t')
    t.insert(0, '1')

    const manager = new UndoManager([Y.encodeStateAsUpdateV2(d)])
    d.on('updateV2', (update: Uint8Array) => manager.addChange(update, getSha(update)))

    t.insert(1, '2')
    t.insert(2, '3')

    assert.equal(manager.undo().getText('t').toJSON(), '12')
    assert.equal(manager.undo().getText('t').toJSON(), '1')

    assert.equal(manager.redo().getText('t').toJSON(), '12')
    assert.equal(manager.redo().getText('t').toJSON(), '123')
  })

  it('forbids redo after change | deletes undone changes on new change', () => {
    let deletedShas = [] as strs

    const recordedShas = [] as strs
    const d = new Y.Doc()
    const t = d.getText('t')
    t.insert(0, '1')

    const manager = new UndoManager([Y.encodeStateAsUpdateV2(d)], (_, shas) => (deletedShas = shas))
    d.on('updateV2', (update: Uint8Array) => {
      const sha = getSha(update)
      recordedShas.push(sha)
      manager.addChange(update, sha)
    })

    t.insert(1, '2')
    t.insert(2, '3')

    const newD = manager.undo()

    assert.equal(deletedShas.length, 0) // no deletion happened

    const newT = newD.getText('t')
    newD.on('updateV2', (update: Uint8Array) => manager.addChange(update, getSha(update)))

    assert.equal(newT.toJSON(), '12')

    newT.insert(3, '4')

    assert.equal(manager.redo().getText('t').toJSON(), '124')
    assert.deepEqual(deletedShas, [recordedShas[recordedShas.length - 1]])
  })

  it('handles empty changes', () => {
    const d = new Y.Doc()
    const t = d.getText('t')
    t.insert(0, '1')

    const manager = new UndoManager([Y.encodeStateAsUpdateV2(d)])
    assert.equal(manager.undo().getText('t').toJSON(), '1')
    assert.equal(manager.redo().getText('t').toJSON(), '1')
  })

  it('operates only on local changes', () => {
    const dLocal = new Y.Doc()
    const a = dLocal.getArray('a')
    a.insert(0, [new Y.Text('1')])

    const updates = [Y.encodeStateAsUpdateV2(dLocal)]

    const manager = new UndoManager([Y.encodeStateAsUpdateV2(dLocal)])
    dLocal.on('updateV2', (update: Uint8Array) => {
      updates.push(update)
      manager.addChange(update, getSha(update))
    })

    const t = dLocal.getArray('a').get(0) as Y.Text
    t.insert(1, '2')
    t.insert(2, '3')

    const update = Y.encodeStateAsUpdateV2(dLocal)
    const d2 = new Y.Doc()
    Y.applyUpdateV2(d2, update)

    d2.on('updateV2', (update: Uint8Array) => updates.push(update))
    d2.getArray('a').insert(1, [new Y.Text('4')])

    // Y.applyUpdateV2(new Y.Doc(), Y.mergeUpdatesV2(removeAt(updates, 2))) // ['12', '4']

    manager.updateLocal(updates)
    assert.deepEqual(manager.undo().getArray('a').toJSON(), ['12', '4'])
    assert.deepEqual(manager.redo().getArray('a').toJSON(), ['123', '4'])
  })

  it('rolls back | deletes rolled changes', () => {
    let deletedShas = [] as strs

    const recordedShas = [] as strs
    const d = new Y.Doc()
    const t = d.getText('t')
    t.insert(0, '1')

    const updates = [Y.encodeStateAsUpdateV2(d)]

    const manager = new UndoManager([Y.encodeStateAsUpdateV2(d)], (_, shas) => (deletedShas = shas))
    d.on('updateV2', (update: Uint8Array) => {
      const sha = getSha(update)
      recordedShas.push(sha)
      manager.addChange(update, sha)
    })

    t.insert(1, '2')
    t.insert(2, '3')
    t.insert(3, '4')

    assert.deepEqual(manager.undo().getText('t').toJSON(), '123')
    assert.deepEqual(manager.rollBackTo(getSha(updates[0])).getText('t').toJSON(), '1')

    assert.deepEqual(deletedShas, reverse(recordedShas))
  })
})
