import { Button } from '@mui/material'
import { Suspense } from 'react'
import { MemoryRouter } from 'react-router'
import { useIsSignedIn } from '../../../fb/auth'
import { bool, str } from '../../../utils/types'
import { useMount } from '../../utils/hooks/hooks'
import { App } from './App'

interface T_ {
  initialPosition: str
  prepareForSignIn?: bool
  showSignOut?: bool
}

function T_({ initialPosition, prepareForSignIn, showSignOut }: T_) {
  const { isSignedIn, signOut, signIn } = useIsSignedIn()
  // const signIn = () => _getOOBLink().then((l) => setPosition(`${FINISH_REGISTRATION}${l}`))

  useMount(() => {
    if (!prepareForSignIn) {
      if (!isSignedIn) signIn('')
      return
    }
    localStorage.setItem('emailForSignIn', 'test@gmail.com')
    signOut()
  })

  return (
    <>
      {showSignOut && isSignedIn && <Button onClick={signOut}>Sign Out</Button>}
      <MemoryRouter key={initialPosition} initialEntries={[initialPosition]}>
        <App />
      </MemoryRouter>
    </>
  )
}

const Null = () => null
function T(props: T_) {
  return (
    <Suspense fallback={<Null />}>
      <T_ {...props} />
    </Suspense>
  )
}

const data1: T_ = {
  initialPosition: '/',
  showSignOut: true,
  prepareForSignIn: true,
}

const data2: T_ = {
  initialPosition: '/trash',
}

const data3: T_ = {
  initialPosition: '/pets-and-animals',
}

export const Application = () => T({ ...data1, showSignOut: false })
export const OnPetsPage = () => T(data3)
export const ShowsStudyAfterLogin = () => T(data1)
export const Shows404AndLetsGoToStudy = () => T(data2)
export const FavoriteAdditionAndDeletion = () => T(data3)

export default {
  title: 'App/App',
  order: [
    'Application',
    'OnPetsPage',
    'ShowsStudyAfterLogin',
    'Shows404AndLetsGoToStudy',
    'FavoriteAdditionAndDeletion',
  ],
}
