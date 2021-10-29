import { styled, Typography } from '@mui/material'
import { bool, str } from '../../../utils/types'
import { Validity } from '../types'

export interface Feedback {
  validationError: str
  validity: Validity
  explanation: str
  wasSubmitted: bool
}

export function Feedback({ explanation, validationError, validity, wasSubmitted }: Feedback) {
  return (
    <>
      {validationError && <ErrorText>{validationError}</ErrorText>}
      {wasSubmitted && validity === 'invalid' && <ErrorText>{explanation}</ErrorText>}
      {wasSubmitted && validity === 'valid' && <SuccessText>{explanation}</SuccessText>}
    </>
  )
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
