import { connectAuthEmulator, getAuth, signInWithEmailLink, signOut } from 'firebase/auth'
import { FINISH_REGISTRATION } from './components/utils/Shell/App/pages'
import { sendEmailLink } from './components/utils/Shell/LoginPage/sendEmailLink'
import { str, strP } from './utils/types'
import { WS } from './components/utils/Shell/navigation/NavBar/NavBar'
import { getApps, initializeApp } from '@firebase/app'
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  initializeFirestore,
  setDoc,
} from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U',
  authDomain: 'universe-55cec.firebaseapp.com',
  projectId: 'universe-55cec',
  storageBucket: 'universe-55cec.appspot.com',
  messagingSenderId: '809588642322',
  appId: '1:809588642322:web:1f5f4811b7ae877237becb',
}
import axios from 'axios'

const PROJECT_ID = 'universe-55cec'

type Promises = Promise<unknown>[]

async function deleteCollection(db: Firestore, name: str, jobs: Promises) {
  const docs = await getDocs(collection(db, name))
  docs.forEach((d) => jobs.push(deleteDoc(doc(db, name, d.id))))
}

export async function cleanUp() {
  const jobs: Promises = []
  await deleteCollection(getFirestore(), '_t', jobs)
  return Promise.all(jobs)
}

const create = (col: str, id: str) => doc(getFirestore(), col, id)

async function insertMockData() {
  const jobs = [setDoc(create('_t', '1'), { d: 'test' })]
  return Promise.all(jobs)
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
  const r = await axios.get(getCode)
  const d = await r.data
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
  const fs = initializeFirestore(app, { experimentalForceLongPolling: true }) // Polling for cypress
  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(fs, 'localhost', 8080)
  await _signIn()
}

export async function _seed() {
  await _initFB()
  await cleanUp()
  await insertMockData()
}

export function wrapPromise(promise: Promise<unknown>) {
  let status = 'pending'
  let result: unknown
  const suspender = promise.then(
    (r) => {
      status = 'success'
      result = r
    },
    (e) => {
      status = 'error'
      result = e
    },
  )
  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    },
  }
}
