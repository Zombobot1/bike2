import * as firebase from '@firebase/testing'
import { WS } from './components/utils/Shell/navigation/NavBar/NavBar'
import axios from 'axios'
import { strP } from './utils/types'

const PROJECT_ID = 'universe-55cec'
const API_KEY = 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U'
const admin = firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore()

async function auth(): strP {
  try {
    await axios.delete(`http://localhost:9099/emulator/v1/projects/${PROJECT_ID}/accounts`)
  } catch (e) {
    console.error(e)
  }
  const r = await axios.post(
    `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      email: 'test@gmail.com',
      password: '123456',
      returnSecureToken: true,
    },
    {
      headers: { 'Content-Type': 'application/json' },
    },
  )

  console.log()
  return r.data.localId
}

async function seed() {
  const userId = await auth()
  await firebase.clearFirestoreData({ projectId: PROJECT_ID })
  const jobs = [admin.collection('ws').doc(userId).set(ws())]
  return Promise.allSettled(jobs)
}

function ws(): WS {
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

seed().then(() => {
  console.info('seeded http://localhost:4000')
  console.info('Press Ctrl+C to exit')
})
