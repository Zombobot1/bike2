import { strs } from '../../utils/types'

export class UserDTO {
  fcmTokens: strs = []
}

// to test foreground notifications move a tab with site to a new window (after you can return it back to the other chrome tabs)
export function useNotifications() {
  if (process.env.NODE_ENV === 'development') return
  // const [n, sn] = useState<UNotification>({ body: '', title: '' })
  // const { data: user } = useUser()
  // const [data, setData] = useData('users', user?.uid || '', new UserDTO())

  // useMount(() => {
  //   _getFCMToken(sn)
  //     .then((t) =>
  //       setData({ fcmTokens: data.fcmTokens.length > 3 ? [...data.fcmTokens.slice(1), t] : [...data.fcmTokens, t] }),
  //     )
  //     .catch(console.error)
  // })

  // useEffect(() => {
  //   if (n.title) window.alert(`title: ${n.title}, body: ${n.body}`)
  // }, [n])
}
// if (process.env.NODE_ENV !== 'development')
// const messaging = getMessaging()

type UNotification = { title: string; body: string }

function _getFCMToken(_f: (n: UNotification) => void): Promise<string> {
  // onMessage(messaging, (payload) => {
  //   f({ title: payload.notification?.title || '', body: payload.notification?.body || '' })
  // })

  // return getToken(messaging, {
  //   vapidKey: 'BEH3kgh6hQtkPtnCATi570vxIXgaF0mRAY_fjAgLTEhTK3EhJi6Z7_pM8WxyiH8KOn95bLKQdZXvu4oG3okUnXU',
  // })
  return Promise.resolve('')
}
