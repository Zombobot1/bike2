import { getAuth } from 'firebase-admin/auth'
import { initializeApp } from 'firebase-admin/app'

export default async function () {
  const config = JSON.parse(process.env.VITE_FIREBASE_CONFIG || '{}')
  initializeApp(config)
  const kittenPassword = process.env.VITE_KITTEN_PASSWORD || ''
  const puppyPassword = process.env.VITE_PUPPY_PASSWORD || ''

  await getAuth().createUser({ email: 'kitten@non-existent-email.net', password: kittenPassword, uid: 'cats-lover' })
  await getAuth().createUser({
    email: 'puppy@non-existent-email.net',
    password: puppyPassword,
    uid: 'pets-and-animals',
  })
}
