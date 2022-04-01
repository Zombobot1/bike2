import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { str, strP } from './utils/types'
import { getApps, initializeApp } from '@firebase/app'
import { collection, deleteDoc, doc, Firestore, getDocs, getFirestore, initializeFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U',
  authDomain: 'universe-55cec.firebaseapp.com',
  projectId: 'universe-55cec',
  storageBucket: 'universe-55cec.appspot.com',
  messagingSenderId: '809588642322',
  appId: '1:809588642322:web:1f5f4811b7ae877237becb',
}
// import axios from 'axios'
// import { ws } from './content/application'
import { getStorage } from 'firebase/storage'

// const PROJECT_ID = 'universe-55cec'
type Promises = Promise<unknown>[]

async function deleteCollection(db: Firestore, name: str, jobs: Promises) {
  const docs = await getDocs(collection(db, name))
  docs.forEach((d) => jobs.push(deleteDoc(doc(db, name, d.id))))
}

export async function cleanUp() {
  const jobs: Promises = []
  await deleteCollection(getFirestore(), '_t', jobs)
  await deleteCollection(getFirestore(), 'ublocks', jobs)
  return Promise.all(jobs)
}

// const set = (col: str, id: str, data: JSObject) => setDoc(doc(getFirestore(), col, id), data)
// const _setMany = (col: str, data: [str, JSObject][]) => data.map(([id, d]) => set(col, id, d))
// async function insertMockData(userId: str) {
//   const jobs = [set('ws', userId, ws), set('_t', '1', { d: 'test' }), ..._setMany('ublocks', blocksS)]
//   return Promise.all(jobs)
// }
// export async function _insertBlocks(blocks: IdAndBlocks) {
//   return Promise.all([..._setMany('ublocks', blocks)])
// }
// const getCode = `http://localhost:9099/emulator/v1/projects/${PROJECT_ID}/oobCodes`

// export async function _getOOBLink(): strP {
// const r = await axios.get(getCode)
// const d = await r.data
// return `?${d.oobCodes[0].oobLink.split('?')[1].split('&continueUrl')[0]}`
// }

export async function _signIn() {
  // await sendEmailLink('test@gmail.com')
  // const s = `${FINISH_REGISTRATION}${await _getOOBLink()}`
  // const user = await signInWithEmailLink(getAuth(), 'test@gmail.com', s)
  // return user.user.uid

  const user = await signInWithEmailAndPassword(getAuth(), 'test@gmail.com', '123456')
  return user.user.uid

  // const signIn = 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=API-KEY'
  // const r = await axios.post(signIn, { email: 'test@gmail.com', password: '123456' })
  // const d = await r.data
  // return d.localId
}

export const _signOut = () => signOut(getAuth())

// supposed to be called before any component mounts
export async function _initFB(): strP {
  if (getApps().length) return ''

  const app = initializeApp(firebaseConfig)
  initializeFirestore(app, { experimentalForceLongPolling: true }) // Polling for cypress
  getAuth(app)
  getStorage(app)
  // connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  // connectFirestoreEmulator(fs, 'localhost', 8080)
  // connectStorageEmulator(storage, 'localhost', 9199)
  return _signIn()
}

export async function _seed() {
  // const userId = await _initFB()
  await cleanUp()
  // await insertMockData(userId)
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
