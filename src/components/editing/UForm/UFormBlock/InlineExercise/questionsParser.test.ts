import { assert, describe, it } from 'vitest'
import { str, strs } from '../../../../../utils/types'
import { isStr } from '../../../../../utils/utils'
import { InlineExerciseData, SubQuestion } from '../../../UPage/ublockTypes'
import { extractQuestions, inlineQuestions } from './questionsParser'

describe('questionsParser', () => {
  it('parses from string', () => {
    compareQuestions(extractQuestions(d), q)
  })

  it('parses to string', () => {
    const raw = `{"content":["Some dummy text",{"correctAnswer":["a"],"explanation":"","options":[],"type":"short-answer"},"another text",{"correctAnswer":["b"],"explanation":"explained","options":[],"type":"short-answer"},"the end.\\nSelect right",{"correctAnswer":["right"],"explanation":"just coz))","options":["right","not right"],"type":"single-choice"},"it's easy.\\n\\nOne more time:",{"correctAnswer":["also wrong"],"explanation":"gotcha))","options":["wrong","also wrong"],"type":"multiple-choice"},", but now it's tricky."]}`
    assert.equal(inlineQuestions(JSON.parse(raw)), d)
  })
})

const d = `Some dummy text {a} another text {b # explained} the end.
Select right {(*) right () not right # just coz))} it's easy.

One more time: {[] wrong [*] also wrong # gotcha))}, but now it's tricky.`

const q = [
  'Some dummy text ',
  `short-answer\na`,
  ' another text ',
  `short-answer\nb\nexplained`,
  ' the end.\nSelect right ',
  `single-choice\nright, not right\nright\njust coz))`,
  " it's easy.\n\nOne more time: ",
  `multiple-choice\nwrong, also wrong\nalso wrong\ngotcha))`,
  ", but now it's tricky.",
]

function questionToStr(q: SubQuestion | str): str {
  if (isStr(q)) return q
  let r = ''

  r += q.type + '\n'
  if (q.options.length) r += q.options.join(', ') + '\n'
  r += q.correctAnswer.join(', ') + '\n'
  if (q.explanation) r += q.explanation

  return r.trim()
}

function compareQuestions(qs: InlineExerciseData, targets: strs) {
  qs.content.forEach((q, i) => {
    const actual = questionToStr(q)
    const expected = targets[i]
    assert.equal(actual, expected)
  })
}
