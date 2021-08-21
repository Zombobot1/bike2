import { SoryBook } from './sorybook/sorybook'
import { storify } from './sorybook/utils'

export const Sandbox = () => {
  // return <Sandbox_></Sandbox_>
  return <SoryBook sories={storify([UCard, UForm, UFormBlock, UChecks, UInput, UTextS, UPageS])} />
  // wrap sorybook Pane in Memory router
}

import * as UCard from './components/decks/UCard/UCard.stories'
import * as UForm from './components/uform/UForm.stories'
import * as UChecks from './components/uform/UFormBlock/UChecks/UChecks.stories'
import * as UInput from './components/uform/UFormBlock/UInput/UInput.stories'
import * as UFormBlock from './components/uform/UFormBlock/UFormBlock.stories'
import * as UTextS from './components/ucomponents/UText/UText.stories'
import * as UPageS from './components/ucomponents/UPage/UPage.stories'
import { Stack } from '@material-ui/core'
import { ReactNode } from 'react'

// import { UFileS } from '../components/ucomponents/UFile/UFile.stories'
// import { UAudioFileS } from './components/ucomponents/UFile/UAudioFile/UAudioFile.stories'
// import { UImageFileS } from '../components/ucomponents/UFile/UImageFile/UImageFile.stories'
type SandboxP = { children: ReactNode }
export function Sandbox_({ children }: SandboxP) {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ width: '100vw', height: '100vh' }}>
      {children}
    </Stack>
  )
}
