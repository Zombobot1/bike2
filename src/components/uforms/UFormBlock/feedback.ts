import { styled, Typography } from '@mui/material'

export const ErrorText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.error.main,
  marginTop: '10px',
}))

export const SuccessText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.success.main,
  marginTop: '10px',
}))
