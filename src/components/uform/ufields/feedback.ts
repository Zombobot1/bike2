import { styled, Typography } from '@material-ui/core'

export const ErrorText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.error.main,
  marginTop: '10px',
}))

export const SuccessText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.success.main,
  marginTop: '10px',
}))
