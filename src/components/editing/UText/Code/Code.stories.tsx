import { Box } from '@mui/system'
import { UBlock } from '../../UBlock/UBlock'
import { CodeEditor } from '../../../utils/CodeEditor/CodeEditor'
import { UBlocksSet } from '../../UPage/UBlocksSet/UBlocksSet'
import { _idsForCodeFocus } from '../../../../content/content'
import { fn } from '../../../../utils/types'

const T = (props: UBlock) => () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const T2 = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlocksSet setIds={fn} ids={_idsForCodeFocus} />
    </Box>
  )
}

const data: UBlock = {
  id: 'catCode',
}

const readonly: UBlock = {
  id: 'catCode',
  readonly: true,
}

export const ChangesCodeAndLanguage = T(data)
export const Readonly = T(readonly)
export const FocusFlows = T2

export default {
  title: 'Editing/Code',
}
