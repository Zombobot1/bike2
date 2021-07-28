import { bool, str, StrState } from '../../../utils/types'
import ContentEditable from 'react-contenteditable'
import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'
import { useMount } from '../../../utils/hooks-utils'

export interface UText {
  tryToChangeFieldType: (d: str) => void
  autoFocus: bool
  dataS: StrState
}

export function UText(props: UText) {
  return <EditableText {...props} component="div" />
}

export function UHeading1(props: UText) {
  return <EditableText {...props} component="h2" />
}

export function UHeading2(props: UText) {
  return <EditableText {...props} component="h3" />
}

export function UHeading3(props: UText) {
  return <EditableText {...props} component="h4" />
}

interface EditableText_ extends UText {
  component: str
}

function EditableText({ dataS, component, tryToChangeFieldType, autoFocus }: EditableText_) {
  const [data, setData] = dataS
  const [text, setText] = useState(data)

  const ref = useRef<HTMLElement>(null)

  useEffect(() => tryToChangeFieldType(text), [text])

  const handleChange = useRefCallback((e) => setText(e.target.value))
  const handleBlur = useRefCallback(() => setData(text), [text])

  useMount(() => {
    if (autoFocus) ref.current?.focus()
  })

  return (
    <ContentEditable
      innerRef={ref}
      html={text}
      tagName={component}
      onBlur={handleBlur}
      onChange={handleChange}
      style={{ outline: 'none' }}
    />
  )
}

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
