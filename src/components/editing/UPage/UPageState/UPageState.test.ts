import { assert, describe, expect, it, vi } from 'vitest'
import { f, JSObject } from '../../../../utils/types'
import { UFormData, UListData } from '../ublockTypes'
import { _previewToStr } from './crdtParser/previewGeneration'
import { _generators, _stateToStr } from './crdtParser/_fakeUPage'
import { UPageState, _generateTestUPage, _upageS } from './UPageState'

describe('UPageState', () => {
  it('on factory change (adds initial block)', () => {
    const { page } = _upageS('')
    page.onFactoryChange('1', 'text')
    assert.equal(_stateToStr(page.state.data), '1')
  })

  it('adds image block | selects it | gives preview for it', () => {
    const { preview, addImage, page } = _upageS('0', { addImage: vi.fn() })

    page.onUTextPaste('blob:', '0', 'image')
    assert.equal(page.state.cursor.selected.length, 1)
    assert.equal(page.state.cursor.focus, undefined)

    assert.equal(_stateToStr(page.state.data), '0_{}')
    expect(addImage).toBeCalledWith('1', 'blob:')
    assert.equal(_previewToStr(preview()), '<b>Added image</b>')

    page.change('1', { src: 'img.de', width: 900 })
    assert.equal(_previewToStr(preview()), '<s>"</s><em>img.de","width":900</em>')
  })

  it('focus moves from factory | selects several blocks when they are added | gives preview for them', () => {
    const { page, preview } = _upageS('0')
    page.onFactoryChange('f', 'text')

    assert.deepEqual(page.state.cursor.focus, { fresh: true, id: '1', type: 'end' })

    page.onUTextPaste('1\n\n2', '1')
    assert.equal(_stateToStr(page.state.data), '0_f_1_2')
    assert.equal(_previewToStr(preview()), '<em>1</em><br></br><em>2</em>')

    assert.equal(page.state.cursor.selected.length, 2)
    assert.equal(page.state.cursor.focus, undefined)
  })

  it('changes text', () => {
    const { page } = _upageS('nice cat')
    page.change('nice cat', 'nice ')
    assert.equal(_stateToStr(page.state.data), 'nice ')
  })

  it('changes callout', () => {
    const { page } = _upageS('')
    page.add('', 'callout')
    page.change('1', { type: 'info', text: 'cute cat' })
    assert.equal(_stateToStr(page.state.data), '{cute cat, info}')
  })

  it('changes only required blocks', () => {
    const { page } = _upageS('0_1_2')

    const before = [page.state.data.ublocks[0], page.state.data.ublocks[2]]
    page.onUTextEnter('1', '', '1')
    const after = [page.state.data.ublocks[0], page.state.data.ublocks[3]]

    assert.equal(_stateToStr(page.state.data), '0_1__2')
    assert.equal(before[0], after[0])
    assert.equal(before[1], after[1])
  })

  it('preserves runtime state on UPageCR change', () => {
    const { page } = _upageS('mcqSimple')

    page.change('mcq', { $error: 'ERROR!' })
    assert.equal(_stateToStr(page.state.data), '{q, e, [o1, o2], [o1], ERROR!}')
    page.change('mcq', { question: 'qq' })
    assert.equal(_stateToStr(page.state.data), '{qq, e, [o1, o2], [o1], ERROR!}')
    page.undo()
    assert.equal(_stateToStr(page.state.data), '{q, e, [o1, o2], [o1], ERROR!}')
  })

  it('separates utext', () => {
    const { page } = _upageS('nice cat')
    page.onUTextEnter('nice', 'cat', 'nice cat') // suppose that ' ' was removed while editing
    assert.deepEqual(page.state.cursor.focus, { id: '1', type: 'start' })
    assert.equal(_stateToStr(page.state.data), 'nice_cat')
  })

  it('adds block', () => {
    const { preview, page } = _upageS('0')

    page.add('0', 'callout')
    assert.deepEqual(page.state.cursor.focus, { id: '1', type: 'start' })
    assert.equal(_stateToStr(page.state.data), '0_{, info}')
    assert.equal(_previewToStr(preview()), '<b>Added callout</b>')
  })

  it('separates callout', () => {
    const { page } = _upageS('callout')
    page.onUTextEnter('cute', 'cat', 'callout')
    assert.equal(_stateToStr(page.state.data), '{cute, info}_cat')
  })

  it('changes type', () => {
    const { page } = _upageS('0')

    page.changeType('0', 'heading-1', '1') // change data
    assert.equal(page.state.data.ublocks[0].type, 'heading-1')
    assert.equal(page.state.data.ublocks[0].data, '1')

    page.changeType('0', 'code')
    assert.equal(page.state.data.ublocks[0].type, 'code')
    assert.equal((page.state.data.ublocks[0].data as JSObject).text, '1')

    page.changeType('0', 'callout')
    assert.equal(page.state.data.ublocks[0].type, 'callout')
    assert.equal((page.state.data.ublocks[0].data as JSObject).text, '1')

    page.changeType('0', 'text', '0') // change data again
    assert.equal(page.state.data.ublocks[0].type, 'text')
    assert.equal(page.state.data.ublocks[0].data, '0')
  })

  it('opens page when block turned into it', () => {
    const { page, onPageAdded } = _upageS('0_1_2', { onPageAdded: vi.fn(), id: 5 })
    page.changeType('0', 'page')
    expect(onPageAdded).toBeCalledWith('5', '')

    page.changeType('1', 'page')
    expect(onPageAdded).toBeCalledWith('6', '5')
  })

  it('opens page when it is added', () => {
    const { page, onPageAdded } = _upageS('', { onPageAdded: vi.fn() })
    page.add('', 'page')
    expect(onPageAdded).toBeCalledWith('2', '')
  })

  it('triggers flags', () => {
    const { page } = _upageS('')
    page.triggerFullWidth()
    assert.equal(page.state.data.fullWidth, true)
    page.triggerFullWidth()
    assert.equal(page.state.data.fullWidth, false)
    page.triggerTurnOffTOC()
    assert.equal(page.state.data.turnOffTOC, true)
  })

  it('selects blocks | deletes pages', () => {
    const { page, onPagesDeleted } = _upageS('', { onPagesDeleted: vi.fn() })
    page.add('', 'page')

    page.select('1')
    assert.equal(page.state.cursor.selected[0], '1')
    assert.equal(_stateToStr(page.state.data), '{2}')

    page.deleteSelected()
    assert.equal(_stateToStr(page.state.data), '')
    assert.equal(page.state.cursor.selected.length, 0)
    expect(onPagesDeleted).toBeCalledWith(['2'], { moveTo: '' })
  })

  it('deletes file on undo', () => {
    const { page, deleteFiles } = _upageS('', { deleteFiles: vi.fn() })
    page.add('', 'audio')
    page.change('1', { src: 's' })
    page.undo()
    expect(deleteFiles).toBeCalledWith(
      [
        {
          blockId: '1',
          src: 's',
        },
      ],
      'pageId',
    )
  })

  it('provides deleted block preview', () => {
    const { page, preview } = _upageS('callout')
    page.select('callout')
    page.deleteSelected()
    assert.equal(_previewToStr(preview()), '<s>cute cat</s>')
  })

  it('merges data when text is deleted', () => {
    const { page } = _upageS('0_1_2')
    page.onUTextBackspace('1', '1')
    assert.equal(_stateToStr(page.state.data), '01_2')
    assert.deepEqual(page.state.cursor.focus, { id: '0', xOffset: 1, type: 'end-integer' })

    page.onUTextBackspace('2', '')
    assert.equal(_stateToStr(page.state.data), '01')
    assert.deepEqual(page.state.cursor.focus, { id: '0', type: 'end' })
  })

  it('merges text data with callout on deletion', () => {
    const { page } = _upageS('0_1_2')
    page.changeType('1', 'callout')
    page.onUTextBackspace('2', '2')
    assert.equal(_stateToStr(page.state.data), '0_{12, info}')
  })

  it('skips not utext blocks when merging data on deletion', () => {
    const { page } = _upageS('0_1_2')
    page.changeType('1', 'block-equation')
    page.onUTextBackspace('2', '2')
    assert.equal(_stateToStr(page.state.data), '02_1')
  })

  it('starts drag | creates grid on the right | creates column', () => {
    const { page } = _upageS('')
    page.onUTextPaste('cat\n\n2\n\n3\n\n4\n\n5', '') // cat instead of 1
    assert.equal(_stateToStr(page.state.data), 'cat_2_3_4_5')

    page.unselect()
    page.select('4')
    page.select('5')

    page.onDragStart()
    assert.deepEqual(page.state.cursor.selected, ['4', '5'])
    assert.equal(page.state.cursor.isDragging, true)

    page.createUGrid('2', 'right')
    assert.equal(_stateToStr(page.state.data), 'cat_[{[2], 50%}, {[4, 5], 50%}]_3')
    page.onDragEnd()

    page.unselect()
    page.select('3')
    page.onDragStart()
    page.createUGrid('2', 'right')

    assert.equal(_stateToStr(page.state.data), `cat_[{[2], ${tt}%}, {[3], ${tt}%}, {[4, 5], ${tt}%}]`)
    page.onDragEnd()
    page.unselect()

    page.select('3')
    page.onDragStart()
    page.createUGrid('2', 'left')
    assert.equal(_stateToStr(page.state.data), `cat_[{[3], ${tt}%}, {[2], ${tt}%}, {[4, 5], ${tt}%}]`)
  })

  it('creates list', () => {
    const { page } = _upageS('0')
    page.changeType('0', 'bullet-list', 'o')
    assert.equal(_stateToStr(page.state.data), '[{o}]')
  })

  it('merges to list above', () => {
    const { page } = _upageS('* 0_1')
    page.changeType('1', 'bullet-list', 'o')
    assert.equal(_stateToStr(page.state.data), '[{0}, {o}]')
  })

  it('merges to list above and below', () => {
    const { page } = _upageS('* 0_1_* 2')
    page.changeType('1', 'bullet-list', 'o')
    assert.equal(_stateToStr(page.state.data), '[{0}, {o}, {2}]')
  })

  it('merges to list below', () => {
    const { page } = _upageS('0_* 1')
    page.changeType('0', 'bullet-list', 'z')
    assert.equal(_stateToStr(page.state.data), '[{z}, {1}]')
  })

  it('moves left * 0 * 1 11', () => {
    const { page } = _upageS('{* 0 [01, 02] * 1 [11]}')
    page.onUTextBackspace('11', '11')
    assert.equal(_stateToStr(page.state.data), '[{0, [{01}, {02}]}, {1, [{11, true}]}]')

    page.onUTextBackspace('11', '11')
    assert.equal(_stateToStr(page.state.data), '[{0, [{01}, {02}]}, {1}]_11')
  })

  it('opens toggle on move right', () => {
    const { page } = _upageS('>0 >1', { id: 2 })
    page.onUTextEnter('0', 't', '0')
    assert.equal(_stateToStr(page.state.data), '[{0}, {t}, {1}]') // prepare

    page.onUTextTab('2', 't')
    const data = page.state.data.ublocks[0].data as UListData
    assert.equal(data[0].$isOpen, true)

    page.triggerUListOpen('0')
    const data2 = page.state.data.ublocks[0].data as UListData
    assert.equal(data2[0].$isOpen, false)
  })

  it('handles uform event', () => {
    const { page } = _upageS('{e, [{q, [o1, o2]}]}')
    page.change('mcq', { $answer: ['o1'] })

    page.handleUFormEvent('e', 'submit')

    const data = page.state.data.ublocks[0].data as UFormData
    assert.equal(data.$score, 100)
  })

  it('marks focus as fresh when factory creates a block', () => {
    const { page } = _upageS('')
    page.onFactoryChange('/', 'text')
    assert.equal(page.state.cursor.focus?.fresh, true)
  })

  it('keeps focus in factory on enter', () => {
    const { page } = _upageS('')
    page.onFactoryEnter()
    assert.equal(page.state.cursor.focus?.id, 'factory')
  })

  it('generates test state', () => {
    const bytes1 = _generateTestUPage({ ublocks: [b('1'), e([b('2')])] })
    const page1 = new UPageState('', bytes1, f, f, () => '')
    assert.equal(_stateToStr(page1.state.data), '1_{e, [2]}')

    const bytes2 = _generateTestUPage({ ublocks: [list('>', l('0', [l('01')]))] })
    const page2 = new UPageState('', bytes2, f, f, () => '')
    assert.equal(_stateToStr(page2.state.data), '[{0, [{01}]}]')
  })

  // it.only('get bytes size of a big page', () => {
  //   _measureLongStubSize()
  // })
})

const { b, e, list, l } = _generators

const tt = '33.33333333333333'
