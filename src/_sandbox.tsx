import { SoryBook } from './sorybook/sorybook'
import { storify } from './sorybook/utils'

// wrap sorybook Pane in Memory router
// replace this file during production on: export const Sandbox = () => null check that nothing is rendered
// build components tree from default export
export const Sandbox = () => {
  return null
  // return <SoryBook sories={storify({ UFormBlockS })} />
}

// import * as UChecksS from './components/uform/UFormBlock/UChecks/UChecks.stories'
// import * as UInputS from './components/uform/UFormBlock/UInput/UInput.stories'
// import * as UFormBlockS from './components/uform/UFormBlock/UFormBlock.stories'
// import * as UTextS from './components/ucomponents/UText/UText.stories'
// import * as UPageS from './components/ucomponents/UPage/UPage.stories'

// import { UFileS } from '../components/ucomponents/UFile/UFile.stories'
// import { UAudioFileS } from '../components/ucomponents/UFile/UAudioFile/UAudioFile.stories'
// import { UImageFileS } from '../components/ucomponents/UFile/UImageFile/UImageFile.stories'
