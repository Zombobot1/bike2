import { alpha, Box, ClickAwayListener, Paper, styled, useTheme } from '@mui/material'
import _ from 'lodash'
import { useEffect, useRef, KeyboardEvent, useState, memo, RefObject } from 'react'
import ContentEditable from 'react-contenteditable'
import { safeSplit } from '../../../utils/algorithms'
import { srcfy } from '../../../utils/filesManipulation'
import { bool, Fn, JSObject, num, SetNum, SetStr, str } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { _apm } from '../../application/theming/theme'
import { unhighlight } from '../../utils/CodeEditor/highlight'
import { renderTex } from '../../utils/CodeEditor/renderTex'
import { TeXEditor } from '../../utils/CodeEditor/TeXEditor'
import { useMount, useReactiveObject } from '../../utils/hooks/hooks'
import { useRefCallback } from '../../utils/hooks/useRefCallback'
import { TextInput } from '../../utils/MuiUtils'
import {
  removeCode,
  removeTag,
  replaceCode,
  replaceTag,
  codeOffset,
  sliceHtml,
  htmlToElement,
  replaceAllCodeToHTML,
  replaceAllCodeToTex,
  replaceAllCodeToNothing,
} from '../../utils/Selection/htmlAsStr'
import {
  cursorOffset,
  cursorOffsetAndSelection,
  insertCode,
  relativeDimensions,
  selectedText,
  selectionCoordinates,
  setCursor,
  toggleTagMutable,
  toggleTags,
} from '../../utils/Selection/selection'
import { isUListComponent, UTextFocus } from '../types'
import { UImageFileDTO } from '../UFile/UImageFile/UImageFile'
import { UListDTO, UText } from './types'

function UText__(ps: UText_) {
  // useDebugInformation(ps.id, ps)
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef(new Map<str, TeX>())

  const { text, onBlur, onTextChange, setText } = useText(ps, mapRef)
  const { setFocus, refocus } = useFocus(ps, ref)
  const texProps = useTex(mapRef, ps, text, setText, setFocus, refocus, ref)
  const linkProps = useLinks(text, setText, setFocus, ref)
  const { toggleLink } = linkProps
  const { onBlockKeyDown, splitText } = useKeyDown(ps, text, setText, mapRef, toggleLink, texProps.toggleTex, ref)
  const { sx } = useSX(ps, text)

  useTextMount(ps, text, setText, splitText, ref)

  let html = text.replaceAll('&', '&amp;')
  if (html.trim().endsWith('</code>')) html += '&nbsp;'
  return (
    <Styles sx={{ position: 'relative' }} onClick={ps.clearFocus}>
      {!!linkProps.activeLink.b && (
        <ClickAwayListener onClickAway={linkProps.insertLink}>
          <Paper
            elevation={8}
            sx={{
              width: '20rem',
              padding: '1rem',
              position: 'absolute',
              top: linkProps.activeLink.b,
              left: linkProps.activeLink.x - (20 * 16) / 2,
            }}
          >
            <TextInput
              value={linkProps.activeLink.address}
              onChange={(e) => linkProps.setLink(e.target.value)}
              onKeyDown={linkProps.onLinkKeyDown}
              variant="standard"
              placeholder="Type link address"
              fullWidth
              autoFocus
            />
          </Paper>
        </ClickAwayListener>
      )}
      {!!texProps.activeTex.id && (
        <TexBox
          sx={{
            top: texProps.activeTex.b,
            left: texProps.activeTex.x - 400 / 16 / 2,
          }}
          data-cy="tex-box"
        >
          <TeXEditor
            tex={texProps.activeTex.tex}
            setTex={texProps.updateTex}
            close={texProps.saveTex}
            type="small"
            readonly={ps.readonly}
          />
        </TexBox>
      )}
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
        onKeyDown={onBlockKeyDown}
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
}

type TeX = { tex: str; html: str; wasUpdated?: bool }
type MapRef = React.MutableRefObject<Map<str, TeX>>
function useText(ps: UText_, mapRef: MapRef) {
  const [text, setText] = useState(ps.data)

  useEffect(() => {
    if (!text) return
    if (ps.isFactory) ps.addNewBlock(ps.id, 'focus-end', text)
    ps.tryToChangeFieldType(text)
  }, [text])

  const onTextChange = useRefCallback((e) => setText(e.target.value.replaceAll('&amp;', '&').replaceAll('&nbsp;', ' ')))
  const onBlur = useRefCallback(() => {
    const t = sanitize(text, mapRef)
    if (t !== ps.data) {
      ps.setData(t)
      ps.addData?.(ps.id, t)
    }
  }, [text])

  useEffect(() => {
    if (ps.addInfo) ps.addInfo(ps.id, { type: ps.type, offset: ps.offset || 0 })
  }, [ps.id, ps.type, ps.offset])

  useEffect(() => {
    if (ps.appendedData) {
      setText(text + ps.appendedData)
      ps.setData(sanitize(text + ps.appendedData, mapRef)) // if set only data focus crashes
    }
  }, [ps.appendedData])

  return { text, setText, onTextChange, onBlur }
}

const sanitize = (text: str, mapRef: MapRef) =>
  replaceAllCodeToTex(text, mapRef.current).replaceAll(/<\/?strong>/gm, '')
const symbolLength = (text: str) => unhighlight(replaceAllCodeToNothing(text)).length

type Ref = RefObject<HTMLDivElement>
function useKeyDown(
  ps: UText_,
  text: str,
  setText: SetStr,
  mapRef: MapRef,
  toggleLink: Fn,
  toggleTex: SetNum,
  ref: Ref,
) {
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

      if (atStart && e.key === 'Tab' && ps.type === 'text' && !e.shiftKey) {
        e.preventDefault()
        const data: UListDTO = { text, offset: 1 }
        ps.setType('list', JSON.stringify(data), 'start')
      }

      if (ps.type !== 'code') {
        if (!e.shiftKey && e.key === 'Enter') {
          e.preventDefault()
          if (ps.isFactory) ps.addNewBlock('', 'no-focus')
          else if (ps.onTitleEnter) ps.onTitleEnter()
          else {
            const isList = isUListComponent(ps.type)
            const newText = splitText()
            if (isList) {
              const data: UListDTO = { text: newText, offset }
              ps.addNewBlock(ps.id, 'focus-start', JSON.stringify(data), ps.type)
            } else ps.addNewBlock(ps.id, 'focus-start', newText, 'text')
          }
        } else if (e.key === 'Backspace' && !offset) {
          e.preventDefault()
          if (ps.isFactory) ps.onFactoryBackspace?.()
          else ps.deleteBlock?.(text)
        } else if (e.key === 'Backspace' && offset - 1 === symbolLength(text)) {
          // - 1 due to &nbsp;
          // if tex goes at the end of a block it causes issues with focus
          e.preventDefault()
          setText(replaceAllCodeToNothing(text))
        }

        if (e.metaKey || e.ctrlKey) {
          if (e.altKey || e.shiftKey) {
            if ('0º'.includes(e.key)) ps.setType('text', text)
            else if ('1¡'.includes(e.key)) ps.setType('heading1', text)
            else if ('2™'.includes(e.key)) ps.setType('heading2', text)
            else if ('3£'.includes(e.key)) ps.setType('heading3', text)
          }

          if (e.key === 'b') toggleTagMutable(sRef, 'b')
          else if (e.shiftKey && e.key === 's') toggleTagMutable(sRef, 's')
          else if (e.key === 'u') toggleTagMutable(sRef, 'u')
          else if (e.key === 'i') toggleTagMutable(sRef, 'i')
          else if (e.key === 'E') toggleTex(offset)
          else if (e.key === 'e') toggleTagMutable(sRef, 'mark')
          else if (e.key === 'k' && selectedText().length) toggleLink()
        }
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
    [text, ps.goUp, ps.goDown, ps.handleKeyDown, ps.type],
  )
  return { onBlockKeyDown, splitText }
}

type SetFocus = (f?: UTextFocus) => void
function useLinks(text: str, setText: SetStr, setFocus: SetFocus, ref: Ref) {
  const [activeLink, setActiveLink] = useState(new ActiveLink())

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

  const insertLink = () => {
    if (!activeLink.address) {
      setText(removeTag(text, 'strong'))
    } else setText(replaceTag(text, 'strong', `a href=${activeLink.address} target="_blank"`))

    setActiveLink(new ActiveLink())
    setFocus({ type: 'start-integer', xOffset: activeLink.text.length + activeLink.offset })
  }

  const toggleLink = () => {
    setActiveLink({
      ...cursorOffsetAndSelection(safe(ref.current)),
      ...selectionCoordinates(safe(ref.current)),
      address: '',
    })
    setText(toggleTags(safe(ref.current), 'strong', 'a'))
  }

  const onLinkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'Escape') return
    e.preventDefault()
    e.stopPropagation()
    insertLink()
  }

  const setLink = (address: str) => setActiveLink((old) => ({ ...old, address }))

  return { activeLink, insertLink, toggleLink, onLinkKeyDown, setLink }
}

function useTex(mapRef: MapRef, ps: UText_, text: str, setText: SetStr, setFocus: SetFocus, refocus: Fn, ref: Ref) {
  const [activeTex, setActiveTex] = useState(new ActiveTex())

  useEffect(() => {
    const el = htmlToElement(`<pre>${ps.data}</pre>`)
    const needRerender = Array.from(el.getElementsByTagName('code'))
      .map((e) => {
        const id = e.getAttribute('data-id') || ''
        if (!mapRef.current.has(id) || mapRef.current.get(id)?.tex !== e.textContent) return e
        return null
      })
      .filter(Boolean) as HTMLElement[]

    needRerender.forEach((e) => {
      const id = e.getAttribute('data-id') || ''
      mapRef.current.set(id, { tex: e.innerHTML, html: renderTex(e.innerHTML) })
    })

    setText(replaceAllCodeToHTML(ps.data, mapRef.current))
    refocus()
  }, [ps.data])

  useEffect(() => {
    const cleanUps: Fn[] = []
    safe(ref.current)
      .querySelectorAll('code')
      .forEach((n) => {
        const id = n.getAttribute('data-id') || ''

        if (id === activeTex.id) n.classList.add('active')
        else n.classList.remove('active')

        const click = () => {
          const { x: px, y: py } = safe(ref.current).getBoundingClientRect()
          const { x, bottom: b } = n.getBoundingClientRect()
          setActiveTex({
            x: x - px - 40,
            b: b - py + 20,
            id,
            tex: mapRef.current.get(id)?.tex || '',
            offset: codeOffset(text, id),
          })
          setFocus(undefined)
        }

        n.addEventListener('click', click)
        cleanUps.push(() => n.removeEventListener('click', click))
      })
    return () => cleanUps.forEach((f) => f())
  })

  const saveTex = (exitedBy: 'click' | 'key' = 'key') => {
    if (mapRef.current.get(activeTex.id)?.wasUpdated) {
      const tex = mapRef.current.get(activeTex.id)?.tex || ''
      const html = mapRef.current.get(activeTex.id)?.html || ''

      let newText = ''
      if (!tex) newText = removeCode(text, activeTex.id)
      else newText = replaceCode(text, activeTex.id, html)
      setText(newText)

      mapRef.current.set(activeTex.id, { tex, html })
      ps.addData?.(ps.id, sanitize(newText, mapRef))
    }
    setActiveTex(new ActiveTex())
    if (exitedBy === 'key') setFocus({ type: 'start-integer', xOffset: activeTex.offset })
  }

  const updateTex = (tex: str) => {
    mapRef.current.set(activeTex.id, { tex, html: renderTex(tex), wasUpdated: true })
    const element = document.querySelectorAll(`[data-id="${activeTex.id}"]`)[0]
    element.innerHTML = mapRef.current.get(activeTex.id)?.html || ''
  }

  const toggleTex = (offset: num) => {
    const id = String(Math.max(...[...Array.from(mapRef.current.keys()), '0'].map(Number)) + 1)
    const { x, b } = selectionCoordinates(safe(ref.current))
    setActiveTex({ id, x, b, offset: offset + 1, tex: selectedText() || '' })
    setText(insertCode(safe(ref.current), id, renderTex(selectedText())))
  }

  return { activeTex, saveTex, updateTex, toggleTex }
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
  return { sx }
}

function useFocus(ps: UText_, ref: Ref) {
  const [focus, setFocus] = useReactiveObject(ps.focus)
  useEffect(() => {
    if (!focus) return

    setCursor(
      safe(ref.current),
      focus.xOffset,
      focus.type.includes('start') ? 'forward' : 'backward',
      focus.type.includes('integer') ? 'symbol' : 'pixel',
    )
  }, [JSON.stringify(focus)])

  const refocus = () =>
    setFocus((old) => {
      if (!old) return old
      return { ...old, forceUpdate: true }
    })

  return { focus, setFocus, refocus }
}

function useTextMount(ps: UText_, text: str, setText: SetStr, splitText: (t?: str) => void, ref: Ref) {
  useMount(() => {
    ps.addData?.(ps.id, ps.data)
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

  code: {
    cursor: 'text',
  },

  'code.active': {
    backgroundColor: alpha(theme.palette.info.light, 0.25),
    borderRadius: '0.4rem',
    padding: '0.5rem 0.3rem',
  },

  mark: {
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.light, 0.25),
    padding: '0.2rem 0.3rem',
    borderRadius: '0.4rem',
  },

  strong: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.info.light,
    padding: '0.2rem 0.3rem',
    borderRadius: '0.4rem',
    fontWeight: '400',
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

const TexBox = styled(Box, { label: 'TexBox' })({ position: 'absolute', zIndex: 2 })

const Editable = styled(ContentEditable, { label: 'ContentEditable ' })(({ theme }) => ({
  width: '100%',
  margin: 0,

  outline: 'none',
  fontFamily: theme.typography.fontFamily,
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',
}))

class ActiveLink {
  x = 0
  b = 0
  offset = 0
  text = ''
  address = ''
}

class ActiveTex {
  x = 0
  b = 0
  offset = 0
  id = ''
  tex = ''
}

// DEBUG MOUSE
// document.onmousemove = function (e) { var x = e.pageX; var y = e.pageY; e.target.title = "X is " + x + " and Y is " + y; };
