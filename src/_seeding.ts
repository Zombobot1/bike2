import { connectAuthEmulator, getAuth, signInWithEmailLink, signOut } from 'firebase/auth'
import { FINISH_REGISTRATION } from './components/utils/Shell/App/pages'
import { sendEmailLink } from './components/utils/Shell/LoginPage/sendEmailLink'
import { strP } from './utils/types'
// import * as firebase from '@firebase/testing'
import { WS } from './components/utils/Shell/navigation/NavBar/NavBar'
import { getApps, initializeApp } from '@firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './components/utils/Shell/Shell'
// import axios from 'axios'

const PROJECT_ID = 'universe-55cec'
// const API_KEY = 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U'

// const admin = firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore()

export async function _seed() {
  // const userId = await auth()
  // await firebase.clearFirestoreData({ projectId: PROJECT_ID })
  // const jobs = [admin.collection('ws').doc(userId).set(ws()), admin.collection('_t').doc('1').set({ d: 'test' })]
  // return Promise.allSettled(jobs)
}

export function ws(): WS {
  return {
    personal: [
      {
        id: 'page1',
        name: 'opened page 1',
        isOpen: true,
        children: [
          {
            id: 'sub-page1',
            name: 'sub-page 1',
            isOpen: false,
          },
        ],
      },
      {
        id: 'page2',
        name: 'page 2',
        isOpen: false,
        children: [
          {
            id: 'sub-page2',
            name: 'sub-page 2',
            isOpen: false,
          },
          {
            id: 'sub-page3',
            name: 'sub-page 3',
            isOpen: false,
          },
        ],
      },
    ],
  }
}

const getCode = `http://localhost:9099/emulator/v1/projects/${PROJECT_ID}/oobCodes`

export async function _getOOBLink(): strP {
  const r = await fetch(getCode)
  const d = await r.json()
  return `?${d.oobCodes[0].oobLink.split('?')[1].split('&continueUrl')[0]}`
}

export async function _signIn() {
  await sendEmailLink('test@gmail.com')
  const s = `${FINISH_REGISTRATION}${await _getOOBLink()}`
  await signInWithEmailLink(getAuth(), 'test@gmail.com', s)
}

export const _signOut = () => signOut(getAuth())

// supposed to be called before any component mounts
export async function _initFB() {
  if (getApps().length) return

  const app = initializeApp(firebaseConfig)
  const fs = getFirestore(app)
  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(fs, 'localhost', 8080)
  await _signIn()
}
