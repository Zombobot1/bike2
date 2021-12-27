import { styled, Typography } from '@mui/material'
import { bool, num, str } from '../../../utils/types'
import { Correctness } from '../types'

export interface Feedback {
  isCorrect: bool
  validationError: str
  explanation: str
  wasSubmitted: bool
}

export function Feedback({ explanation, validationError, isCorrect, wasSubmitted }: Feedback) {
  if (!explanation && !validationError) return null

  return (
    <>
      {wasSubmitted && isCorrect && <SuccessText>{explanation}</SuccessText>}
      {wasSubmitted && !isCorrect && <ErrorText>{explanation}</ErrorText>}
      {validationError && <ErrorText>{validationError}</ErrorText>}
    </>
  )
}

export interface FeedbackIndex {
  validity: Correctness
  wasSubmitted: bool
  i?: num
  space?: bool
}

export function FeedbackIndex({ validity, wasSubmitted, i, space }: FeedbackIndex) {
  const showIndex = i !== undefined && wasSubmitted
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
