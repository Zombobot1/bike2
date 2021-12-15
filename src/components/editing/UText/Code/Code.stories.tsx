import { Box } from '@mui/system'
import { UBlock, mockUblock } from '../../UBlock/UBlock'
import { UBlocksSet } from '../../UPage/UBlockSet/UBlockSet'
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
  ...mockUblock,
  id: 'catCode',
}

const readonly: UBlock = {
  ...mockUblock,
  id: 'catCode',
  readonly: true,
}

export const ChangesCodeAndLanguage = T(data)
export const Readonly = T(readonly)
export const FocusFlows = T2

export default {
  title: 'Editing/Code',
}
