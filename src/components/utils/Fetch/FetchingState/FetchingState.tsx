import { CircularProgress, Stack, styled, Typography } from '@material-ui/core'
import { circularProgressClasses } from '@material-ui/core/CircularProgress'
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
  fontWeight: 'bold',
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
  message?: str
}

export function FetchingState({ message }: FetchingState) {
  if (message) return <Error message={message} />
  return <Loading />
}
