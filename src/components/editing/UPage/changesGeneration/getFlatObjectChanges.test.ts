import { assert, describe, expect, it } from 'vitest'
import { _objectChanger, getObjectChanges, applyObjectChanges } from './getFlatObjectChanges'
import { f, JSObject } from '../../../../utils/types'
import { enablePatches, produceWithPatches } from 'immer'
import diff from 'microdiff'

describe('getFlatObjectChanges', () => {
  it('basic changes', () => {
    const old = { a: 'aa', b: false, c: 'c' }
    const new_ = { a: 'a', c: 'c', d: true }
    applyObjectChanges(
      _objectChanger(old),
      getObjectChanges([], old, [
        { op: 'replace', value: 'a', path: ['a'] },
        { op: 'add', value: true, path: ['d'] },
        { op: 'remove', path: ['b'] },
      ]),
    )
    assert.deepEqual(old, new_ as JSObject)
  })

  it('creates new', () => {
    const old: JSObject = {}
    const new_ = { a: 'abc0123456789', d: 2 }
    applyObjectChanges(
      _objectChanger(old),
      getObjectChanges([], old, [
        { op: 'add', value: 2, path: ['d'] },
        { op: 'add', value: 'abc0123456789', path: ['a'] },
      ]),
    )
    assert.deepEqual(old, new_)
  })

  it('creates | deletes complex new', () => {
    const old: JSObject = {}
    const new_ = { a: 0, d: [{ e: ['1', '2'] }] }
    applyObjectChanges(
      _objectChanger(old),
      getObjectChanges([], old, [
        { op: 'add', value: 0, path: ['a'] },
        { op: 'add', value: [{ e: ['1', '2'] }], path: ['d'] },
      ]),
    )
    assert.deepEqual(old, new_)

    const new2 = {}
    applyObjectChanges(
      _objectChanger(new_),
      getObjectChanges([], new_, [
        { op: 'remove', path: ['a'] },
        { op: 'remove', path: ['d'] },
      ]),
    )
    assert.deepEqual(new_, new2)
  })

  it.only('inserts | deletes in arrays', () => {
    // const old = ['0', [{ e: ['1', '2'] }]] as JSObject
    // enablePatches()
    // const [next, pathes] = produceWithPatches(old, (d) => {
    // d.splice(1, 0, '3')
    // d[2][0].e.splice(1, 0, '4')
    // })
    // console.log(diff([{ e: ['1', '2'] }], [{ e: ['1', '4', '2'] }]))
    // const new_ = ['0', '3', [{ e: ['1', '4', '2'] }]]
    // applyObjectChanges(
    //   _objectChanger(old),
    //   getObjectChanges([], old, [
    //     { op: 'add', path: [1], value: '3' },
    //     { op: 'add', path: [1, 0, 'e', 1], value: '4' },
    //   ]),
    // )
    // assert.deepEqual(old, new_)
    // const new2 = ['3', [{ e: ['4', '2'] }]]
    // applyObjectChanges(_objectChanger(new_), getObjectChanges(new_, new2))
    // assert.deepEqual(new_, new2)
  })

  // it('creates new with preview', () => {
  //   const old: JSObject = {}
  //   const new_ = { a: 'abc0123456789', d: 2 }
  //   const changes = getFlatObjectChanges(old, new_)
  //   assert.equal(changes.preview, '<em>abc01234...</em>')
  // })

  // it('creates preview', () => {
  //   const old = { a: 'a', b: 12, c: 'bd' }
  //   const new_ = { a: 'ac', b: 13, c: 'b', e: 'e' }
  //   assert.equal(getFlatObjectChanges(old, new_).preview, 'a<em>c</em>\n\nb<s>d</s>\n\n<em>e</em>')
  // })
})
