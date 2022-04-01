import { styled, Typography } from '@mui/material'
import { bool, str } from '../../../../utils/types'
import RuleRoundedIcon from '@mui/icons-material/RuleRounded'

export interface InteractiveQuestion {
  question: str
  needsBigMargin?: bool
  isExercise?: bool
}

const Question = styled(Typography)(({ theme }) => ({
  fontSize: '1.35rem',
  marginBottom: '0.25rem',

  [`${theme.breakpoints.up('md')}`]: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
  },
}))

const QuestionBigMargin = styled(Question)(({ theme }) => ({
  marginBottom: '0.75rem',

  [`${theme.breakpoints.up('md')}`]: {
    marginBottom: '1.25rem',
  },
}))

export function InteractiveQuestion({ question, needsBigMargin, isExercise }: InteractiveQuestion) {
  if (!question) return null
  const Root = needsBigMargin ? QuestionBigMargin : Question

  return (
    <Root>
      {isExercise && <RuleRoundedIcon sx={{ transform: 'translateY(5px)', marginRight: '0.25rem' }} />}
      {question}
    </Root>
  )
}
