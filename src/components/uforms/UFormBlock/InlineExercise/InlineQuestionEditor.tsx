import { styled, useTheme } from '@mui/material'
import { cyan, pink } from '@mui/material/colors'
import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import ContentEditable from 'react-contenteditable'
import { insert } from '../../../../utils/algorithms'
import { num, str } from '../../../../utils/types'
import { unhighlight } from '../../../../utils/unhighlight'
import { safe, ucast } from '../../../../utils/utils'
import { useRefCallback } from '../../../utils/hooks/useRefCallback'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { cursorOffset, setCursor } from '../../../utils/Selection/selection'
import { ComplexQuestion, INVALID_EXERCISE, UFormFieldData } from '../../types'
import { extractQuestions, highlight, inlineQuestions } from './questionsParser'

export function InlineExerciseEditor(ps: UFormFieldData) {
  const [text, setText] = useState(() => highlight(inlineQuestions(ucast<ComplexQuestion>(ps.data, []))))
  const [cursorPosition, setCursorPosition] = useState<num | null>(null)
  const [validationError, setValidationError] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const theme = useTheme()

  const onChange = useRefCallback((e) => {
    const cp = cursorOffset(safe(ref.current))
    const newText = highlight(unhighlight(e.target.value))
    setText(newText)
    setCursorPosition(cp)
    if (validationError && isValid(newText)) {
      ps.resolveError(ps.id)
      setValidationError('')
    }
  })

  const onPaste = useRefCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const cp = cursorOffset(safe(ref.current))
      const newData = e.nativeEvent.clipboardData?.getData('Text') || ''
      setText(highlight(insert(unhighlight(text), cp, newData)))
      setCursorPosition(cp + newData.length)
    },
    [text],
  )

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const sRef = safe(ref.current)
      if (e.key === 'Enter') {
        e.preventDefault()
        const cp = cursorOffset(sRef)
        setText(highlight(insert(unhighlight(text), cp, '\n')))
        setCursorPosition(cp + 1)
      }
    },
    [text],
  )

  const onBlur = useRefCallback(() => {
    const newQuestion = JSON.stringify(extractQuestions(unhighlight(text)))
    if (newQuestion !== JSON.stringify(ps.data)) ps.setData(newQuestion)
  }, [text])

  useUpdateEffect(() => {
    if (!isValid(text)) {
      setValidationError(INVALID_EXERCISE)
      ps.onSubmissionAttempt(ps.id, -1, INVALID_EXERCISE)
    } else ps.onSubmissionAttempt(ps.id, 1)
  }, [ps.submissionAttempt])

  useEffect(() => {
    if (cursorPosition !== null) setCursor(safe(ref.current), cursorPosition, 'forward', 'symbol')
  }, [cursorPosition])

  return (
    <div>
      <Styles sx={{ border: theme.bd(validationError ? 'e' : 'p') }}>
        <Editable
          innerRef={ref}
          html={text}
          tagName={'pre'}
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          role="textbox"
          placeholder={'Write exercise with questions: \n{() option (*) correct option # explanation}'}
          data-cy="etext"
        />
      </Styles>
      {validationError && <Error>{validationError}</Error>}
    </div>
  )
}

const isValid = (text: str) => !text.includes('<span class="invalid">') && text.includes('<span class="')

const Styles = styled('div', { label: 'EditableText ' })(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: '1rem',

  '.invalid': { color: theme.palette.error.main },
  '.explanation': { color: pink[300] },
  '.short-answer': { color: cyan[300] },
  '.single-choice': { color: theme.palette.success.main },
  '.multiple-choice': { color: theme.palette.info.main },

  pre: { fontSize: '1rem' },

  [`${theme.breakpoints.up('sm')}`]: {
    pre: { fontSize: '1.5rem' },
  },
}))

const Editable = styled(ContentEditable)(({ theme }) => ({
  outline: 'none',
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',

  ':empty:before': {
    content: 'attr(placeholder)',
    color: theme.palette.text.secondary,
    cursor: 'text',
  },
}))

const Error = styled('div')(({ theme }) => ({
  paddingTop: '0.5rem',
  color: theme.palette.error.main,
}))
