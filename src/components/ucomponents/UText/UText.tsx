import { bool, fn, Fn, JSObject, SetStr, str } from '../../../utils/types'
import ContentEditable from 'react-contenteditable'
import { DependencyList, useCallback, useEffect, useRef, useState, KeyboardEvent } from 'react'
import { useEffectedState, useMount } from '../../../utils/hooks-utils'
import { styled, useTheme } from '@material-ui/core'
import { AddNewBlockUText, StrBlockComponent } from '../types'

export interface UParagraph extends StrBlockComponent {
  tryToChangeFieldType: SetStr
  autoFocus: bool
  placeholder?: str
  addNewBlock?: AddNewBlockUText
  deleteBlock?: Fn
  produceNewBlock?: AddNewBlockUText
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
  produceNewBlock,
  deleteBlock = fn,
}: UText_) {
  const [text, setText] = useEffectedState(data)
  const [inFocus, setInFocus] = useState(false)
  const [isNewBlockProduced, setIsNewBlockProduced] = useState(false)

  const ref = useRef<HTMLElement>(null)

  useMount(() => {
    if (autoFocus) ref.current?.focus()
  })

  useEffect(() => {
    if (!text) return
    tryToChangeFieldType(text)

    if (produceNewBlock && !isNewBlockProduced) {
      setIsNewBlockProduced(true)
      produceNewBlock('NO_FOCUS')
    }
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
        if (!addNewBlock) return
        if (produceNewBlock) produceNewBlock('FOCUS')
        else addNewBlock('FOCUS')
      } else if (e.key === 'Backspace' && !text && !produceNewBlock) {
        e.preventDefault()
        deleteBlock()
      }
    },
    [text, produceNewBlock, deleteBlock],
  )

  const theme = useTheme()

  let sx: JSObject | undefined =
    inFocus || alwaysShowPlaceholder
      ? {
          '&:empty:before': {
            content: 'attr(placeholder)',
            fontSize: '1.5rem',
            color: theme.palette.text.secondary,
            cursor: 'text',
          },
        }
      : undefined
  sx = produceNewBlock ? { ...sx, minHeight: '12rem' } : sx
  return (
    <UTextWrapper>
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
      />
    </UTextWrapper>
  )
}

const UTextWrapper = styled('div', { label: 'UText' })(({ theme }) => ({
  outline: 'none',
  '& pre': {
    fontSize: '1.5rem',
    fontFamily: theme.typography.fontFamily,
  },
}))

const Editable = styled(ContentEditable)({
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
