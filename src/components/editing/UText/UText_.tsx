import { alpha, Box, styled, useTheme } from '@mui/material'
import { useEffect, useRef, KeyboardEvent, useState } from 'react'
import { safeSplit } from '../../../utils/algorithms'
import { srcfy } from '../../../utils/filesManipulation'
import { bool, DivRef, f, Fn, JSObject, num, SetNum, SetStr, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { _apm } from '../../application/theming/theme'
import { unhighlight } from '../../../utils/unhighlight'
import { useIsSM, useMount, useReactive } from '../../utils/hooks/hooks'
import { useRefCallback } from '../../utils/hooks/useRefCallback'
import { sliceHtml, replaceAllCodeToNothing } from '../../utils/Selection/htmlAsStr'
import {
  cursorOffset,
  relativeDimensions,
  selectedText,
  selectionCoordinates,
  setCursor,
  toggleEmClass,
  toggleTagMutable,
} from '../../utils/Selection/selection'
import { TeX, TexMapRef } from '../types'
import { sanitize } from './sanitazer'
import { UText } from './types'
import { coloredTextSX, useLastUsedColor, UTextOptions } from './UTextOptions/UTextOptions'
import { ToggleTex, useTex } from './UTextOptions/UTextInlineEditors/UTextTexEditor'
import { useLinks } from './UTextOptions/UTextInlineEditors/UTextLinkEditor'
import { useMenuB } from '../../utils/UMenu/useMenuB'
import { BlockAutocomplete } from '../UPage/UBlock/BlockAutocomplete/BlockAutocomplete'
import { Editable, getUTextStyles } from './utextStyles'
import { UBlockType } from '../UPage/ublockTypes'

export interface UText_ extends UText {
  component: str
  hidePlaceholder?: bool
  offset?: num
  color?: str
  focusIfEmpty?: bool
}

export function UText_(ps: UText_) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef(new Map<str, TeX>())

  const { text, onBlur, onTextChange, setText } = useText(ps, mapRef)
  const { focus, refocus, setFocus } = useFocus(ps, ref)
  const texProps = useTex(mapRef, ps, text, setText, setFocus, refocus, ref)
  const { toggleTex } = texProps
  const linkProps = useLinks(ps.id, text, setText, setFocus, ps.setData, ref)
  const { toggleLink } = linkProps
  const autocompletePs = useAutocomplete(ps, text, toggleTex, ref)
  const kdPs = useKeyDown(ps, text, setText, autocompletePs.openAutocomplete, mapRef, toggleLink, toggleTex, ref)
  const { sx } = useSX(ps)

  useTextMount(ps, text, setText, kdPs.splitText, ref)

  useEffect(() => {
    if (ps.data === '/' && focus?.id === ps.id && focus.fresh) autocompletePs.openAutocomplete(1)
  }, [focus])

  useEffect(() => {
    if (ps.focusIfEmpty) ref.current?.focus()
  }, [ps.focusIfEmpty])

  let html = text.replaceAll('&', '&amp;')
  if (html.trim().endsWith('</code>')) html += '&nbsp;'

  return (
    <Styles sx={{ position: 'relative' }} onClick={ps.resetActiveBlock}>
      <UTextOptions textRef={ref} linkEditorPs={linkProps} texEditorPs={texProps} />
      <BlockAutocomplete {...autocompletePs} context={ps.context} />
      <Editable
        innerRef={ref}
        html={html}
        tagName={ps.component}
        onBlur={onBlur}
        onChange={onTextChange}
        placeholder={ps.placeholder}
        sx={sx}
        disabled={ps.readonly}
        role="textbox"
        onKeyDown={kdPs.onBlockKeyDown}
        data-cy="utext"
      />
    </Styles>
  )
}

function useText(ps: UText_, mapRef: TexMapRef) {
  const [text, setText] = useReactive(ps.data as str)

  useEffect(() => {
    if (!text) return
    if (!text.includes(' ')) return

    const firstElement = text.split(' ')
    const newType = shorthandAndType.get(firstElement[0])
    if (!newType) return

    ps.setType(ps.id, newType, sanitize(text, mapRef))
  }, [text])

  const onTextChange = useRefCallback((e) => setText(e.target.value.replaceAll('&amp;', '&').replaceAll('&nbsp;', ' ')))
  const onBlur = useRefCallback(() => {
    const t = sanitize(text, mapRef)
    if (t !== ps.data) ps.setData(ps.id, t)
  }, [text])

  return { text, setText, onTextChange, onBlur }
}
const symbolLength = (text: str) => unhighlight(replaceAllCodeToNothing(text)).length

function useAutocomplete(ps: UText_, text: str, toggleTex: ToggleTex, ref: DivRef) {
  const [offsetBeforeOpen, setOffsetBeforeOpen] = useState(-1)
  const menu = useMenuB(f, (exit) => {
    if (exit === 'esc') {
      setCursor(safe(ref.current), offsetBeforeOpen, 'forward', 'symbol')
    }
  })
  const [coordinates, setCoordinates] = useState(new Coordinates())

  const createBlock = (t: UBlockType) => {
    if (t === 'inline-equation') {
      setCursor(safe(ref.current), offsetBeforeOpen, 'forward', 'symbol')
      toggleTex(offsetBeforeOpen, { removeSlash: true })
    } else if (text.trim().length > 1) ps.addUBlock(ps.id, t)
    else ps.setType(ps.id, t)
  }

  const openAutocomplete = (offset: num) => {
    setOffsetBeforeOpen(offset)
    setCoordinates(selectionCoordinates(safe(ref.current)))
    menu.open()
  }

  return { menu, coordinates, createBlock, openAutocomplete }
}

function useKeyDown(
  ps: UText_,
  text: str,
  setText: SetStr,
  openAutocomplete: SetNum,
  mapRef: TexMapRef,
  toggleLink: Fn,
  toggleTex: SetNum,
  ref: DivRef,
) {
  const { lastUsedColorClass } = useLastUsedColor()

  const splitText = (additionalText = '') => {
    const offset = cursorOffset(safe(ref.current))
    let nextTextBlockBoundary = offset
    let textAbove = text
    if (offset !== symbolLength(text)) {
      const textWhichStaysInThisBlock = sliceHtml(text, offset)
      const newText = textWhichStaysInThisBlock + additionalText

      setText(newText)
      textAbove = sanitize(newText, mapRef)
      nextTextBlockBoundary = textWhichStaysInThisBlock.length
    }
    const textBelow = sanitize(text.slice(nextTextBlockBoundary), mapRef)
    return { textBelow, textAbove }
  }

  const onBlockKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const sRef = safe(ref.current)
      const offset = cursorOffset(sRef)
      const atStart = offset === 0

      // setTimeout - otherwise autocomplete intercepts /, + 1 to include /
      if (e.key === '/') setTimeout(() => openAutocomplete(offset + 1))

      if (atStart && e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) ps.onUTextShiftTab(ps.id, sanitize(text, mapRef))
        else ps.onUTextTab(ps.id, sanitize(text, mapRef))
      }

      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        const { textAbove, textBelow } = splitText()
        ps.onUTextEnter(textAbove, textBelow, ps.id)
      } else if (e.key === 'Backspace' && !offset) {
        e.preventDefault()
        ps.onUTextBackspace(ps.id, sanitize(text, mapRef))
      } else if (e.key === 'Backspace' && offset - 1 === symbolLength(text)) {
        // - 1 due to &nbsp;
        // if tex goes at the end of a block it causes issues with focus
        e.preventDefault()
        setText(replaceAllCodeToNothing(text))
      }

      if (e.metaKey || e.ctrlKey) {
        if (e.altKey || e.shiftKey) {
          if ('0º'.includes(e.key)) ps.setType(ps.id, 'text', sanitize(text, mapRef))
          else if ('1¡'.includes(e.key)) ps.setType(ps.id, 'heading-1', sanitize(text, mapRef))
          else if ('2™'.includes(e.key)) ps.setType(ps.id, 'heading-2', sanitize(text, mapRef))
          else if ('3£'.includes(e.key)) ps.setType(ps.id, 'heading-3', sanitize(text, mapRef))
        }

        if (e.shiftKey && 'Ee'.includes(e.key)) {
          toggleTex(offset) // shift is necessary, meta + shift + e = e (!E)
          return
        }

        if (!selectedText().length) return
        e.preventDefault() // prevent chrome action

        if (e.key === 'b') toggleTagMutable(sRef, 'b')
        else if ('Ss'.includes(e.key)) toggleTagMutable(sRef, 's')
        else if (e.key === 'u') toggleTagMutable(sRef, 'u')
        else if (e.key === 'i') toggleTagMutable(sRef, 'i')
        else if (e.key === 'e') toggleTagMutable(sRef, 'mark')
        else if ('Hh'.includes(e.key)) toggleEmClass(sRef, lastUsedColorClass)
        else if (e.key === 'k') toggleLink()
      }

      if (!ps.goUp || !ps.goDown) return
      const { isTop, isBottom, x } = relativeDimensions(ps.component, ref.current?.getBoundingClientRect())
      if (e.key === 'ArrowLeft') {
        if (!offset) ps.goUp(ps.id)
      } else if (e.key === 'ArrowRight') {
        if (offset === unhighlight(replaceAllCodeToNothing(text)).length) ps.goDown(ps.id)
      } else if (e.key === 'ArrowUp') {
        if (isTop) {
          e.preventDefault()
          e.stopPropagation()
          ps.goUp(ps.id, x)
        }
      } else if (e.key === 'ArrowDown') {
        if (isBottom || !text.length) {
          e.preventDefault()
          e.stopPropagation()
          ps.goDown(ps.id, x)
        }
      }
    },
    [text, ps.goUp, ps.goDown, openAutocomplete],
  )
  return { onBlockKeyDown, splitText }
}

function useSX(ps: UText_): JSObject {
  const theme = useTheme()

  let sx: JSObject = {
    [ps.hidePlaceholder ? ':focus:empty:before' : ':empty:before']: {
      content: 'attr(placeholder)',
      color: theme.palette.text.secondary,
      cursor: 'text',
    },
  }

  const isSM = useIsSM()

  if (ps.type === 'quote') sx = { ...sx, paddingLeft: isSM ? '2rem' : '1rem' }
  if (ps.color) sx = { ...sx, color: ps.color }
  sx = { ...sx, ...coloredTextSX(theme.isDark()) }

  return { sx }
}

function useFocus(ps: UText_, ref: DivRef) {
  const [focus, setFocus] = ps.focusS

  useEffect(() => {
    if (!focus || focus.id !== ps.id) return

    setCursor(
      safe(ref.current),
      focus.xOffset,
      focus.type.includes('start') ? 'forward' : 'backward',
      focus.type.includes('integer') ? 'symbol' : 'pixel',
    )
  }, [focus])

  const refocus = () =>
    setFocus((old) => {
      if (!old) return old
      return { ...old }
    })

  return { focus, setFocus, refocus }
}

function useTextMount(
  ps: UText_,
  text: str,
  setText: SetStr,
  splitText: (t?: str) => { textAbove: str; textBelow: str },
  ref: DivRef,
) {
  useMount(() => {
    const sRef = safe(ref.current)
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault()
      const image = e.clipboardData?.files[0] || e.clipboardData?.getData('image/png')
      if (image) {
        ref.current?.blur()
        ps.onUTextPaste(srcfy(image as File), ps.id, 'image')
      } else {
        const paste = e.clipboardData?.getData('text') || ''
        if (!paste) return
        const blocks = safeSplit(paste.replaceAll('\r', ''), '\n\n')
        const offset = cursorOffset(sRef)
        if (blocks.length === 1) setText(text.slice(0, offset) + blocks[0] + text.slice(offset))
        else {
          ref.current?.blur()
          ps.onUTextPaste(blocks.slice(1).join('\n\n') + splitText(blocks[0]).textBelow, ps.id, 'text') // why slice(1) ?
        }
      }
    }

    sRef.addEventListener('paste', onPaste)
    return () => sRef.removeEventListener('paste', onPaste)
  })
}

const Styles = styled(Box)(({ theme }) => ({
  width: '100%',

  a: {
    color: _apm(theme, '800'),
    cursor: 'pointer',
    textUnderlineOffset: '0.2rem',
  },
  // latex code
  code: {
    cursor: 'text',
  },

  'code.active': {
    backgroundColor: alpha(theme.palette.info.light, 0.25),
    borderRadius: '0.4rem',
    padding: '0.5rem 0.3rem',
  },
  // actual code
  mark: {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.light, 0.25),
    padding: '0.2rem 0.3rem',
    borderRadius: '0.4rem',
  },
  // selection when unfocused
  strong: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.info.light,
    padding: '0.2rem 0.3rem',
    borderRadius: '0.4rem',
    fontWeight: '400',
  },
  // colored text
  em: {
    fontStyle: 'inherit',
  },

  ...getUTextStyles(theme.breakpoints.up('sm')),
}))

class Coordinates {
  x = 0
  b = 0
}

const shorthandAndType = new Map<str, UBlockType>([
  ['#', 'heading-1'],
  ['##', 'heading-2'],
  ['###', 'heading-3'],
  ['{}', 'short-answer'],
  ['[]', 'multiple-choice'],
  ['()', 'single-choice'],
  ['{ }', 'long-answer'],
  ['*', 'bullet-list'],
  ['1.', 'numbered-list'],
])

// DEBUG MOUSE
// document.onmousemove = function (e) { var x = e.pageX; var y = e.pageY; e.target.title = "X is " + x + " and Y is " + y; };
