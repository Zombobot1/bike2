import { useTheme } from '@mui/material'
import { useRef, KeyboardEvent, useEffect } from 'react'
import { bool, DivRef, Fn, JSObject, num, SetStr, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { Editable } from '../../editing/UText/utextStyles'
import { useReactive } from '../hooks/hooks'
import { useRefCallback } from '../hooks/useRefCallback'
import { Styles } from './EditableText'

export interface EditableUtility {
  text: str
  setText: SetStr
  type: 'title' | 'factory'
  placeholder: str
  hidePlaceholder?: bool
  focus: num
  focusIfEmpty?: bool
  onEnter: Fn
  onBackspace?: Fn
  onArrowUp?: Fn
  onArrowDown?: Fn
  createBlock?: SetStr
  onClick: Fn
  cy: str
}

export function EditableUtility(ps: EditableUtility) {
  const [text, setText] = useReactive(ps.text)
  const ref = useRef<HTMLDivElement>(null)

  const onChange = useRefCallback((e) => {
    if (ps.type === 'factory') ps.createBlock?.(e.target.value)
    else setText(e.target.value)
  })

  const onBlur = useRefCallback(() => {
    if (text !== ps.text) ps.setText(text)
  }, [text])

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      let prevent = true
      if (e.key === 'Enter') {
        if (ps.type === 'factory') ps.createBlock?.('')
        else ps.onEnter()
      } else if (e.key === 'Backspace' && !text) ps.onBackspace?.()
      else if (e.key === 'ArrowUp') ps.onArrowUp?.()
      else if (e.key === 'ArrowDown') ps.onArrowDown?.()
      else prevent = false

      if (prevent) e.preventDefault()
    },
    [ref, text],
  )

  useEffect(() => {
    if (ps.focus) setCaretAtEnd(ref)
  }, [ps.focus])

  useEffect(() => {
    if (!text && ps.focusIfEmpty) ref.current?.focus()
  }, [text])

  const theme = useTheme()
  let sx: JSObject = {
    [ps.hidePlaceholder ? ':focus:empty:before' : ':empty:before']: {
      content: 'attr(placeholder)',
      color: theme.palette.text.secondary,
      cursor: 'text',
    },
  }

  sx = ps.type === 'factory' && ps.hidePlaceholder ? { ...sx, minHeight: '12rem' } : sx
  let placeholder = ps.type === 'factory' ? "Type '/' for commands" : 'Untitled'
  if (ps.placeholder) placeholder = ps.placeholder

  return (
    <Styles>
      <Editable
        innerRef={ref}
        html={text}
        tagName={ps.type === 'factory' ? 'pre' : 'h1'}
        onBlur={onBlur}
        onChange={onChange}
        role="textbox"
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        data-cy={ps.cy || 'etext'}
        sx={sx}
        onClick={ps.onClick}
      />
    </Styles>
  )
}

export function setCaretAtEnd(ref: DivRef) {
  ref.current?.focus()
  const sel = document.getSelection()
  const node = safe(ref.current).firstChild as HTMLElement
  if (!node) return ref.current?.focus()

  if (sel?.rangeCount) {
    sel.getRangeAt(0).setStart(node, node.textContent?.length || 0)
    sel.getRangeAt(0).setEnd(node, node.textContent?.length || 0)
  }
}
