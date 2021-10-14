import { styled, Typography } from '@mui/material'
import { Validity } from '../types'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

export interface InteractiveQuestionP {
  question: string
  status: Validity
}

const Question = styled(Typography)({
  fontSize: 24,
  marginBottom: 10,
})

export function InteractiveQuestion({ question, status }: InteractiveQuestionP) {
  if (!question) return null

  const sx = { transform: 'translateY(5px)', marginRight: 0.6 }

  return (
    <Question>
      {status === 'VALID' && <CheckRoundedIcon color="success" sx={sx} />}
      {status === 'INVALID' && <CloseRoundedIcon color="error" sx={sx} />}
      {question}
    </Question>
  )
}
