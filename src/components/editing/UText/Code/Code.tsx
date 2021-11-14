import { Box } from '@mui/material'
import { str } from '../../../../utils/types'
import { cast } from '../../../../utils/utils'
import { useMount, useReactiveObject } from '../../../utils/hooks/hooks'
import { UText } from '../types'
import { CodeEditor } from '../../../utils/CodeEditor/CodeEditor'
import { useEffect } from 'react'

export function Code(ps: UText) {
  const [data] = useReactiveObject(cast(ps.data, new CodeDTO()))
  const setCode = (d: str) => ps.setData(JSON.stringify({ ...data, code: d }))
  const setLanguage = (l: str) => ps.setData(JSON.stringify({ ...data, language: l }))

  useEffect(() => {
    if (ps.addInfo) ps.addInfo(ps.id, { type: 'code', offset: 0 })
  }, [data.code])

  useMount(() => ps.addData?.(ps.id, ps.data))

  return (
    <Box sx={{ paddingBottom: '1rem' }}>
      <CodeEditor
        code={data.code}
        language={data.language}
        setCode={setCode}
        setLanguage={setLanguage}
        readonly={ps.readonly}
        goUp={(x) => ps.goUp?.(ps.id, x)}
        goDown={(x) => ps.goDown?.(ps.id, x)}
        focus={ps.focus}
      />
    </Box>
  )
}

export class CodeDTO {
  language = 'TypeScript'
  code = ''
}
