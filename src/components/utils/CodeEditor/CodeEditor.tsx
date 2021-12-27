import { useRef, useState, KeyboardEvent, useEffect } from 'react'
import { safe } from '../../../utils/utils'
import { useRefCallback } from '../hooks/useRefCallback'
import { cursorOffset, getCaretRelativeCoordinates, setCursor } from '../Selection/selection'
import { CodeRoot } from './CodeRoot'
import { highlight, programmingLanguages } from './highlight'
import { unhighlight } from '../../../utils/unhighlight'
import { bool, Fn, fn, num, SetStr, str, strs } from '../../../utils/types'
import { Box, Button, styled, Typography } from '@mui/material'
import ContentEditable from 'react-contenteditable'
import { insert } from '../../../utils/algorithms'
import { IBtn } from '../MuiUtils'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { LongMenu, useLongMenu } from '../UMenu/LongMenu'
import { copyText } from '../../../utils/copyText'
import { UTextFocus } from '../../editing/types'
import { useMount } from '../hooks/hooks'

export interface CodeEditor {
  language: str
  code: str
  setCode: SetStr
  setLanguage?: SetStr
  focus?: UTextFocus
  readonly?: bool
  goUp?: (x?: num) => void
  goDown?: (x?: num) => void
  mini?: bool
  onEnter?: Fn
  placeholder?: str
  autoFocus?: bool
}

export function CodeEditor({
  code: initialCode,
  setCode: saveCode,
  language,
  setLanguage = fn,
  readonly,
  goUp,
  goDown,
  focus,
  mini,
  onEnter = fn,
  placeholder,
  autoFocus,
}: CodeEditor) {
  const [code, setCode] = useState(highlight(initialCode, language))
  const [cursorPosition, setCursorPosition] = useState<num | null>(null)

  useEffect(() => {
    setCode(highlight(unhighlight(code), language))
  }, [language])

  useEffect(() => {
    if (cursorPosition !== null) setCursor(safe(ref.current), cursorPosition, 'forward', 'symbol')
  }, [cursorPosition])

  const ref = useRef<HTMLDivElement>(null)
  const onChange = useRefCallback((e) => {
    const cp = cursorOffset(safe(ref.current))
    const newCode = unhighlight(e.target.value)
    setCode(highlight(newCode, language))
    if (mini) saveCode(newCode)
    setCursorPosition(cp)
  })

  const onPaste = useRefCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const cp = cursorOffset(safe(ref.current))
      const newData = e.nativeEvent.clipboardData?.getData('Text') || ''
      const newCode = insert(unhighlight(code), cp, newData)
      setCode(highlight(newCode, language))
      if (mini) saveCode(newCode)
      setCursorPosition(cp + newData.length)
    },
    [code],
  )

  const onBlur = useRefCallback(() => {
    const newCode = unhighlight(code)
    if (newCode !== initialCode) saveCode(newCode)
  }, [code])

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const sRef = safe(ref.current)
      if (e.key === 'Tab') {
        e.preventDefault()
        const cp = cursorOffset(sRef)
        setCode(highlight(insert(unhighlight(code), cp, '  '), language))
        setCursorPosition(cp + 2)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (mini && !e.shiftKey) return onEnter()
        const cp = cursorOffset(sRef)
        setCode(highlight(insert(unhighlight(code), cp, '\n'), language))
        setCursorPosition(cp + 1)
      } else if (e.key === 'Escape') {
        if (mini) return onEnter()
      }

      if (!goUp || !goDown) return

      if (e.key === 'ArrowUp') {
        const cp = cursorOffset(sRef)
        const isTop = cp < unhighlight(code).split('\n')[0]?.length
        if (isTop) {
          e.preventDefault()
          e.stopPropagation()
          goUp(getCaretRelativeCoordinates(sRef.getBoundingClientRect()).x)
          ref.current?.blur()
        }
      } else if (e.key === 'ArrowDown') {
        const cp = cursorOffset(sRef)
        const isBottom = cp > unhighlight(code).split('\n').slice(0, -1).join('\n')?.length
        if (isBottom) {
          e.preventDefault()
          e.stopPropagation()
          goDown(getCaretRelativeCoordinates(sRef.getBoundingClientRect()).x)
        }
      } else if (e.key === 'ArrowLeft') {
        if (!cursorOffset(sRef)) goUp()
      } else if (e.key === 'ArrowRight') {
        if (cursorOffset(sRef) === unhighlight(code).length) goDown()
      }
    },
    [ref, code, goUp, goDown],
  )

  useEffect(() => {
    if (!focus) return
    setCursor(
      safe(ref.current),
      focus.xOffset,
      focus.type.includes('start') ? 'forward' : 'backward',
      focus.type.includes('integer') ? 'symbol' : 'pixel',
    )
  }, [JSON.stringify(focus)])

  useMount(() => {
    if (autoFocus) setCursor(safe(ref.current), 0, 'backward')
  })

  const Root = mini ? SmallCodeRoot : BigCodeRoot

  return (
    <Container>
      {!mini && (
        <>
          <SelectLanguage
            selected={language}
            languages={programmingLanguages}
            onSelect={setLanguage}
            readonly={readonly}
          />
          <CopyBtn icon={ContentCopyIcon} onClick={() => copyText(unhighlight(code))} />
        </>
      )}
      <Root>
        <Editable
          className="language-"
          innerRef={ref}
          html={code}
          tagName={'div'}
          sx={mini ? { width: 400 / 16 + 'rem' } : {}}
          onBlur={onBlur}
          onChange={onChange}
          onPaste={onPaste}
          role="textbox"
          onKeyDown={onKeyDown}
          spellCheck={false}
          disabled={readonly}
          placeholder={placeholder}
          data-cy="etext"
        />
      </Root>
    </Container>
  )
}

const Container = styled(Box, { label: 'CodeEditor' })({
  position: 'relative',
  ':hover': {
    'button, .MuiBox-root': {
      opacity: 1,
    },
  },
})

const CopyBtn = styled(IBtn)(({ theme }) => ({
  position: 'absolute',
  right: '1rem',
  top: '0.5rem',
  opacity: 1,
  transition: theme.tra('opacity'),

  [`${theme.breakpoints.up('sm')}`]: { opacity: 0 },
}))

const BigCodeRoot = styled(CodeRoot)(({ theme }) => ({
  div: {
    padding: '3rem 2rem',
    borderRadius: theme.shape.borderRadius,
    border: theme.bd(),

    ...theme.scroll('h'),

    overflow: 'auto',
    whiteSpace: 'pre',
  },
}))

const SmallCodeRoot = styled(CodeRoot)(({ theme }) => ({
  'div:empty:before': {
    content: 'attr(placeholder)',
    color: theme.palette.text.secondary,
    cursor: 'text',
  },
  div: {
    whiteSpace: 'pre-wrap',
  },
}))

const Editable = styled(ContentEditable)({
  outline: 'none',
  margin: 0,
  whiteSpace: 'pre',
})

interface SelectLanguage_ {
  languages: strs
  selected: str
  onSelect: SetStr
  readonly?: bool
}

function SelectLanguage({ languages, selected, onSelect, readonly }: SelectLanguage_) {
  const props = useLongMenu(languages, selected, onSelect)
  if (readonly)
    return (
      <LanguageSelector>
        <Typography sx={{ fontSize: '1rem', paddingTop: '0.5rem' }}>{selected}</Typography>
      </LanguageSelector>
    )
  return (
    <LanguageSelector>
      <Button
        ref={props.btnRef}
        onClick={props.toggleOpen}
        sx={{ textTransform: 'none', '.MuiButton-endIcon': { margin: '0 !important' } }}
        endIcon={<ArrowDropDownRoundedIcon />}
      >
        {selected}
      </Button>
      <LongMenu {...props} placeholder="language" />
    </LanguageSelector>
  )
}

const LanguageSelector = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '1rem',
  top: '0.5rem',
  opacity: 1,
  transition: theme.tra('opacity'),

  [`${theme.breakpoints.up('sm')}`]: { opacity: 0 },
}))
