import { bool, fn, Fn, JSObject, SetStr, str } from '../../../utils/types'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { useReactive } from '../../utils/hooks/hooks'
import { Box, styled, useTheme } from '@material-ui/core'
import { AddNewBlockUText, UBlockComponent } from '../types'
import { useRefCallback } from '../../utils/hooks/useRefCallback'

export interface UParagraph extends UBlockComponent {
  tryToChangeFieldType: SetStr
  autoFocus: bool
  addNewBlock: AddNewBlockUText
  placeholder?: str
  deleteBlock?: Fn
  isFactory?: bool
  onFactoryBackspace?: Fn
  isCardField?: bool
}

export function UParagraph(props: UParagraph) {
  return (
    <UText
      {...props}
      component="pre"
      placeholder={props.placeholder || "Type '/' for commands"}
      alwaysShowPlaceholder={Boolean(props.placeholder)}
    />
  )
}

export function UHeading1(props: UParagraph) {
  return <UText {...props} component="h2" placeholder="Heading 1" />
}

export function UHeading2(props: UParagraph) {
  return <UText {...props} component="h3" placeholder="Heading 2" />
}

export function UHeading3(props: UParagraph) {
  return <UText {...props} component="h4" placeholder="Heading 3" />
}

interface UText_ extends UParagraph {
  component: str
  alwaysShowPlaceholder?: bool
}

function UText({
  data,
  setData,
  component,
  tryToChangeFieldType,
  autoFocus,
  placeholder,
  alwaysShowPlaceholder = true,
  readonly,
  addNewBlock,
  deleteBlock = fn,
  isFactory,
  onFactoryBackspace = fn,
  isCardField,
}: UText_) {
  const [text, setText] = useReactive(data)
  const [inFocus, setInFocus] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    if (!text) return
    if (isFactory) addNewBlock('FOCUS', text)
    tryToChangeFieldType(text)
  }, [text])

  const onFocus = useRefCallback(() => setInFocus(true))
  const onChange = useRefCallback((e) => setText(e.target.value))
  const onBlur = useRefCallback(() => {
    setInFocus(false)
    if (text !== data) setData(text)
  }, [text])

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        if (isFactory) addNewBlock('NO_FOCUS')
        else addNewBlock('FOCUS')
      } else if (e.key === 'Backspace' && !text) {
        e.preventDefault()
        if (isFactory) onFactoryBackspace()
        else deleteBlock()
      }
    },
    [text, deleteBlock, onFactoryBackspace],
  )

  const theme = useTheme()

  let sx: JSObject = {}

  if (inFocus || alwaysShowPlaceholder) {
    sx = {
      ...sx,
      '&:empty:before': {
        content: 'attr(placeholder)',
        fontSize: '1.5rem',
        color: theme.palette.text.secondary,
        cursor: 'text',
      },
    }
  }

  if (isCardField) {
    sx = {
      ...sx,
      fontSize: '1.65rem',
      overflowY: 'hidden',
      overflowX: 'hidden',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      marginBottom: 0,
      lineHeight: 1.12,
      flex: '0 0 auto',
      textAlign: text.length < 90 ? 'center' : 'left',

      [`${theme.breakpoints.up('sm')}`]: {
        fontSize: '2rem',
      },
    }
  }

  sx = isFactory && !alwaysShowPlaceholder ? { ...sx, minHeight: '12rem' } : sx

  return (
    <Styles>
      <Editable
        innerRef={ref}
        html={text}
        tagName={component}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        sx={sx}
        disabled={readonly}
        role="textbox"
        onKeyDown={onKeyDown}
        data-cy="utext"
      />
    </Styles>
  )
}
const Styles = styled(Box)(({ theme }) => ({
  h2: { fontSize: '1.25rem', marginTop: '0.5rem' },
  h3: { fontSize: '1rem', marginTop: '0.375rem' },
  h4: { fontSize: '0.875rem', marginTop: '0.25rem' },
  pre: { fontSize: '1rem' },

  [`${theme.breakpoints.up('sm')}`]: {
    h2: { fontSize: '2.5rem', marginTop: '1rem' },
    h3: { fontSize: '2rem', marginTop: '0.75rem' },
    h4: { fontSize: '1.75rem', marginTop: '0.5rem' },
    pre: { fontSize: '1.5rem' },
  },
}))

const Editable = styled(ContentEditable, { label: 'ContentEditable ' })(({ theme }) => ({
  margin: 0,

  outline: 'none',
  fontFamily: theme.typography.fontFamily,
  width: '100%',
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',

  h2: {
    color: 'red',
  },
}))
