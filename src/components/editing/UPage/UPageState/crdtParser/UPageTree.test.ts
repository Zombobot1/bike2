import { assert, describe, vi, it, expect } from 'vitest'
import { f } from '../../../../../utils/types'
import { uuidS } from '../../../../../utils/wrappers/uuid'
import { UBlocks, UPageBlockData } from '../../ublockTypes'
import { bfsUBlocks, OnPagesDeleted, UPageTree } from './UPageTree'
import { _generators, _stateToStr } from './_fakeUPage'
import { DeleteFiles } from '../../../UFile/FileUploader'

describe('UPageTree', () => {
  describe('insertion', () => {
    it('inserts in empty form', () => {
      const tree = _getTree(e())
      tree.onUTextPaste('', 'e', '0\n\n1', 'text', f)
      assert.equal(_treeToStr(tree), '{e, [0, 1]}')
    })

    it('inserts in not-empty form', () => {
      const tree = _getTree(e([b('0')]))
      tree.onUTextPaste('0', 'e', '1\n\n2', 'text', f)
      assert.equal(_treeToStr(tree), '{e, [0, 1, 2]}')
    })

    it('inserts in grid', () => {
      const tree = _getTree(g([b('00')], [b('01'), b('11')]))
      tree.onUTextPaste('01', 'g', '1\n\n2', 'text', f)
      assert.equal(_treeToStr(tree), '[{, [00]}, {, [01, 1, 2, 11]}]') // {, - because width is ''
    })

    it('inserts in list', () => {
      const tree = _getTree(lr(l('0'), l('1', [l('10')])))
      tree.onUTextPaste('10', 'l', '11\n\n12', 'text', f)
      assert.equal(_treeToStr(tree), '[{0}, {1, [{10}, {11}, {12}]}]')
    })

    it('adds empty block', () => {
      const tree = _getTree(b('0'))
      tree.onUTextPaste('0', 'r', '', 'text', f)
      tree.onUTextPaste('10', 'r', '2', 'text', f)
      assert.equal(_treeToStr(tree), '0__2')
    })
  })

  describe('deletion', () => {
    it('deletes from list', () => {
      const tree = _getTree(lr(l('0'), l('1', [l('10'), l('11')])))
      assert.equal(_treeToStr(tree), '[{0}, {1, [{10}, {11}]}]')
      tree.remove(['11', '0'])
      assert.equal(_treeToStr(tree), '[{1, [{10}]}]')
    })

    it('deletes from grid', () => {
      const tree = _getTree(g([b('00'), b('10')], [b('01'), b('11')]))
      tree.remove(['00', '11'])
      assert.equal(_treeToStr(tree), '[{, [10]}, {, [01]}]') // {, - because width is ''
    })

    it('deletes anywhere', () => {
      const tree = _getTree(b('0'), b('1'), g([lr(l('l0', [l('l01'), l('l02')])), b('10')], [b('01'), b('11')]))

      assert.equal(_treeToStr(tree), '0_1_[{, [[{l0, [{l01}, {l02}]}], 10]}, {, [01, 11]}]')
      tree.remove(['1', '11', 'l01'])

      assert.equal(_treeToStr(tree), '0_[{, [[{l0, [{l02}]}], 10]}, {, [01]}]') // {, - because width is ''
    })

    it('bug: deletes extra nodes if id is duplicated', () => {
      const tree = _getTree(b('0'), b('1'), b('2'))
      tree.remove(['1', '1', '1'])
      assert.equal(_treeToStr(tree), '0_2') // {, - because width is ''
    })

    it('deletes list node if it becomes empty | deletes empty list', () => {
      const tree = _getTree(lr(l('0', [l('01')])))

      tree.remove(['01'])
      assert.equal(_treeToStr(tree), '[{0}]')

      tree.remove(['0'])
      assert.equal(_treeToStr(tree), '')
    })

    it('deletes empty column in grid | deletes one column grid', () => {
      const tree = _getTree(g([b('00')], [b('01')], [b('02')]))

      tree.remove(['02'])
      assert.equal(_treeToStr(tree), '[{, [00]}, {, [01]}]')

      tree.remove(['01'])
      assert.equal(_treeToStr(tree), '00') // {, - because width is ''
    })

    it('finds pages when blocks are deleted', () => {
      const [p1, p2, p3] = [{ id: 'pageId1' }, { id: 'pageId2' }, { id: 'pageId3' }] as UPageBlockData[]
      const { tree, onPagesDeleted } = _getTreeToSpy(
        [g([b('1'), b('p1', p1, 'page')]), b('p3', p3, 'page'), lr(l('3', [l('3', [l(b('p2', p2, 'page'))])]))],
        { onPagesDeleted: vi.fn() },
      )
      tree.remove(['g', 'p3', 'l'])
      expect(onPagesDeleted).toBeCalledWith(['pageId3', 'pageId1', 'pageId2'], { moveTo: '' })
    })

    it('deletes file when its block is deleted', () => {
      const { tree, onFilesDeleted } = _getTreeToSpy([b('img', { src: 's', width: 0 }, 'image')], {
        onFilesDeleted: vi.fn(),
      })
      tree.remove(['img'])
      expect(onFilesDeleted).toBeCalledWith([
        {
          blockId: 'img',
          src: 's',
        },
      ])
    })

    it('deletes file when its block type is changed', () => {
      const { tree, onFilesDeleted } = _getTreeToSpy([b('img', { src: 's', width: 0 }, 'image')], {
        onFilesDeleted: vi.fn(),
      })
      tree.changeType('img', 'text')
      expect(onFilesDeleted).toBeCalledWith([
        {
          blockId: 'img',
          src: 's',
        },
      ])
    })
  })

  describe('change', () => {
    it('changes text block to mcq', () => {
      const tree = _getTree(b('1', ''))
      tree.changeType('1', 'multiple-choice', '[] ')
      assert.equal(_treeToStr(tree), '{, , true, [], [Option 1, Option 2]}')
    })
  })

  describe('layout change', () => {
    it('rearranges blocks', () => {
      const tree = _getTree(b('0'), b('1'), g([lr(l('l0', [l('l01'), l('l02')])), b('10')], [b('01'), b('11')]))
      assert.equal(_treeToStr(tree), '0_1_[{, [[{l0, [{l01}, {l02}]}], 10]}, {, [01, 11]}]')
      tree.rearrange('11', ['0', '1', 'l01'])
      assert.equal(_treeToStr(tree), '[{, [[{l0, [{l02}]}], 10]}, {, [01, 11, 0, 1, l01]}]') // {, - because width is ''
    })

    it('rearranges blocks under title', () => {
      const tree = _getTree(b('0'), b('1'), g([b('10')], [b('01'), b('11')]))
      tree.rearrange('title', ['1', '10'])
      assert.equal(_treeToStr(tree), '1_10_0_01_11') // {, - because width is ''
    })

    it('creates grid', () => {
      const tree = _getTree(b('0'), b('1'), b('2'), b('3'))
      tree.createGrid('1', ['0', '3'], 'left')
      assert.equal(_treeToStr(tree), '[{[0, 3], 50%}, {[1], 50%}]_2')
    })

    it('creates grid column', () => {
      const tree = _getTree(b('0'), g([b('00')], [b('01')]))
      tree.createGrid('00', ['0'], 'left')
      assert.equal(_treeToStr(tree), `[{[0], ${tt}%}, {${tt}%, [00]}, {${tt}%, [01]}]`) // {, - because width is ''
    })

    it('creates list', () => {
      const tree = _getTree(b('0'))
      tree.addBlock('0', 'numbered-list', f)
      assert.equal(_treeToStr(tree), `0_[{}]`)
    })
  })

  describe('navigation', () => {
    it('bfs', () => {
      const bfs = bfsUBlocks([b('0'), e([b('1')]), g([b('3')], [b('4')]), lr(l('5', [l('6')])), b('7')])
      const ids = bfs.map((b) => b.id)
      assert.deepEqual(ids, ['0', 'e', '1', 'g', '3', '4', 'l', '5', '6', '7'])
    })

    it('gives prev text block', () => {
      const tree = _getTree(b('0'), b('1', '1', 'block-equation'), b('2'))
      const prevBlock = tree.getUTextBefore('2')
      assert.equal(prevBlock.id, '0')
    })

    it('gives prev text block & ignores closed blocks', () => {
      const tree = _getTree(list('>', l('0', [l('01')])), b('2'))
      const prevBlock = tree.getUTextBefore('2')
      assert.equal(prevBlock.id, '0')

      const tree2 = _getTree(list('*', l('0', [l('01')])), b('2'))
      const prevBlock2 = tree2.getUTextBefore('2')
      assert.equal(prevBlock2.id, '01')
    })

    it('gives next text block & ignores closed blocks', () => {
      const tree = _getTree(list('>', l('0', [l('01')])), b('2'))
      const prevBlock = tree.getUTextAfter('0')
      assert.equal(prevBlock.id, '2')

      const tree2 = _getTree(list('*', l('0', [l('01')])), b('2'))
      const prevBlock2 = tree2.getUTextAfter('0')
      assert.equal(prevBlock2.id, '01')
    })

    it('moves focus up & down', () => {
      const tree = _getTree(b('0'), b('1', '1', 'block-equation'), b('2'))

      assert.equal(tree.moveFocusDown(), '0')
      assert.equal(tree.moveFocusDown('0'), '2')
      assert.equal(tree.moveFocusDown('2'), 'factory')

      assert.equal(tree.moveFocusUp(), '2')
      assert.equal(tree.moveFocusUp('2'), '0')
      assert.equal(tree.moveFocusUp('0'), 'title')
    })

    it('derives TOC', () => {
      const tree = _getTree(
        b('h1', '1', 'heading-1'),
        b('0'),
        b('h2', '2', 'heading-2'),
        b('h3', '3', 'heading-3'),
        b('e', { ublocks: [], name: 'e' }, 'exercise'),
      )
      const toc = tree.deriveTOC().map((t) => t.data)
      assert.deepEqual(toc, ['1', '2', '3', 'e'])
    })
  })
})

const tt = '33.33333333333333'

const { b, e, g, l, lr, list } = _generators

const _getTree = (...ublocks: UBlocks) => new UPageTree({ ublocks }, uuidS(10), f, f, f)

const _getTreeToSpy = (ublocks: UBlocks, o?: { onPagesDeleted?: OnPagesDeleted; onFilesDeleted?: DeleteFiles }) => ({
  tree: new UPageTree({ ublocks }, uuidS(10), f, o?.onPagesDeleted || f, o?.onFilesDeleted || f),
  onPagesDeleted: o?.onPagesDeleted,
  onFilesDeleted: o?.onFilesDeleted,
})

const _treeToStr = (tree: UPageTree) =>
  _stateToStr({ ublocks: (tree.getParent('r').data as { ublocks: UBlocks }).ublocks })
