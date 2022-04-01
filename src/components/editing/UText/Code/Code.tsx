import { UText } from '../types'
import { CodeEditor } from '../../../utils/CodeEditor/CodeEditor'
import { PaddedBox } from '../../UPage/UBlock/PaddedBox'
import { CodeData } from '../../UPage/ublockTypes'

export function Code(ps: UText) {
  const { id, data: d, setData, readonly } = ps
  const data = d as CodeData
  const focus = ps.focusS[0]

  return (
    <PaddedBox>
      <CodeEditor
        code={data.text}
        language={data.language}
        setCode={(t) => setData(id, { text: t })}
        setLanguage={(l) => setData(id, { language: l })}
        readonly={readonly}
        goUp={(x) => ps.goUp(ps.id, x)}
        goDown={(x) => ps.goDown(ps.id, x)}
        focus={focus?.id === id ? focus : undefined}
      />
    </PaddedBox>
  )
}
