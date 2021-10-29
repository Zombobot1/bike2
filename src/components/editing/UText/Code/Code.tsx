import { Box, styled } from '@mui/material'
import ContentEditable from 'react-contenteditable'
import { SetStr, str } from '../../../../utils/types'
import { cast } from '../../../../utils/utils'
import { EditableText } from '../../../utils/EditableText/EditableText'
import { useReactive, useReactiveObject } from '../../../utils/hooks/hooks'
import { RStack } from '../../../utils/MuiUtils'
import { UText } from '../types'
import { UText_ } from '../UText_'
import { CodeEditor } from '../../../utils/CodeEditor/CodeEditor'
import { useEffect } from 'react'

export function Code(props: UText) {
  const [data] = useReactiveObject(cast(props.data, new CodeDTO()))
  const setCode = (d: str) => props.setData(JSON.stringify({ ...data, code: d }))
  const setLanguage = (l: str) => props.setData(JSON.stringify({ ...data, language: l }))

  useEffect(() => {
    if (props.addInfo) props.addInfo({ data: data.code, type: 'code', offset: 0 })
  }, [data.code])

  return (
    <Box sx={{ paddingBottom: '1rem' }}>
      <CodeEditor
        code={data.code}
        language={data.language}
        setCode={setCode}
        setLanguage={setLanguage}
        readonly={props.readonly}
        arrowNavigation={props.arrowNavigation}
        focus={props.focus}
      />
    </Box>
  )
}

export class CodeDTO {
  language = 'TypeScript'
  code = ''
}
