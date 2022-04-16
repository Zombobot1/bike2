import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, doc, getFirestore, writeBatch } from 'firebase/firestore'
import { firestoreMockData } from './content/firestoreMockData'
import 'dotenv/config'
import { connectStorageEmulator, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import * as fs from 'fs'
import { UPageStateCR } from './components/editing/UPage/UPageState/crdtParser/UPageStateCR'
import { f } from './utils/types'
import { _pageDTOs } from './content/pages'
import { _generators } from './components/editing/UPage/UPageState/crdtParser/_fakeUPage'
import _seedUsers from './_initUsers'
import { backend } from './fb/useData'

const { image } = _generators

export const firebaseConfig = JSON.parse(process.env.VITE_FIREBASE_CONFIG || '{}')

// supposed to be called before any component mounts
export async function _initFB() {
  const app = initializeApp(firebaseConfig)
  connectAuthEmulator(getAuth(app), 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
  connectStorageEmulator(getStorage(), 'localhost', 9199)
}

async function _seedCollections() {
  const batchWrite = writeBatch(getFirestore())

  await Promise.all(
    firestoreMockData.map((col) =>
      col.docs.map(async (d) => {
        batchWrite.set(doc(getFirestore(), col.name, d.id), d.data)
      }),
    ),
  )

  return batchWrite.commit()
}

async function _seedStorage() {
  const fileNames = ['fluffy.jpg', 'fluffy.mp3', 'catneeds.pdf']

  return Promise.all(
    fileNames.map(async (fileName) => {
      const fileRef = ref(getStorage(), `${fileName}`)
      const fileBlob = fs.readFileSync(`./src/content/${fileName}`)
      await uploadBytes(fileRef, fileBlob)
      const downloadURL = await getDownloadURL(fileRef)

      const dto = { updates: _pageDTOs.pets.updates }
      const cr = new UPageStateCR('', [...dto.updates], (_, u) => dto.updates.push(u), f)

      const img = image(downloadURL, 450, fileName)
      cr.change({ changes: [{ t: 'change', id: img.id, data: img.data }], preview: [] })

      await backend.setData('upages', 'pets-and-animals', dto)
    }),
  )
}

export async function _seed() {
  await _initFB()
  await _seedUsers()
  await _seedStorage()
  await _seedCollections()
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
