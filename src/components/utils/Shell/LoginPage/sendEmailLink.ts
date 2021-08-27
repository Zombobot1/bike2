import { getAuth } from '@firebase/auth'
import { sendSignInLinkToEmail } from 'firebase/auth'
import { str } from '../../../../utils/types'
import { FINISH_REGISTRATION } from '../App/pages'

const UNI_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://unni.ml/'
const FINISH_REGISTRATION_URL = UNI_URL + FINISH_REGISTRATION

export function sendEmailLink(email: str) {
  return sendSignInLinkToEmail(getAuth(), email, {
    url: FINISH_REGISTRATION_URL,
    handleCodeInApp: true,
  })
}
