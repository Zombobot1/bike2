import { getAuth } from '@firebase/auth'
import { Button } from '@material-ui/core'
import { signOut } from 'firebase/auth'
import { Suspense, useState } from 'react'
import { MemoryRouter } from 'react-router'
import { useSigninCheck } from 'reactfire'
import { bool, str } from '../../../../utils/types'
import { _getOOBLink } from '../../../../_seeding'
import { useMount } from '../../hooks/hooks'
import { App } from './App'
import { FINISH_REGISTRATION } from './pages'

interface T_ {
  initialPosition: str
  prepareForSignIn?: bool
}

function T_({ initialPosition, prepareForSignIn }: T_) {
  const [position, setPosition] = useState(initialPosition)
  const { data } = useSigninCheck()

  useMount(() => {
    if (!prepareForSignIn) return
    localStorage.setItem('emailForSignIn', 'test@gmail.com')
    signOut(getAuth())
  })

  return (
    <>
      {data.signedIn && <Button onClick={() => signOut(getAuth())}>Sign Out</Button>}
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
  prepareForSignIn: true,
}

const data2: T_ = {
  initialPosition: '/trash',
}

export const ShowsStudyAfterLogin = () => T(data1)
export const Shows404AndLetsGoToStudy = () => T(data2)

export default {
  title: 'Utils/App',
  component: App,
}
