import { styled, Typography } from '@mui/material'
import { bool, num, str } from '../../../../utils/types'
import { Correctness } from '../types'

export interface Feedback {
  isCorrect: bool
  error?: str
  explanation: str
  submitted?: bool
}

export function Feedback({ explanation, error, isCorrect, submitted }: Feedback) {
  if (!explanation && !error) return null

  return (
    <>
      {submitted && isCorrect && <SuccessText>{explanation}</SuccessText>}
      {submitted && !isCorrect && <ErrorText>{explanation}</ErrorText>}
      {error && <ErrorText>{error}</ErrorText>}
    </>
  )
}

export interface FeedbackIndex {
  validity: Correctness
  submitted?: bool
  i?: num
  space?: bool
}

export function FeedbackIndex({ validity, submitted, i, space }: FeedbackIndex) {
  const showIndex = i !== undefined && submitted
  if (!showIndex) return null
  const sx = space ? { transform: 'translateY(-2px)' } : {}
  const Root = validity === 'incorrect' ? ErrorIndex : SuccessIndex
  return <Root sx={sx}>{`${(i || 0) + 1}:${space ? ' ' : ''}`}</Root>
}

const ErrorText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.error.main,
  marginTop: '10px',
}))

const SuccessText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.success.main,
  marginTop: '10px',
}))

const ErrorIndex = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.error.main,
  display: 'inline-block',
}))

const SuccessIndex = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.success.main,
  display: 'inline-block',
}))
