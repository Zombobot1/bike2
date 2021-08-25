import { bool, fn, Fn, JSObject, SetStr, str } from '../../../utils/types'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { DependencyList, useCallback, useEffect, useRef, useState, KeyboardEvent } from 'react'
import { useEffectedState } from '../../utils/hooks/hooks'
import { styled, useTheme } from '@material-ui/core'
import { AddNewBlockUText, UBlockComponent } from '../types'

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
  const [text, setText] = useEffectedState(data)
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

  let sx: JSObject = {
    margin: 0,
    fontSize: '1.5rem',
    fontFamily: theme.typography.fontFamily,
    textAlign: text.length < 90 ? 'center' : 'left',
  }

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

      [`${theme.breakpoints.up('sm')}`]: {
        fontSize: '2rem',
      },
    }
  }

  sx = isFactory && !alwaysShowPlaceholder ? { ...sx, minHeight: '12rem' } : sx

  return (
    <Editable
      notemotionref={ref}
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
    />
  )
}

interface UContentEditable_ {
  notemotionref: React.RefObject<HTMLDivElement>
  html: str
  tagName: str
  placeholder?: str
  disabled?: bool
  role: str
  onBlur: React.FocusEventHandler<HTMLDivElement>
  onChange: (e: ContentEditableEvent) => void
  onFocus: React.FocusEventHandler<HTMLDivElement>
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>
}

function UContentEditable(props: UContentEditable_) {
  return <ContentEditable innerRef={props.notemotionref} {...props} data-cy="utext" /> // cannot use innerRef with emotion - it breaks storybook (it uses emotion 10, whereas I use 11)
}

const Editable = styled(UContentEditable, { label: 'ContentEditable ' })({
  outline: 'none',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useRefCallback = <T extends any[]>(
  value: ((...args: T) => void) | undefined,
  deps?: DependencyList,
): ((...args: T) => void) => {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, deps ?? [value])

  const result = useCallback((...args: T) => {
    ref.current?.(...args)
  }, [])

  return result
}