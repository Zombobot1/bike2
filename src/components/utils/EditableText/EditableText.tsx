import { styled, useTheme } from '@mui/material'
import { useRef, KeyboardEvent, useEffect } from 'react'
import { bool, fn, Fn, num, SetStr, str } from '../../../utils/types'
import { Editable, getUTextStyles } from '../../editing/UText/utextStyles'
import { useReactive } from '../hooks/hooks'
import { useRefCallback } from '../hooks/useRefCallback'

export interface EditableText {
  text: str
  setText: SetStr
  focusIfEmpty?: bool
  tag?: 'h3' | 'h4' | 'pre' | 'p'
  placeholder?: str
  onBlur?: Fn
  onFocus?: Fn
  focus?: num
}

export function EditableText({
  text: initialText,
  setText: setTextOnBlur,
  tag = 'pre',
  placeholder = '',
  focusIfEmpty,
  focus = 0,
  onBlur: onBlurFn = fn,
  onFocus: onFocusFn = fn,
}: EditableText) {
  const [text, setText] = useReactive(initialText)
  const ref = useRef<HTMLDivElement>(null)

  const onChange = useRefCallback((e) => setText(e.target.value))

  const onBlur = useRefCallback(() => {
    if (text !== initialText) setTextOnBlur(text)
    onBlurFn()
  }, [text])

  const onFocus = useRefCallback(onFocusFn, [])

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        ref.current?.blur()
      }
    },
    [ref],
  )

  useEffect(() => {
    if (focus) ref.current?.focus()
  }, [focus])

  useEffect(() => {
    if (!text && focusIfEmpty) ref.current?.focus()
  }, [text])

  const theme = useTheme()

  const sx = {
    ':empty:before': {
      content: 'attr(placeholder)',
      color: theme.palette.text.secondary,
      cursor: 'text',
    },
  }

  return (
    <Styles sx={sx}>
      <Editable
        innerRef={ref}
        html={text}
        tagName={tag}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        role="textbox"
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        data-cy="etext"
      />
    </Styles>
  )
}

export const Styles = styled('div', { label: 'EditableText ' })(({ theme }) => ({
  ...getUTextStyles(theme.breakpoints.up('sm')),
}))
