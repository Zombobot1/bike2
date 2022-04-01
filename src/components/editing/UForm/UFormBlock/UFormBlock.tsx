import { Box, styled } from '@mui/material'
import { bool } from '../../../../utils/types'
import { UBlockContent } from '../../types'
import { UChecks } from './UChecks/UChecks'
import { UInput } from './UInput/UInput'
import { InlineExercise } from './InlineExercise/InlineExercise'

export interface UFormBlock extends UBlockContent {
  autoFocus?: bool
  hideTipOnMobile?: bool
}

export function UFormBlock(ps: UFormBlock) {
  return (
    <Root>
      {ps.type === 'single-choice' && <UChecks {...ps} />}
      {ps.type === 'multiple-choice' && <UChecks {...ps} />}
      {ps.type === 'short-answer' && <UInput {...ps} />}
      {ps.type === 'long-answer' && <UInput {...ps} />}
      {ps.type === 'inline-exercise' && <InlineExercise {...ps} />}
    </Root>
  )
}

const Root = styled(Box)(({ theme }) => ({
  paddingBottom: '1rem',

  [`${theme.breakpoints.up('md')}`]: {
    paddingBottom: '2rem',
    width: '30rem',
  },
}))
