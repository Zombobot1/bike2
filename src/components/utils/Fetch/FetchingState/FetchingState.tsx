import { CircularProgress, Stack, styled, Typography } from '@mui/material'
import { circularProgressClasses } from '@mui/material/CircularProgress'
import { str } from '../../../../utils/types'

export interface Error {
  message: str
}

function Error({ message }: Error) {
  return (
    <Stack justifyContent="center" alignItems="center">
      <ErrorText>Error!</ErrorText>
      <ErrorMessage>{message}</ErrorMessage>
    </Stack>
  )
}

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 600,
  fontSize: '1.2rem',
}))

const ErrorMessage = styled(Typography)(({ theme }) => ({
  maxWidth: '25rem',
  color: theme.palette.error.light,
  fontSize: '1.1rem',
}))

function Loading() {
  return (
    <Stack sx={{ width: '100%', height: '100%' }} justifyContent="center" alignItems="center">
      <CircularProgress
        variant="indeterminate"
        sx={{
          color: (theme) => theme.palette.primary.main,
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={40}
        thickness={4}
      />
    </Stack>
  )
}

export interface FetchingState {
  error?: { message?: str }
}

export function FetchingState({ error }: FetchingState) {
  if (error?.message) return <Error message={error.message} />
  // Error boundaries catch everything (message exist only on Errors)
  // Always use Promise.reject(new Error('msg')) not Promise.reject('msg')
  if (error) return <Error message={'Caught: ' + error} />
  return <Loading />
}
