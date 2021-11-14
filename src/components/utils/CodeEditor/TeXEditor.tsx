import { ClickAwayListener, Paper } from '@mui/material'
import { bool, SetStr, str } from '../../../utils/types'
import { CodeEditor } from './CodeEditor'

export interface TeXEditor {
  tex: str
  setTex: SetStr
  close: (how?: 'key' | 'click') => void
  type: 'small' | 'big'
  readonly?: bool
}

export function TeXEditor({ setTex, tex, close, type, readonly }: TeXEditor) {
  const placeholder = type === 'small' ? 'E = mc^2' : bigPlaceholder
  return (
    <ClickAwayListener onClickAway={() => close('click')}>
      <Paper
        elevation={8}
        sx={{
          padding: '1rem',
        }}
      >
        <CodeEditor
          language="latex"
          setCode={setTex}
          mini={true}
          onEnter={close}
          code={tex}
          placeholder={placeholder}
          autoFocus={true}
          readonly={readonly}
        />
      </Paper>
    </ClickAwayListener>
  )
}

const bigPlaceholder = `|x| = \\begin{cases}
    x, &\\quad x \\geq 0 \\\\
   -x, &\\quad x < 0
\\end{cases}`
