import firebase from 'firebase/app'
import 'firebase/messaging'

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY

const firebaseConfig = {
  apiKey,
  projectId,
  authDomain: `${projectId}.firebaseapp.com`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId,
  appId: `1:${messagingSenderId}:web:1f5f4811b7ae877237becb`,
}

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig)
else firebase.app()

const messaging = firebase.messaging()

export type UNotification = { title: string; body: string }

export function getToken(f: (n: UNotification) => void): Promise<string> {
  messaging.onMessage((payload) => {
    f({ title: payload.notification.title, body: payload.notification.body })
  })

  return messaging.getToken({ vapidKey })
}
