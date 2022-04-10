import { getAuth } from '@firebase/auth'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
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

export function _onTestUserSignIn(userName: string) {
  const kittenPassword = import.meta.env.VITE_KITTEN_PASSWORD
  const puppyPassword = import.meta.env.VITE_PUPPY_PASSWORD

  switch (userName) {
    case 'Kitten':
      return signInWithEmailAndPassword(getAuth(), 'kitten@non-existent-email.net', kittenPassword)
    case 'Puppy':
      return signInWithEmailAndPassword(getAuth(), 'puppy@non-existent-email.net', puppyPassword)
  }
}
