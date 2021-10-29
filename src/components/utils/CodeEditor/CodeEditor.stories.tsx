import { Box } from '@mui/system'
import { useState } from 'react'
import { _codeWithPaws } from '../../../content/content'
import { fn, str } from '../../../utils/types'
import { CodeEditor } from './CodeEditor'

const T = (code: str) => () => {
  const [l, sl] = useState('TypeScript')
  return (
    <Box sx={{ width: 900 }}>
      <CodeEditor code={code} setCode={fn} language={l} setLanguage={sl} />
    </Box>
  )
}

const c2 = 'false \nfalse'

export const EditsHighlighted = T(_codeWithPaws)
export const Small = T(c2)

export default {
  title: 'Utils/CodeEditor',
}
