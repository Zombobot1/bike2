import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  styled,
  Typography,
} from '@material-ui/core'
import GoogleIcon from '@material-ui/icons/Google'

import { useState } from 'react'
import { ThemeBtn } from '../../../../theme'
import { prevent } from '../../../../utils/utils'
import { useMount } from '../../hooks/hooks'
import { useRouter } from '../../hooks/useRouter'
import { ReactComponent as RightBlobsSVG } from './rightBlob.svg'
import { ReactComponent as LeftBlobsSVG } from './leftBlob.svg'
import { ReactComponent as WaveSVG } from './wave.svg'
import { ReactComponent as LogoSVG } from './logo.svg'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'

const UNI_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://unni.ml/'
const FINISH_REGISTRATION_URL = UNI_URL + 'finish-registration/'

export function FinishRegistration() {
  const [error, setError] = useState('')
  const { history } = useRouter()

  useMount(() => {
    if (!isSignInWithEmailLink(getAuth(), window.location.href)) return

    const email = localStorage.getItem('emailForSignIn')
    if (!email) {
      setError('Your email was lost :(')
      return
    }

    signInWithEmailLink(getAuth(), email, window.location.href)
      .then(() => {
        localStorage.removeItem('emailForSignIn')
        history.push('/') // to APP (avoiding circular dependency)
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

  function onGoogleSignIn() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        const user = result.user
        console.log(user)
      })
      .catch((error) => setError(error.message))
  }

  function onEmailSignIn() {
    sendSignInLinkToEmail(getAuth(), email, {
      url: FINISH_REGISTRATION_URL,
      handleCodeInApp: true,
    })
      .then(() => {
        localStorage.setItem('emailForSignIn', email)
        setIsLinkSent(true)
      })
      .catch((error) => setError(error.message))
  }

  // add apple auth it should be enough for all cases because every person has android or ios

  return (
    <FormWrapper justifyContent="center" alignItems="center">
      <form onSubmit={prevent}>
        <Form spacing={2} alignItems="center">
          <Logo />
          <LoginText>Welcome to Uni</LoginText>
          <BoldBtn onClick={onGoogleSignIn} variant="contained" size="large" fullWidth startIcon={<GoogleIcon />}>
            Continue with Google
          </BoldBtn>
          <Hr />
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              autoComplete="email"
            />
          </FormControl>
          <BoldBtn onClick={onEmailSignIn} size="large" fullWidth>
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

const Screen = styled(Box)({
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
  fontWeight: 'bold',
})

const Hr = styled(Divider)({
  width: '100%',
})

const BoldBtn = styled(Button)({
  fontWeight: 'bold',
})