import { assert, describe, it } from 'vitest'
import { f, num, str, strs } from '../../../../../utils/types'
import { isStr } from '../../../../../utils/utils'
import { UBlocks, UBlock, UPageData, SubQuestion, UFormData, InlineExerciseData } from '../../ublockTypes'
import {
  ANSWER_REQUIRED,
  deriveUFromError,
  INVALID_EXERCISE,
  isAnswerCorrect,
  RuntimeDataKeeper,
  UFromRuntime,
} from './UPageRuntimeTree'
import { UPageTree } from './UPageTree'
import { _generators, _stateToStr } from './_fakeUPage'

describe('UPageRuntimeTree', () => {
  describe('UPageRuntimeKeeper', () => {
    it('keeps runtime data', () => {
      const { keeper, state } = getRKeeper(lr(l('0', [], undefined, true)), e([ie('s', sq('_', ['a'], [], '', ['b']))]))
      assert.equal(_stateToStr(state), '[{0, true}]_{e, [{[s, {0, [a], , [], short-answer, [b]}], }]}')

      const s2 = getTree(lr(l('0')), e([ie('s', sq('_', ['a']))])) // open & answer are gone
      keeper.transferRuntimeData(s2.tree)

      assert.equal(_stateToStr(s2.state), '[{0, true}]_{e, [{[s, {0, [a], , [], short-answer, [b]}], }]}')
    })

    it('works when block in list is gone', () => {
      const { keeper, state } = getRKeeper(lr(l('0', [], undefined, true), l('1', [], undefined, true)))
      assert.equal(_stateToStr(state), '[{0, true}, {1, true}]')

      const s2 = getTree(lr(l('0')))
      keeper.transferRuntimeData(s2.tree)

      assert.equal(_stateToStr(s2.state), '[{0, true}]')
    })

    it('works when block in form is gone', () => {
      const { keeper, state } = getRKeeper(e([laq('q1', '', 'a'), laq('q2', '', 'b')]))
      assert.equal(_stateToStr(state), '{e, [{q1, , , a, }, {q2, , , b, }]}')

      const s2 = getTree(e([laq('q1', '', 'a')]))
      keeper.transferRuntimeData(s2.tree)

      assert.equal(_stateToStr(s2.state), '{e, [{q1, , , a, }]}')
    })

    it('preserves error', () => {
      const { keeper, state } = getRKeeper(e([laq('q1', '', '', 'ERR')]))
      assert.equal(_stateToStr(state), '{e, [{q1, , , , ERR, }]}')

      const s2 = getTree(e([laq('q1', '', '')]))
      keeper.transferRuntimeData(s2.tree)

      assert.equal(_stateToStr(s2.state), '{e, [{q1, , , , , ERR}]}')
    })
  })

  describe('UFormRuntime', () => {
    it('prevents empty submissions', () => {
      const { uf, ufr } = getUFR(
        e([
          saq('sa'),
          laq('la'),
          mcq('mc', ['1', '2'], ['0', '1', '2']),
          scq('sc', ['0'], ['0', '1']),
          ie('i', sq('_'), 'e', sq('(', ['0'], ['1', '2'])),
        ]),
      )

      ufr.submit('e')
      assert.equal(uf.$score, undefined)

      assert.equal(uid(uf, 0).$error, ANSWER_REQUIRED)
      assert.equal(uid(uf, 1).$error, ANSWER_REQUIRED)
      assert.equal(ucd(uf, 2).$error, ANSWER_REQUIRED)
      assert.equal(ucd(uf, 3).$error, ANSWER_REQUIRED)
      assert.deepEqual(
        ied(uf, 4).content.map((s) => (isStr(s) ? '' : (s as SubQuestion).$error)),
        ['', ANSWER_REQUIRED, '', ANSWER_REQUIRED],
      )

      answer(uf, 0, 'a')
      answer(uf, 1, 'a')
      answer(uf, 2, ['a'])
      answer(uf, 3, ['a'])
      answer(uf, 4, ['a'], 1)
      answer(uf, 4, ['a'], 3)

      ufr.submit('e')
      assert.equal(uf.$score, 50)
    })

    it('prevents empty creation (except laq)', () => {
      const { uf, ufr } = getUFR(
        e(
          [
            saq('sa', ''),
            laq('la'),
            mcq('mc', [], ['0', '1', '2']),
            scq('sc', [], ['0', '1']),
            ie('i', sq('_'), 'e', sq('(', [], ['1', '2'])),
          ],
          true,
        ),
      )

      ufr.toggleEdit('e')
      assert.equal(uf.$state, 'editing')

      assert.equal(uid(uf, 0).$error, ANSWER_REQUIRED)
      assert.equal(uid(uf, 1).$error, undefined)
      assert.equal(ucd(uf, 2).$error, ANSWER_REQUIRED)
      assert.equal(ucd(uf, 3).$error, ANSWER_REQUIRED)
      assert.deepEqual(
        ied(uf, 4).content.map((s) => (isStr(s) ? '' : (s as SubQuestion).$error)),
        ['', undefined, '', ANSWER_REQUIRED],
      )

      correctAnswer(uf, 0, 'a')
      correctAnswer(uf, 2, ['a'])
      correctAnswer(uf, 3, ['a'])
      correctAnswer(uf, 4, ['a'], 3)

      ufr.toggleEdit('e')
      assert.equal(uf.$state, 'filling')
    })

    it('prevents empty inline exercise creation', () => {
      const { uf, ufr } = getUFR(e([ie()], true))

      ufr.toggleEdit('e')
      assert.equal(uf.$state, 'editing')
      assert.equal(ied(uf).$editingError, ANSWER_REQUIRED)

      const data = ied(uf)
      data.content = ['t']
      data.$editingError = INVALID_EXERCISE

      ufr.toggleEdit('e')
      assert.equal(uf.$state, 'editing')

      data.content = ['t', sq('_')]
      data.$editingError = ''

      ufr.toggleEdit('e')
      assert.equal(uf.$state, 'filling')
    })

    it('calculates score', () => {
      const { uf, ufr } = getUFR(
        e([
          saq('sa', 'a', '', 'a'),
          laq('la', '', 'a'),
          mcq('mc', ['1', '2'], ['0', '1', '2'], '', ['2']),
          scq('sc', ['0'], ['0', '1'], '', ['0']),
          ie('i', sq('_', ['a'], [], '', ['a']), 'e', sq('(', ['0'], ['0', '1'], '', ['1'])),
        ]),
      )

      ufr.submit('e')
      assert.equal(uf.$score, 80)
    })

    it('calculates 0 score', () => {
      const { uf, ufr } = getUFR(e([saq('sa', 'a', '', 'b')]))

      ufr.submit('e')
      assert.equal(uf.$score, 0)
    })

    it('calculates score in grid', () => {
      const { uf, ufr } = getUFR(e([g([saq('sa', 'a', '', 'a'), saq('sa', 'b', '', 'b')])]))
      ufr.submit('e')
      assert.equal(uf.$score, 100)
    })

    it('toggles edit in questions', () => {
      const { uf, ufr } = getUFR(e([saq('sa'), ie(sq('_'))]))
      assert.equal(uid(uf).$editing, undefined)
      assert.equal(ied(uf, 1).$editing, undefined)

      ufr.toggleEdit('e')
      assert.equal(uid(uf).$editing, true)
      assert.equal(ied(uf, 1).$editing, true)

      ufr.toggleEdit('e')
      assert.equal(uid(uf).$editing, false)
      assert.equal(ied(uf, 1).$editing, false)
    })

    it('retires', () => {
      const { uf, ufr } = getUFR(e([saq('sa', 'a', '', 'b')]))
      ufr.submit('e')
      assert.equal(uf.$score, 0)
      assert.equal(uid(uf).$submitted, true)

      ufr.retry('e')
      assert.equal(uf.$score, -1)
      assert.equal(uid(uf).$submitted, false)
      assert.equal(uid(uf).$answer, '')

      answer(uf, 0, 'a')
      ufr.submit('e')
      assert.equal(uf.$score, 100)
    })

    it('clears answers & score on edit', () => {
      const { uf, ufr } = getUFR(e([saq('sa', 'a', '', 'b')]))
      ufr.submit('e')
      assert.equal(uf.$score, 0)
      assert.equal(uid(uf).$submitted, true)

      ufr.toggleEdit('e')
      ufr.toggleEdit('e')
      assert.equal(uf.$score, -1)
      assert.equal(uid(uf).$submitted, false)
      assert.equal(uid(uf).$answer, '')
    })

    it('derives error', () => {
      const ie3 = ie()
      ;(ie3.data as InlineExerciseData).$editingError = 'err3'
      const questions = [saq('q', 'a', '', '', 'err1'), ie(sq('(', ['a'], [], '', [], 'err2')), ie3]
      assert.equal(deriveUFromError(questions), 'err1')
      questions.shift()
      assert.equal(deriveUFromError(questions), 'err2')
      questions.shift()
      assert.equal(deriveUFromError(questions), 'err3')
      questions.shift()
      assert.equal(deriveUFromError(questions), '')
    })

    it('checks correctness', () => {
      assert.equal(isAnswerCorrect('short-answer', saq('', 'a', '', 'a').data), true)
      assert.equal(isAnswerCorrect('multiple-choice', mcq('', ['a', 'b'], [], '', ['b', 'a']).data), true)
      assert.equal(
        isAnswerCorrect('inline-exercise', ie(sq('_', ['a'], [], '', ['a']), sq('(', ['a'], [], '', ['a'])).data),
        true,
      )
    })
  })
})

const correctAnswer = (data: UFormData, i: num, ca: str | strs, sqi = -1) => {
  if (sqi !== -1) {
    const sq = ied(data, i).content[sqi] as SubQuestion
    sq.correctAnswer = ca as strs
    sq.$error = ''
  } else {
    uid(data, i).correctAnswer = ca as str // to mute ts
    uid(data, i).$error = ''
  }
}

const answer = (data: UFormData, i: num, a: str | strs, sqi = -1) => {
  if (sqi !== -1) {
    const sq = ied(data, i).content[sqi] as SubQuestion
    sq.$answer = a as strs
    sq.$error = ''
  } else {
    uid(data, i).$answer = a as str // to mute ts
    uid(data, i).$error = ''
  }
}

const getUFR = (e: UBlock) => {
  const tree = getTree(e)
  const uf = ufd(tree.state)
  return { ufr: new UFromRuntime(tree.tree), state: tree.state, uf }
}

const getTree = (...ublocks: UBlocks) => {
  const state: UPageData = { ublocks }
  return { state, tree: new UPageTree(state, () => '?', f, f, f) }
}

const getRKeeper = (...ublocks: UBlocks) => {
  const r = getTree(...ublocks)
  return { keeper: new RuntimeDataKeeper(r.tree.bfs), state: r.state }
}

const { ie, sq, e, g, lr, l, laq, saq, mcq, scq, uid, ucd, ied, ufd } = _generators
