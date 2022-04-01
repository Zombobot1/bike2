import { getAuth } from '@firebase/auth'
import { signOut } from 'firebase/auth'
import { atom, useAtom } from 'jotai'
import { useSigninCheck, useUser } from 'reactfire'
import { sendEmailLink } from '../components/application/LoginPage/sendEmailLink'
import { str } from '../utils/types'
import { isInProduction } from './utils'

export class UserDTO {
  uid = 'cats-lover'
  email = 'cats-lover777@gmail.com'
  displayName = ''
  photoUrl = ''
}

const userA = atom(new UserDTO())

export function useUserInfo(): UserDTO {
  let user: UserDTO
  if (!isInProduction) user = useAtom(userA)[0]
  else {
    const { data } = useUser()
    user = {
      uid: data?.uid || '',
      email: data?.email || '',
      displayName: data?.displayName || '',
      photoUrl: data?.photoURL || '',
    }
  }
  return user
}

const signInA = atom(true)

export function useIsSignedIn() {
  if (!isInProduction) {
    const [isSignedIn, setIsSignedIn] = useAtom(signInA)
    const signIn = (_: str) => {
      setIsSignedIn(true)
      return Promise.resolve('')
    }
    return {
      isSignedIn,
      signIn,
      signOut: () => setIsSignedIn(false),
    }
  } else {
    const { data } = useSigninCheck()
    const signIn = (email: str) => sendEmailLink(email).then(() => localStorage.setItem('emailForSignIn', email))
    return { isSignedIn: data.signedIn, signIn, signOut: () => signOut(getAuth()) }
  }
}
