import { useEffect, useState } from 'react'
import { useMount } from '../hooks/hooks'
import { SetStr } from '../../../utils/types'

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
// if (process.env.NODE_ENV !== 'development')
// const messaging = getMessaging()

type UNotification = { title: string; body: string }

function getFCMToken(_f: (n: UNotification) => void): Promise<string> {
  // onMessage(messaging, (payload) => {
  //   f({ title: payload.notification?.title || '', body: payload.notification?.body || '' })
  // })

  // return getToken(messaging, {
  //   vapidKey: 'BEH3kgh6hQtkPtnCATi570vxIXgaF0mRAY_fjAgLTEhTK3EhJi6Z7_pM8WxyiH8KOn95bLKQdZXvu4oG3okUnXU',
  // })
  return Promise.resolve('')
}
