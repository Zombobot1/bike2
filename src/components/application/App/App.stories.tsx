import { getAuth } from '@firebase/auth'
import { Button } from '@material-ui/core'
import { signOut } from 'firebase/auth'
import { Suspense, useState } from 'react'
import { MemoryRouter } from 'react-router'
import { useSigninCheck } from 'reactfire'
import { bool, str } from '../../../utils/types'
import { _getOOBLink } from '../../../_seeding'
import { useMount } from '../../utils/hooks/hooks'
import { App } from './App'
import { FINISH_REGISTRATION } from './pages'

interface T_ {
  initialPosition: str
  prepareForSignIn?: bool
  showSignOut?: bool
}

function T_({ initialPosition, prepareForSignIn, showSignOut }: T_) {
  const [position, setPosition] = useState(initialPosition)
  const { data } = useSigninCheck()

  useMount(() => {
    if (!prepareForSignIn) return
    localStorage.setItem('emailForSignIn', 'test@gmail.com')
    signOut(getAuth())
  })

  return (
    <>
      {showSignOut && data.signedIn && <Button onClick={() => signOut(getAuth())}>Sign Out</Button>}
      {!data.signedIn && (
        <Button
          onClick={() => _getOOBLink().then((l) => setPosition(`${FINISH_REGISTRATION}${l}`))}
          data-cy="sign-in-oob"
        >
          Sign In
        </Button>
      )}
      <MemoryRouter key={position} initialEntries={[position]}>
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
  initialPosition: '/pets',
}

export const ShowsStudyAfterLogin = () => T(data1)
export const Shows404AndLetsGoToStudy = () => T(data2)
export const FavoriteAdditionAndDeletion = () => T(data3)

export default {
  title: 'App/App',
}
