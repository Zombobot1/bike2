import { useEffect, useState } from 'react'
import { Switch } from 'react-router-dom'

import { buildRoutes, Routed } from '../utils/routing'
import { Breadcrumb } from './navigation/breadcrumb/breadcrumb'
import { getToken, UNotification } from '../../firebase'
import { subscribeForNotifications } from '../../api/api'
import { useMount, useMQ } from '../../utils/hooks-utils'
import { Stack, styled } from '@material-ui/core'

const AppContainer = styled(Stack)({
  width: '100vw',
  height: '100vh',
  overflowX: 'hidden',
})

const Main = styled('main')({
  flexGrow: 1,
})

export const App = ({ routes }: Routed) => {
  const [n, sn] = useState<UNotification>({ body: '', title: '' })
  useMount(() => {
    if (process.env.NODE_ENV !== 'development') getToken(sn).then(subscribeForNotifications).catch(console.error)
  })

  useEffect(() => {
    if (n.title) window.alert(`title: ${n.title}, body: ${n.body}`)
  }, [n])

  const sx = useMQ({ padding: '20px' }, { padding: '5px 10px 0 10px' })

  return (
    <AppContainer>
      <Breadcrumb />
      <Main sx={sx}>
        <Switch>{routes?.map(buildRoutes)}</Switch>
      </Main>
    </AppContainer>
  )
}
