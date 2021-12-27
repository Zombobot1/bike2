import { Box } from '@mui/material'
import { bool } from '../../../utils/types'
import { UBlockImplementation } from '../../editing/types'
import { UChecks } from './UChecks/UChecks'
import { UInput } from './UInput/UInput'
import { InlineExercise } from './InlineExercise/InlineExercise'
import { UFormFieldInfo } from '../types'

export interface UFormBlock extends UBlockImplementation, UFormFieldInfo {
  autoFocus?: bool
  hideTipOnMobile?: bool
}

export function UFormBlock(ps: UFormBlock) {
  return (
    <Box sx={{ paddingBottom: '2rem' }}>
      {ps.type === 'single-choice' && <UChecks {...ps} />}
      {ps.type === 'multiple-choice' && <UChecks {...ps} selectMultiple={true} />}
      {ps.type === 'short-answer' && <UInput {...ps} />}
      {ps.type === 'long-answer' && <UInput {...ps} multiline={true} />}
      {ps.type === 'inline-exercise' && <InlineExercise {...ps} />}
    </Box>
  )
}
