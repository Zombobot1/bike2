import { alpha, Box, ClickAwayListener, Paper, Popper, styled, TextField, useTheme } from '@mui/material'
import { useEffect, useRef, KeyboardEvent, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import { safeSplit } from '../../../utils/algorithms'
import { srcfy } from '../../../utils/filesManipulation'
import { bool, Fn, fn, JSObject, num, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { _apm } from '../../application/theming/theme'
import { unhighlight } from '../../utils/CodeEditor/highlight'
import { useMount, useReactive, useReactiveObject } from '../../utils/hooks/hooks'
import { useRefCallback } from '../../utils/hooks/useRefCallback'
import { containsTag, removeTag, replaceTag } from '../../utils/Selection/htmlAsStr'
import {
  cursorOffset,
  cursorOffsetAndSelection,
  relativeDimensions,
  selectedText,
  selectionCoordinates,
  setCursor,
  toggleTag,
  toggleTagMutable,
  toggleTags,
} from '../../utils/Selection/selection'
import { isUListComponent } from '../types'
import { UImageFileDTO } from '../UFile/UImageFile/UImageFile'
import { UListDTO, UText } from './types'

export interface UText_ extends UText {
  component: str
  alwaysShowPlaceholder?: bool
  handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>, atStart?: bool) => void
  offset?: num
  color?: str
}

export function UText_({
  type,
  data,
  setData,
  component,
  tryToChangeFieldType,
  focus: initialFocus,
  placeholder,
  alwaysShowPlaceholder = true,
  readonly,
  addNewBlock,
  deleteBlock = fn,
  isFactory,
  onFactoryBackspace = fn,
  isCardField,
  arrowNavigation,
  onTitleEnter,
  setType,
  addInfo = fn,
  handleKeyDown = fn,
  offset = 0,
  appendedData,
  clearFocus = fn,
  color,
}: UText_) {
  const [text, setText] = useReactive(data)
  const [focus, setFocus] = useReactiveObject(initialFocus)
  const ref = useRef<HTMLDivElement>(null)

  const [linkAddress, setLinkAddress] = useState('')
  const [linkText, setLinkText] = useState(new LinkText())
  const [linkOffset, setLinkOffset] = useState(new LinkOffset())

  const splitText = (additionalText = '') => {
    const offset = cursorOffset(safe(ref.current))
    if (offset !== text.length) setText(text.slice(0, offset) + additionalText)
    return text.slice(offset)
  }

  useEffect(() => {
    if (!focus) return

    setCursor(
      safe(ref.current),
      focus.xOffset,
      focus.type.includes('start') ? 'forward' : 'backward',
      focus.type.includes('integer') ? 'symbol' : 'pixel',
    )
  }, [JSON.stringify(focus)])

  useEffect(() => {
    if (!text) return
    if (isFactory) addNewBlock('focus-end', text)
    tryToChangeFieldType(text)
  }, [text])

  const onTextChange = useRefCallback((e) => setText(e.target.value.replaceAll('&amp;', '&').replaceAll('&nbsp;', ' ')))
  const onBlur = useRefCallback(() => {
    const t = text.replaceAll('&amp;', '&').replaceAll(/<\/?span>/gm, '')
    if (t !== data) setData(t)
  }, [text])

  useEffect(() => {
    addInfo({ data: text, type, offset })
  }, [text, type, offset])

  useEffect(() => {
    if (appendedData) {
      setText(text + appendedData)
      setData(text + appendedData) // if set only data focus crashes
    }
  }, [appendedData])

  const onBlockKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const sRef = safe(ref.current)

      const atStart = cursorOffset(sRef) === 0
      handleKeyDown(e, atStart)
      if (atStart && e.key === 'Tab' && type === 'text' && !e.shiftKey) {
        e.preventDefault()
        const data: UListDTO = { text, offset: 1 }
        setType('list', JSON.stringify(data), 'start')
      }

      if (type !== 'code') {
        if (!e.shiftKey && e.key === 'Enter') {
          e.preventDefault()
          if (isFactory) addNewBlock('no-focus')
          else if (onTitleEnter) {
            onTitleEnter()
          } else {
            const isList = isUListComponent(type)
            const newText = splitText()
            if (isList) {
              const data: UListDTO = { text: newText, offset }
              addNewBlock('focus-start', JSON.stringify(data), type)
            } else addNewBlock('focus-start', newText, 'text')
          }
        } else if (e.key === 'Backspace' && !cursorOffset(sRef)) {
          e.preventDefault()
          if (isFactory) onFactoryBackspace()
          else deleteBlock(text)
        }

        if (e.metaKey || e.ctrlKey) {
          if (e.altKey || e.shiftKey) {
            if ('0º'.includes(e.key)) setType('text', text)
            else if ('1¡'.includes(e.key)) setType('heading1', text)
            else if ('2™'.includes(e.key)) setType('heading2', text)
            else if ('3£'.includes(e.key)) setType('heading3', text)
          }

          if (e.key === 'b') toggleTagMutable(sRef, 'b')
          else if (e.shiftKey && e.key === 's') toggleTagMutable(sRef, 's')
          else if (e.key === 'u') toggleTagMutable(sRef, 'u')
          else if (e.key === 'i') toggleTagMutable(sRef, 'i')
          else if (e.key === 'e') toggleTagMutable(sRef, 'code')
          else if (e.key === 'k' && selectedText().length) {
            e.preventDefault()
            e.stopPropagation()
            setText(toggleTags(sRef, 'span', 'a'))
            setLinkAddress('')
            setLinkText(cursorOffsetAndSelection(sRef))
            setLinkOffset(selectionCoordinates(sRef))
          }
        }
      }

      if (!arrowNavigation) return
      const { isTop, isBottom, x } = relativeDimensions(component, ref.current?.getBoundingClientRect())
      if (e.key === 'ArrowLeft') {
        if (!cursorOffset(sRef)) arrowNavigation.up()
      } else if (e.key === 'ArrowRight') {
        if (cursorOffset(sRef) === unhighlight(text).length) arrowNavigation.down()
      } else if (e.key === 'ArrowUp') {
        if (isTop) {
          e.preventDefault()
          e.stopPropagation()
          arrowNavigation.up(x)
        }
      } else if (e.key === 'ArrowDown') {
        if (isBottom || !text.length) {
          e.preventDefault()
          e.stopPropagation()
          arrowNavigation.down(x)
        }
      }
    },
    [text, arrowNavigation, handleKeyDown, type],
  )

  const insertLink = () => {
    if (!linkAddress) {
      setText(removeTag(text, 'span'))
    } else setText(replaceTag(text, 'span', `a href=${linkAddress} target="_blank"`))

    setLinkText({ text: '', offset: 0 })
    setFocus({ type: 'start-integer', xOffset: linkText.text.length + linkText.offset })
    setLinkOffset(new LinkOffset())
  }

  const onLinkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'Escape') return
    e.preventDefault()
    e.stopPropagation()
    insertLink()
  }

  const theme = useTheme()

  useEffect(() => {
    const cleanUps: Fn[] = []
    safe(ref.current)
      .querySelectorAll('a')
      .forEach((n) => {
        const click = () => window.open(n.getAttribute('href') || '', '_blank')
        n.addEventListener('click', click)
        cleanUps.push(() => n.removeEventListener('click', click))
      })
    return () => cleanUps.forEach((f) => f())
  })

  useMount(() => {
    const sRef = safe(ref.current)

    const onPaste = (event: ClipboardEvent) => {
      event.preventDefault()
      const image = event.clipboardData?.files[0] || event.clipboardData?.getData('image/png')
      if (image) {
        const dto: UImageFileDTO = { src: srcfy(image as File), isNew: true, width: 900 }
        addNewBlock('no-focus', JSON.stringify(dto), 'image')
      } else {
        const paste = event.clipboardData?.getData('text') || ''
        if (!paste) return
        const blocks = safeSplit(paste.replaceAll('\r', ''), '\n\n')
        const offset = cursorOffset(sRef)
        if (blocks.length === 1) setText(text.slice(0, offset) + blocks[0] + text.slice(offset))
        else addNewBlock('focus-end', blocks.slice(1).join('\n\n') + splitText(blocks[0]))
      }
    }

    sRef.addEventListener('paste', onPaste)
    return () => sRef.removeEventListener('paste', onPaste)
  })

  let sx: JSObject = {
    [alwaysShowPlaceholder ? ':empty:before' : ':focus:empty:before']: {
      content: 'attr(placeholder)',
      color: theme.palette.text.secondary,
      cursor: 'text',
    },
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
  if (type === 'quote') sx = { ...sx, paddingLeft: '2rem' }
  if (color) sx = { ...sx, color }
  return (
    <Styles sx={{ position: 'relative' }} onClick={clearFocus}>
      {!!linkOffset.b && (
        <ClickAwayListener onClickAway={insertLink}>
          <Paper
            elevation={8}
            sx={{
              width: '20rem',
              padding: '1rem',
              position: 'absolute',
              top: linkOffset.b,
              left: linkOffset.x - (20 * 16) / 2,
            }}
          >
            <TextField
              value={linkAddress}
              onChange={(e) => setLinkAddress(e.target.value)}
              onKeyDown={onLinkKeyDown}
              variant="standard"
              placeholder="Type link address"
              fullWidth
              autoFocus
            />
          </Paper>
        </ClickAwayListener>
      )}
      <Editable
        innerRef={ref}
        html={text.replaceAll('&', '&amp;')}
        tagName={component}
        onBlur={onBlur}
        onChange={onTextChange}
        placeholder={placeholder}
        sx={sx}
        disabled={readonly}
        role="textbox"
        onKeyDown={onBlockKeyDown}
        data-cy="utext"
      />
    </Styles>
  )
}

const Styles = styled(Box)(({ theme }) => ({
  width: '100%',

  a: {
    color: _apm(theme, '800'),
    cursor: 'pointer',
    textUnderlineOffset: '0.2rem',
  },

  code: {
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: theme.palette.info.main,
    backgroundColor: alpha(theme.palette.info.light, 0.25),
    padding: '0.2rem 0.3rem',
    borderRadius: '0.4rem',
  },

  span: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.info.light,
    padding: '0.2rem 0.3rem',
    borderRadius: '0.4rem',
  },

  h1: { fontSize: '1.75rem', paddingBottom: '1.5rem' },
  h2: { fontSize: '1.25rem', paddingBottom: '1.5rem' },
  h3: { fontSize: '1rem', paddingBottom: '1.375rem' },
  h4: { fontSize: '0.875rem', paddingBottom: '1.25rem' },
  pre: { fontSize: '1rem', paddingBottom: '1rem' },

  [`${theme.breakpoints.up('sm')}`]: {
    h1: { fontSize: '3.5rem', paddingBottom: '2rem' },
    h2: { fontSize: '2.5rem', paddingBottom: '2rem' },
    h3: { fontSize: '2rem', paddingBottom: '1.75rem' },
    h4: { fontSize: '1.75rem', paddingBottom: '1.5rem' },
    pre: { fontSize: '1.5rem', paddingBottom: '1rem' },
  },
}))

const Editable = styled(ContentEditable, { label: 'ContentEditable ' })(({ theme }) => ({
  width: '100%',
  margin: 0,

  outline: 'none',
  fontFamily: theme.typography.fontFamily,
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',
}))

class LinkText {
  offset = 0
  text = ''
}

class LinkOffset {
  x = 0
  b = 0
}
