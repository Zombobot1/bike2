import { styled } from '@mui/material'
import { useRef, KeyboardEvent } from 'react'
import ContentEditable from 'react-contenteditable'
import { bool, SetStr, str } from '../../../utils/types'
import { _apm } from '../../application/theming/theme'
import { useMount, useReactive } from '../hooks/hooks'
import { useRefCallback } from '../hooks/useRefCallback'

export interface EditableText {
  text: str
  setText: SetStr
  focusIfEmpty?: bool
  tag?: 'h3' | 'h4' | 'pre'
  placeholder?: str
  pd?: str
}

export function EditableText({
  text: initialText,
  setText: setTextOnBlur,
  tag = 'pre',
  placeholder = 'Untitled',
  pd = '0',
  focusIfEmpty,
}: EditableText) {
  const [text, setText] = useReactive(initialText)
  const ref = useRef<HTMLDivElement>(null)
  const onChange = useRefCallback((e) => setText(e.target.value))
  const onBlur = useRefCallback(() => setTextOnBlur(text), [text])

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        ref.current?.blur()
      }
    },
    [ref],
  )

  useMount(() => {
    if (!text && focusIfEmpty) ref.current?.focus()
  })

  return (
    <Styles sx={{ paddingBottom: pd }}>
      <Editable
        innerRef={ref}
        html={text}
        tagName={tag}
        onBlur={onBlur}
        onChange={onChange}
        role="textbox"
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        data-cy="etext"
      />
    </Styles>
  )
}

const Styles = styled('div', { label: 'EditableText ' })(({ theme }) => ({
  h4: { fontSize: '0.875rem' },
  pre: { fontSize: '1rem' },

  [`${theme.breakpoints.up('sm')}`]: {
    h4: { fontSize: '1.75rem' },
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
    color: _apm(theme, 'secondary'),
    cursor: 'text',
  },
}))
