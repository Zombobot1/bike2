import { styled, useTheme } from '@mui/material'
import { cyan, pink } from '@mui/material/colors'
import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import ContentEditable from 'react-contenteditable'
import { insert } from '../../../../../utils/algorithms'
import { num, str } from '../../../../../utils/types'
import { unhighlight } from '../../../../../utils/unhighlight'
import { safe } from '../../../../../utils/utils'
import { UBlockContent } from '../../../types'
import { InlineExerciseData } from '../../../UPage/ublockTypes'
import { useRefCallback } from '../../../../utils/hooks/useRefCallback'
import { cursorOffset, setCursor } from '../../../../utils/Selection/selection'
import { extractQuestions, highlight, inlineQuestions } from './questionsParser'
import { INVALID_EXERCISE } from '../../../UPage/UPageState/crdtParser/UPageRuntimeTree'

// TODO: provide GUI for editor (reuse mcq, scq but inline them)
// TODO: explanation editor goes below as stack with numbers & placeholders: 1. "Add explanation for {answer}" or "() o1 () o2"

export function InlineExerciseEditor({ id, data: d, setData }: UBlockContent) {
  const data = d as InlineExerciseData
  const [text, setText] = useState(() => highlight(inlineQuestions(data)))
  const [cursorPosition, setCursorPosition] = useState<num | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const theme = useTheme()

  const onChange = useRefCallback((e) => {
    const cp = cursorOffset(safe(ref.current))
    const newText = highlight(clean(e.target.value))
    setText(newText)
    setCursorPosition(cp)

    if (data.$editingError && isValid(newText)) setData(id, { $editingError: '' })
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
        const t = highlight(insert(unhighlight(text), cp, '\n'))
        setText(t)
        setCursorPosition(cp + 1)
      }
    },
    [text],
  )

  const onBlur = useRefCallback(() => {
    const valid = isValid(text)
    // unlike others questions it sets error onBlur not on submit
    if (!valid) setData(id, { $editingError: INVALID_EXERCISE })
    else setData(id, extractQuestions(unhighlight(text)))
  }, [text])

  useEffect(() => {
    if (cursorPosition !== null) setCursor(safe(ref.current), cursorPosition, 'forward', 'symbol')
  }, [cursorPosition])

  // console.log({ text })
  // const html = text.at(-1) === '\n' && text.at(-2) !== '\n' ? text.slice(0, -1) + '&#10;&#13;' : text // bad idea
  const html = text.at(-1) === '\n' ? text + '&nbsp;' : text // bad render if text = "a\n"
  return (
    <div>
      <Styles sx={{ border: theme.bd(data.$editingError ? 'e' : 'p') }}>
        <Editable
          innerRef={ref}
          html={html}
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
      {data.$editingError && <Error>{data.$editingError}</Error>}
    </div>
  )
}

const clean = (text: str) => {
  return text.replaceAll('&nbsp;', '').replaceAll('<br>', '') // br magically appears
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

  [`${theme.breakpoints.up('sm')}`]: { pre: { fontSize: '1.25rem' } },
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
