import { alpha, Box, styled, useTheme } from '@mui/material'
import _ from 'lodash'
import { useEffect, useRef, KeyboardEvent, useState, memo } from 'react'
import ContentEditable from 'react-contenteditable'
import { safeSplit } from '../../../utils/algorithms'
import { srcfy } from '../../../utils/filesManipulation'
import { bool, DivRef, fn, Fn, JSObject, num, SetNum, SetStr, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { _apm } from '../../application/theming/theme'
import { unhighlight } from '../../../utils/unhighlight'
import { useMount, useReactive, useReactiveObject } from '../../utils/hooks/hooks'
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
import { isUListBlock, TeX, TexMapRef, UBlockType } from '../types'
import { UImageFileDTO } from '../UFile/UImageFile/UImageFile'
import { sanitize } from './sanitazer'
import { UListDTO, UText } from './types'
import { coloredTextSX, useLastUsedColor, UTextOptions } from './UTextOptions/UTextOptions'
import { ToggleTex, useTex } from './UTextOptions/UTextInlineEditors/UTextTexEditor'
import { useLinks } from './UTextOptions/UTextInlineEditors/UTextLinkEditor'
import { useMenuB } from '../../utils/UMenu/useMenuB'
import { BlockAutocomplete } from '../UBlock/BlockAutocomplete/BlockAutocomplete'
import { getUTextStyles } from './utextStyles'

function UText__(ps: UText_) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef(new Map<str, TeX>())

  const { text, onBlur, onTextChange, setText } = useText(ps, ref, mapRef)
  const { setFocus, refocus } = useFocus(ps, ref)
  const texProps = useTex(mapRef, ps, text, setText, setFocus, refocus, ref)
  const { toggleTex } = texProps
  const linkProps = useLinks(text, setText, setFocus, ps.setData, ref)
  const { toggleLink } = linkProps
  const autocompletePs = useAutocomplete(ps, text, toggleTex, ref)
  const kdPs = useKeyDown(ps, text, setText, autocompletePs.openAutocomplete, mapRef, toggleLink, toggleTex, ref)
  const { sx } = useSX(ps, text)

  useTextMount(ps, text, setText, autocompletePs.openAutocomplete, kdPs.splitText, ref)

  useEffect(() => {
    if (ps.focusIfEmpty) ref.current?.focus()
  }, [ps.focusIfEmpty])

  let html = text.replaceAll('&', '&amp;')
  if (html.trim().endsWith('</code>')) html += '&nbsp;'
  return (
    <Styles sx={{ position: 'relative' }} onClick={ps.resetActiveBlock}>
      {!ps.hideMenus && <UTextOptions textRef={ref} linkEditorPs={linkProps} texEditorPs={texProps} />}
      {!ps.hideMenus && <BlockAutocomplete {...autocompletePs} context={ps.inUForm ? 'uform' : 'general'} />}
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

export interface UText_ extends UText {
  component: str
  hidePlaceholder?: bool
  handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>, atStart?: bool) => void
  offset?: num
  color?: str
  focusIfEmpty?: bool
}

function useText(ps: UText_, ref: DivRef, mapRef: TexMapRef) {
  const [text, setText] = useReactive(ps.data)

  useEffect(() => {
    if (!text) return
    if (ps.isFactory) {
      ps.addNewBlock(ps.id, 'focus-end', text)
    } else {
      if (!text.includes(' ')) return

      const firstElement = text.split(' ')
      const newType = regexAndType.get(firstElement[0])
      if (!newType) return

      ps.setType(newType)
    }
  }, [text])

  const onTextChange = useRefCallback((e) => setText(e.target.value.replaceAll('&amp;', '&').replaceAll('&nbsp;', ' ')))
  const onBlur = useRefCallback(() => {
    const t = sanitize(text, mapRef)
    if (t !== ps.data) {
      ps.setData(t)
      ps.addInfo?.(ps.id, {
        type: ps.type,
        data: t,
        offset: ps.offset,
        scrollTo: () => ref.current?.scrollIntoView({ behavior: 'smooth' }),
        i: ps.i,
      })
    }
  }, [text])

  useEffect(() => {
    if (ps.addInfo)
      ps.addInfo(ps.id, {
        scrollTo: () => ref.current?.scrollIntoView({ behavior: 'smooth' }),
        type: ps.type,
        data: sanitize(text, mapRef),
        offset: ps.offset,
        i: ps.i,
      })
  }, [ps.id, ps.type, ps.offset])

  useEffect(() => {
    if (ps.appendedData) {
      setText(text + ps.appendedData)
      ps.setData(sanitize(text + ps.appendedData, mapRef)) // if set only data focus crashes
    }
  }, [ps.appendedData])

  return { text, setText, onTextChange, onBlur }
}
const symbolLength = (text: str) => unhighlight(replaceAllCodeToNothing(text)).length

function useAutocomplete(ps: UText_, text: str, toggleTex: ToggleTex, ref: DivRef) {
  const [offsetBeforeOpen, setOffsetBeforeOpen] = useState(-1)
  const menu = useMenuB(fn, (exit) => {
    if (exit === 'esc') {
      setCursor(safe(ref.current), offsetBeforeOpen, 'forward', 'symbol')
    }
  })
  const [coordinates, setCoordinates] = useState(new Coordinates())

  const createBlock = (t: UBlockType) => {
    if (t === 'inline-equation') {
      setCursor(safe(ref.current), offsetBeforeOpen, 'forward', 'symbol')
      toggleTex(offsetBeforeOpen, { removeSlash: true })
    } else if (text.trim().length > 1) ps.addNewBlock(ps.id, undefined, undefined, t)
    else ps.setType(t)
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
    if (offset !== symbolLength(text)) {
      const textWhichStaysInThisBlock = sliceHtml(text, offset)
      setText(textWhichStaysInThisBlock + additionalText)
      nextTextBlockBoundary = textWhichStaysInThisBlock.length
    }
    return sanitize(text.slice(nextTextBlockBoundary), mapRef)
  }

  const onBlockKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const sRef = safe(ref.current)
      const offset = cursorOffset(sRef)
      const atStart = offset === 0
      if (ps.handleKeyDown) ps.handleKeyDown(e, atStart)

      // setTimeout - otherwise autocomplete intercepts /, + 1 to include /
      if (e.key === '/' && !ps.hideMenus) setTimeout(() => openAutocomplete(offset + 1))

      if (atStart && e.key === 'Tab' && ps.type === 'text' && !e.shiftKey) {
        e.preventDefault()
        const data: UListDTO = { text, offset: 1 }
        ps.setType('list', JSON.stringify(data), 'start')
      }

      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        if (ps.isFactory) ps.addNewBlock('', 'no-focus')
        else if (ps.onTitleEnter) ps.onTitleEnter()
        else {
          const isList = isUListBlock(ps.type)
          const newText = splitText()
          if (isList) {
            const data: UListDTO = { text: newText, offset: ps.offset || 1 }
            ps.addNewBlock(ps.id, 'focus-start', JSON.stringify(data), ps.type)
          } else ps.addNewBlock(ps.id, 'focus-start', newText, 'text')
        }
      } else if (e.key === 'Backspace' && !offset) {
        e.preventDefault()
        if (ps.isFactory) ps.onFactoryBackspace?.()
        else ps.deleteBlock?.(ps.id, text)
      } else if (e.key === 'Backspace' && offset - 1 === symbolLength(text)) {
        // - 1 due to &nbsp;
        // if tex goes at the end of a block it causes issues with focus
        e.preventDefault()
        setText(replaceAllCodeToNothing(text))
      }

      if (e.metaKey || e.ctrlKey) {
        if (e.altKey || e.shiftKey) {
          if ('0º'.includes(e.key)) ps.setType('text', text)
          else if ('1¡'.includes(e.key)) ps.setType('heading-1', text)
          else if ('2™'.includes(e.key)) ps.setType('heading-2', text)
          else if ('3£'.includes(e.key)) ps.setType('heading-3', text)
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
    [text, ps.goUp, ps.goDown, ps.handleKeyDown, ps.type, openAutocomplete],
  )
  return { onBlockKeyDown, splitText }
}

function useSX(ps: UText_, text: str): JSObject {
  const theme = useTheme()

  let sx: JSObject = {
    [ps.hidePlaceholder ? ':focus:empty:before' : ':empty:before']: {
      content: 'attr(placeholder)',
      color: theme.palette.text.secondary,
      cursor: 'text',
    },
  }

  if (ps.isCardField) {
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

  sx = ps.isFactory && ps.hidePlaceholder ? { ...sx, minHeight: '12rem' } : sx
  if (ps.type === 'quote') sx = { ...sx, paddingLeft: '2rem' }
  if (ps.color) sx = { ...sx, color: ps.color }
  sx = { ...sx, ...coloredTextSX(theme.isDark()) }

  return { sx }
}

function useFocus(ps: UText_, ref: DivRef) {
  const [focus, setFocus] = useReactiveObject(ps.focus)
  useEffect(() => {
    if (!focus) return

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
      return { ...old, forceUpdate: true }
    })

  return { focus, setFocus, refocus }
}

function useTextMount(
  ps: UText_,
  text: str,
  setText: SetStr,
  openAutocomplete: SetNum,
  splitText: (t?: str) => void,
  ref: DivRef,
) {
  useMount(() => {
    // ps.initialData === text - component mounts twice (why?) -> autocomplete opens twice
    if (ps.initialData === '/' && ps.initialData === text) openAutocomplete(1)
    ps.addInfo?.(ps.id, {
      data: ps.data,
      type: ps.type,
      offset: ps.offset,
      i: ps.i,
      scrollTo: () => ref.current?.scrollIntoView({ behavior: 'smooth' }),
    })

    const sRef = safe(ref.current)
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault()
      const image = e.clipboardData?.files[0] || e.clipboardData?.getData('image/png')
      if (image) {
        const dto: UImageFileDTO = { src: srcfy(image as File), isNew: true, width: 900 }
        ps.addNewBlock(ps.id, 'no-focus', JSON.stringify(dto), 'image')
      } else {
        const paste = e.clipboardData?.getData('text') || ''
        if (!paste) return
        const blocks = safeSplit(paste.replaceAll('\r', ''), '\n\n')
        const offset = cursorOffset(sRef)
        if (blocks.length === 1) setText(text.slice(0, offset) + blocks[0] + text.slice(offset))
        else ps.addNewBlock(ps.id, 'focus-end', blocks.slice(1).join('\n\n') + splitText(blocks[0]))
      }
    }

    sRef.addEventListener('paste', onPaste)
    return () => sRef.removeEventListener('paste', onPaste)
  })
}

export const UText_ = memo(UText__, (prev, cur) => _.isEqual(prev, cur))

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
    fontStyle: 'normal',
  },

  ...getUTextStyles(theme.breakpoints.up('sm')),
}))

const Editable = styled(ContentEditable, { label: 'ContentEditable ' })(({ theme }) => ({
  width: '100%',
  margin: 0,

  outline: 'none',
  fontFamily: theme.typography.fontFamily,
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',
}))

class Coordinates {
  x = 0
  b = 0
}

const regexAndType = new Map<str, UBlockType>([
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
