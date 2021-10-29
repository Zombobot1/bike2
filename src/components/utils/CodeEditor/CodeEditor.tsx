import { useRef, useState, KeyboardEvent, useEffect, memo } from 'react'
import { safe } from '../../../utils/utils'
import { useRefCallback } from '../hooks/useRefCallback'
import {
  cursorOffset,
  getCaretCoordinates,
  getCaretRelativeCoordinates,
  relativeDimensions,
  setCursor,
} from '../Selection/selection'
import { CodeRoot } from './CodeRoot'
import { highlight, programmingLanguages, unhighlight } from './highlight'
import { bool, SetStr, str, strs } from '../../../utils/types'
import { Box, Button, styled, Typography } from '@mui/material'
import ContentEditable from 'react-contenteditable'
import { insert } from '../../../utils/algorithms'
import { IBtn } from '../MuiUtils'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { LongMenu, useLongMenu } from '../UMenu/LongMenu'
import { copyText } from '../../../utils/copyText'
import { useDebugInformation } from '../hooks/useDebug'
import { ArrowNavigation, UTextFocus } from '../../editing/types'

export interface CodeEditor {
  focus?: UTextFocus
  language: str
  code: str
  setCode: SetStr
  setLanguage: SetStr
  readonly?: bool
  arrowNavigation?: ArrowNavigation
}

// export const CodeEditor = memo(
//   _CodeEditor,
//   (prev, n) => prev.code !== n.code || prev.readonly !== n.readonly || prev.language !== n.language,
// )

export function CodeEditor({
  code: initialCode,
  setCode: saveCode,
  language,
  setLanguage,
  readonly,
  arrowNavigation,
  focus,
}: CodeEditor) {
  const [code, setCode] = useState(highlight(initialCode, language))
  useEffect(() => {
    setCode(highlight(unhighlight(code), language))
  }, [language])

  const ref = useRef<HTMLDivElement>(null)
  const onChange = useRefCallback((e) => {
    const cp = cursorOffset(safe(ref.current))
    setCode(highlight(unhighlight(e.target.value), language))
    setTimeout(() => setCursor(safe(ref.current), cp, 'forward', 'symbol')) // hack
  })
  const onBlur = useRefCallback(() => saveCode(unhighlight(code)), [code])

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const sRef = safe(ref.current)
      if (e.key === 'Tab') {
        e.preventDefault()
        const cp = cursorOffset(sRef)
        setCode(highlight(insert(unhighlight(code), cp, '  '), language))
        setTimeout(() => setCursor(sRef, cp + 2, 'forward', 'symbol')) // hack
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const cp = cursorOffset(sRef)
        setCode(highlight(insert(unhighlight(code), cp, '\n'), language))
        setTimeout(() => setCursor(sRef, cp + 1, 'forward', 'symbol')) // hack
      } else if (e.key === 'ArrowUp') {
        const cp = cursorOffset(sRef)
        const isTop = cp < unhighlight(code).split('\n')[0]?.length
        if (isTop) {
          e.preventDefault()
          e.stopPropagation()
          arrowNavigation?.up(getCaretRelativeCoordinates(sRef.getBoundingClientRect()).x)
          ref.current?.blur()
        }
      } else if (e.key === 'ArrowDown') {
        const cp = cursorOffset(sRef)
        const isBottom = cp > unhighlight(code).split('\n').slice(0, -1).join('\n')?.length
        if (isBottom) {
          e.preventDefault()
          e.stopPropagation()
          arrowNavigation?.down(getCaretRelativeCoordinates(sRef.getBoundingClientRect()).x)
        }
      } else if (e.key === 'ArrowLeft') {
        if (!cursorOffset(sRef)) arrowNavigation?.up()
      } else if (e.key === 'ArrowRight') {
        if (cursorOffset(sRef) === unhighlight(code).length) arrowNavigation?.down()
      }
    },
    [ref, code, arrowNavigation],
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

  return (
    <Container>
      <SelectLanguage selected={language} languages={programmingLanguages} onSelect={setLanguage} readonly={readonly} />
      <CopyBtn icon={ContentCopyIcon} onClick={() => copyText(unhighlight(code))} />
      <CodeRoot>
        <Editable
          className="language-"
          innerRef={ref}
          html={code}
          tagName={'pre'}
          onBlur={onBlur}
          onChange={onChange}
          role="textbox"
          onKeyDown={onKeyDown}
          spellCheck={false}
          disabled={readonly}
          data-cy="etext"
        />
      </CodeRoot>
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
  opacity: 0,
  transition: theme.tra('opacity'),
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
  opacity: 0,
  transition: theme.tra('opacity'),
}))
