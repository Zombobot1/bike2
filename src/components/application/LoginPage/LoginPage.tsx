import { Box, Button, FormControl, InputLabel, Stack, styled, Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'

import { useState } from 'react'
import { ThemeBtn } from '../theming/ThemeBtn'
import { prevent } from '../../../utils/utils'
import { useMount } from '../../utils/hooks/hooks'
import { useURouter } from '../../utils/hooks/useRouter'
import { ReactComponent as RightBlobsSVG } from './rightBlob.svg'
import { ReactComponent as LeftBlobsSVG } from './leftBlob.svg'
import { ReactComponent as WaveSVG } from './wave.svg'
import { ReactComponent as LogoSVG } from './logo.svg'
import { getAuth, signInWithPopup, GoogleAuthProvider, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useIsSignedIn } from '../../../fb/auth'
import { Hr, TextInput } from '../../utils/MuiUtils'
import { _TestLogin } from './testUsers/_TestLogin'

export function FinishRegistration() {
  const [error, setError] = useState('')
  const { navigate, location } = useURouter()

  useMount(() => {
    if (!isSignInWithEmailLink(getAuth(), location.pathname + location.search)) return
    const email = localStorage.getItem('emailForSignIn')
    if (!email) {
      setError('Your email was lost :(')
      return
    }

    signInWithEmailLink(getAuth(), email, location.pathname + location.search)
      .then(() => {
        localStorage.removeItem('emailForSignIn')
        navigate('/') // to APP (avoiding circular dependency)
      })
      .catch((error) => setError(error.message))
  })

  return (
    <Stack sx={{ width: '100%', height: '100%' }} justifyContent="center" alignItems="center" spacing={2}>
      <LoginText>Creating your account</LoginText>
      {error && <BoldText color="error">{error}</BoldText>}
    </Stack>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLinkSent, setIsLinkSent] = useState(false)

  const { signIn } = useIsSignedIn()

  function onGoogleSignIn() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(getAuth(), provider).catch((error) => setError(error.message))
  }

  function onEmailSignIn() {
    signIn(email)
      .then(() => setIsLinkSent(true)) // causes update on unmounted component in sorybook
      .catch((error) => setError(error.message))
  }

  // add apple auth, it should be enough for all cases because every person has android or ios

  return (
    <FormWrapper justifyContent="center" alignItems="center">
      <form onSubmit={prevent}>
        <Form spacing={2} alignItems="center">
          <Logo />
          <LoginText>Welcome to Uni</LoginText>
          <BoldBtn onClick={onGoogleSignIn} variant="contained" size="large" fullWidth startIcon={<GoogleIcon />}>
            Continue with Google
          </BoldBtn>
          <Hr sx={{ width: '100%' }} />
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="email">Email</InputLabel>
            <TextInput
              id="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              autoComplete="email"
              data-cy="email"
            />
          </FormControl>
          <BoldBtn onClick={onEmailSignIn} size="large" fullWidth data-cy="sign-in-with-email">
            Continue with email
          </BoldBtn>
          {error && <BoldText color="error">{error}</BoldText>}
          {isLinkSent && <BoldText color="text.secondary">We sent you an email with further instructions</BoldText>}
        </Form>
      </form>
    </FormWrapper>
  )
}

export function LoginPage() {
  return (
    <Screen>
      <Wave />
      <LeftBlob />
      <LoginForm />
      <RightBlob />
      <ThemeBtn />
      <_TestLogin />
    </Screen>
  )
}

const Wave = styled(WaveSVG)(({ theme }) => ({
  position: 'absolute',
  top: -30,

  path: {
    fill: theme.palette.primary.main,
  },

  [`${theme.breakpoints.up('md')}`]: {
    display: 'none',
  },
}))

const Logo = styled(LogoSVG)(({ theme }) => ({
  width: '64px',
  height: '64px',

  '.u-base': {
    fill: theme.palette.primary.main,
  },
  '.u-tip': {
    fill: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.secondary.main,
  },
}))

const LeftBlob = styled(LeftBlobsSVG)(({ theme }) => ({
  position: 'absolute',
  display: 'none',
  bottom: 0,
  path: {
    fill: theme.palette.primary.main,
  },
  [`${theme.breakpoints.up('md')}`]: {
    display: 'block',
  },
}))

const RightBlob = styled(RightBlobsSVG)(({ theme }) => ({
  position: 'absolute',
  display: 'none',
  top: 0,
  right: 0,
  path: {
    fill: theme.palette.primary.main,
  },
  [`${theme.breakpoints.up('md')}`]: {
    display: 'block',
  },
}))

const Screen = styled(Box, { label: 'LoginPage' })({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
})

const FormWrapper = styled(Stack)({
  width: '100%',
  height: '100%',
})

const Form = styled(Stack)({
  width: '25rem',
})

const LoginText = styled(Typography)({
  fontSize: '2rem',
})

const BoldText = styled(Typography)({
  fontWeight: 600,
})

const BoldBtn = styled(Button)({
  fontWeight: 600,
})
