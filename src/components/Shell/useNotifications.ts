import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { useEffect, useState } from 'react'
import { useMount } from '../../utils/hooks-utils'
import { SetStr } from '../../utils/types'

// to test foreground notifications move a tab with site to a new window (but after you can return it back to the other chrome tabs)
export function useNotifications(onReceivingFCMToken: SetStr) {
  const [n, sn] = useState<UNotification>({ body: '', title: '' })
  useMount(() => {
    if (process.env.NODE_ENV !== 'development') getFCMToken(sn).then(onReceivingFCMToken).catch(console.error)
  })

  useEffect(() => {
    if (n.title) window.alert(`title: ${n.title}, body: ${n.body}`)
  }, [n])
}

const firebaseConfig = {
  apiKey: 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U',
  authDomain: 'universe-55cec.firebaseapp.com',
  projectId: 'universe-55cec',
  storageBucket: 'universe-55cec.appspot.com',
  messagingSenderId: '809588642322',
  appId: '1:809588642322:web:1f5f4811b7ae877237becb',
}

if (!getApps().length) initializeApp(firebaseConfig)
else getApp()

const messaging = getMessaging()

type UNotification = { title: string; body: string }

function getFCMToken(f: (n: UNotification) => void): Promise<string> {
  onMessage(messaging, (payload) => {
    f({ title: payload.notification?.title || '', body: payload.notification?.body || '' })
  })

  return getToken(messaging, {
    vapidKey: 'BEH3kgh6hQtkPtnCATi570vxIXgaF0mRAY_fjAgLTEhTK3EhJi6Z7_pM8WxyiH8KOn95bLKQdZXvu4oG3okUnXU',
  })
}
