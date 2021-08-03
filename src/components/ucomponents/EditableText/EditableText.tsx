import { bool, str } from '../../../utils/types'
import ContentEditable from 'react-contenteditable'
import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'
import { useEffectedState, useMount } from '../../../utils/hooks-utils'
import { styled, useTheme } from '@material-ui/core'
import { StrBlockComponent } from '../types'

export interface UText extends StrBlockComponent {
  tryToChangeFieldType: (d: str) => void
  autoFocus: bool
  readonly?: bool
  placeholder?: str
  alwaysShowPlaceholder?: bool
}

export function UText(props: UText) {
  return (
    <EditableText
      {...props}
      component="div"
      placeholder={props.placeholder || "Type '/' for commands"}
      alwaysShowPlaceholder={props.alwaysShowPlaceholder || false}
    />
  )
}

export function UHeading1(props: UText) {
  return <EditableText {...props} component="h2" placeholder="Heading 1" />
}

export function UHeading2(props: UText) {
  return <EditableText {...props} component="h3" placeholder="Heading 2" />
}

export function UHeading3(props: UText) {
  return <EditableText {...props} component="h4" placeholder="Heading 3" />
}

interface EditableText_ extends UText {
  component: str
}

function EditableText({
  data,
  setData,
  component,
  tryToChangeFieldType,
  autoFocus,
  placeholder,
  alwaysShowPlaceholder = true,
  readonly,
}: EditableText_) {
  const [text, setText] = useEffectedState(data)
  const [inFocus, setInFocus] = useState(false)

  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (text) tryToChangeFieldType(text)
  }, [text])

  const onFocus = useRefCallback(() => setInFocus(true))
  const onChange = useRefCallback((e) => setText(e.target.value))
  const onBlur = useRefCallback(() => {
    setInFocus(false)
    setData(text)
  }, [text])

  useMount(() => {
    if (autoFocus) ref.current?.focus()
  })

  const theme = useTheme()

  const sx =
    inFocus || alwaysShowPlaceholder
      ? {
          '&:empty:before': {
            content: 'attr(placeholder)',
            color: theme.palette.text.secondary,
            cursor: 'text',
          },
        }
      : undefined

  return (
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
    />
  )
}

const Editable = styled(ContentEditable, { label: 'EditableText' })({
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
