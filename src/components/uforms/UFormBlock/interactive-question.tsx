import { styled, Typography } from '@mui/material'
import { Validity } from '../types'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

export interface InteractiveQuestionP {
  question: string
}

const Question = styled(Typography)({
  fontSize: 24,
  marginBottom: 10,
})

export function InteractiveQuestion({ question }: InteractiveQuestionP) {
  if (!question) return null
  return <Question>{question}</Question>
}
