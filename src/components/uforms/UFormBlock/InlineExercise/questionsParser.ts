import _ from 'lodash'
import { safeSplit } from '../../../../utils/algorithms'
import { num, str, strs } from '../../../../utils/types'
import { unhighlight } from '../../../../utils/unhighlight'
import { safe } from '../../../../utils/utils'
import { UBlockType } from '../../../editing/types'
import { InlineExerciseDTO, SubQuestion } from '../../types'

export function highlight(html: str): str {
  const raw = unhighlight(html)
  return raw.replaceAll(formBlockRe, (match) => {
    return `<span class="${getMatchType(match)}">${match.replace(
      explanationRe,
      (_m, $1) => ` <span class="explanation">${$1}</span>}`,
    )}</span>`
  })
}

function getMatchType(match: str): str {
  if (match.trim().match(radioStartRe)) {
    if (match.includes('(*) ')) return 'single-choice'
    return 'invalid'
  } else if (match.trim().match(checksStartRe)) {
    if (match.includes('[*] ')) return 'multiple-choice'
    return 'invalid'
  }
  return 'short-answer'
}

export function extractQuestions(rawHtml: str): InlineExerciseDTO {
  const html = rawHtml.trim()
  const questions = html.match(formBlockRe)
  if (!questions) return []

  const text = safeSplit(html, formBlockRe)
  const startsWithQuestion = !!html.match(startsWithFormBlockRe)
  const endsWithQuestion = !!html.match(endsWithFormBlockRe)

  const r: InlineExerciseDTO = []
  let questionIndex = 0
  for (let i = 0; i < questions.length; i++) {
    const parsedBlock = parseFormBlockStr(questions[i], questionIndex++)
    if (i === 0) {
      if (startsWithQuestion) r.push(parsedBlock)
      else if (questions.length === 1) r.push(text[i], parsedBlock, text[i + 1])
      else r.push(text[i], parsedBlock)
    } else if (i === questions.length - 1) {
      if (endsWithQuestion) r.push(text[i], parsedBlock)
      else r.push(text[i], parsedBlock, text[i + 1])
    } else r.push(text[i], parsedBlock)
  }
  const refinedChain = r.filter(Boolean)
  return refinedChain.map((q, i) => {
    if (!_.isString(q)) return q
    const spaceBefore = i === 0 || punctuation.includes(q[0]) ? '' : ' '
    const spaceAfter = i === refinedChain.length - 1 ? '' : ' '
    return spaceBefore + q + spaceAfter
  })
}

function parseFormBlockStr(formBlockStr: str, questionIndex: num): SubQuestion {
  let type: UBlockType = 'short-answer'
  formBlockStr = formBlockStr.trim()
  if (formBlockStr.includes('[*] ')) type = 'multiple-choice'
  else if (formBlockStr.includes('(*) ')) type = 'single-choice'

  let optionsStr = ''
  let explanation = ''
  if (formBlockStr.includes(' # ')) {
    const parts = safeSplit(formBlockStr, ' # ')
    optionsStr = parts[0]
    explanation = parts[1].slice(0, -1) // remove }
  } else optionsStr = formBlockStr

  if (optionsStr.startsWith('{')) optionsStr = optionsStr.slice(1)
  if (optionsStr.endsWith('}')) optionsStr = optionsStr.slice(0, -1)
  if (explanation.endsWith('}')) explanation = explanation.slice(0, -1)

  let options: strs = []
  let correctAnswer: strs = []
  if (type === 'multiple-choice') {
    correctAnswer = safe(formBlockStr.match(correctChecksAnswerRe)).map((a) => a.slice(4).trim())
    options = safeSplit(optionsStr, /\[\*?\] /gm)
  } else if (type === 'single-choice') {
    correctAnswer = safe(formBlockStr.match(correctRadioAnswerRe)).map((a) => a.slice(4).trim())
    options = safeSplit(optionsStr, /\(\*?\) /gm)
  } else correctAnswer = [optionsStr.trim()]

  return { correctAnswer: correctAnswer, explanation, options, type, i: questionIndex }
}

export function inlineQuestions(questions: InlineExerciseDTO): str {
  if (!questions.length) return ''
  const serializedQuestions = questions.map((q, i): str => {
    if (_.isString(q)) return q
    let spaceAtEnd = ''
    const nextNode = questions[i + 1]
    if (_.isString(nextNode) && !punctuation.includes(nextNode[0])) spaceAtEnd = ' '
    return questionToFormBlockStr(q, q.type) + spaceAtEnd
  })
  return serializedQuestions.join('')
}

function questionToFormBlockStr(question: SubQuestion, type: UBlockType): str {
  let options = ''
  if (type !== 'short-answer') {
    for (const option of question.options) {
      let isCorrect = false
      if (question.correctAnswer.includes(option)) isCorrect = true
      const leftBracket = type === 'multiple-choice' ? '[' : '('
      const rightBracket = type === 'multiple-choice' ? ']' : ')'
      options += `${leftBracket}${isCorrect ? '*' : ''}${rightBracket} ${option} `
    }
    options = options.trimEnd()
  }
  const explanation = question.explanation ? ' # ' + question.explanation : ''
  return ` {${options || question.correctAnswer[0]}${explanation}}`
}

const punctuation = ',.;!'
const formBlockStart = '(?:^| )'
const formBlockBody = '{[^{]+}'
const formBlockRe = new RegExp(formBlockStart + formBlockBody, 'gm')
const startsWithFormBlockRe = new RegExp('^' + formBlockBody, 'm')
const endsWithFormBlockRe = new RegExp(formBlockBody + `[ ${punctuation}]$`, 'm')
const radioStartRe = /^\{\(\*?\) /gm
const checksStartRe = /^\{\[\*?\] /gm
const explanationRe = / (# [^{([]+)\}/gm
const correctChecksAnswerRe = /\[\*\][^[#]+/gm
const correctRadioAnswerRe = /\(\*\)[^(#]+/gm

// correctChecksAnswerRe tests
// [*] aaa}
// aaa [*] aaa }
// aa [*] a # a}

/* formBlockRe test

{start} Some dummy text {a} mops another dummy text {b} the end.
Select right {(*) right () not right} it's easy.

One more time: {[] wrong [*] also wrong}, but now it's tricky. {end}

*/
