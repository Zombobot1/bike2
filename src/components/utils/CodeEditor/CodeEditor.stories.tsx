import { Button, Popper } from '@mui/material'
import { Box } from '@mui/system'
import { useRef, useState } from 'react'
import { _codeWithPaws } from '../../../content/content'
import { fn, str } from '../../../utils/types'
import { useMount } from '../hooks/hooks'
import { CodeEditor } from './CodeEditor'
import { TeXEditor } from './TeXEditor'

const T = (code: str) => () => {
  const [l, sl] = useState('TypeScript')
  return (
    <Box sx={{ width: 900 }}>
      <CodeEditor code={code} setCode={fn} language={l} setLanguage={sl} />
    </Box>
  )
}

const T2 = (code: str, type: 'big' | 'small') => () => {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  useMount(() => setOpen(true))

  return (
    <Box sx={{ width: 500 }}>
      <Button onClick={() => setOpen(true)} ref={ref}>
        Open
      </Button>
      <Popper open={open} anchorEl={ref.current}>
        <TeXEditor tex={code} setTex={fn} close={() => setOpen(false)} type={type} />
      </Popper>
    </Box>
  )
}

const c2 = 'false \nfalse'

export const EditsHighlighted = T(_codeWithPaws)
export const Small = T(c2)
export const LatexEditor = T2('A = \\frac{3}{2}', 'small')
export const SmallEmptyLatexEditor = T2('', 'small')
export const BigEmptyLatexEditor = T2('', 'big')

export default {
  title: 'Utils/CodeEditor',
}
