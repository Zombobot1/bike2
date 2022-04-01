import { Box } from '@mui/system'
import { _catCode } from '../../../../content/blocks'
import { SetForStories } from '../../UPage/UBlockSet/SetForStories'
import { CodeData, UBlocks } from '../../UPage/ublockTypes'
import { _generators } from '../../UPage/UPageState/crdtParser/_fakeUPage'
import { _mockUTextP } from '../types'
import { Code } from './Code'

const T =
  (readonly = false) =>
  () => {
    return (
      <Box sx={{ width: 500 }}>
        <Code {..._mockUTextP} data={_catCode} readonly={readonly} />
      </Box>
    )
  }

const T2 = (ublocks: UBlocks) => {
  return (
    <Box sx={{ width: 500 }}>
      <SetForStories blocks={ublocks} />
    </Box>
  )
}

const { b } = _generators
const codeForFocus: CodeData = { text: 'I want to dance with a fat cat', language: 'Text' }

export const ChangesCodeAndLanguage = T()
export const Readonly = T(true)
export const FocusFlows = () =>
  T2([b('hypoallergenic cat'), b('code', codeForFocus, 'code'), b('another hypoallergenic cat')])

export default {
  title: 'Editing extras/Code',
}
