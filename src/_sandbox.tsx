import { SoryBook } from './sorybook/sorybook'
import { storify } from './sorybook/utils'

// wrap sorybook Pane in Memory router
export const Sandbox = () => {
  return <SoryBook sories={storify([UFormBlockS, UChecks, UInput, UTextS, UPageS])} />
}

import * as UChecks from './components/uform/UFormBlock/UChecks/UChecks.stories'
import * as UInput from './components/uform/UFormBlock/UInput/UInput.stories'
import * as UFormBlockS from './components/uform/UFormBlock/UFormBlock.stories'
import * as UTextS from './components/ucomponents/UText/UText.stories'
import * as UPageS from './components/ucomponents/UPage/UPage.stories'

// import { UFileS } from '../components/ucomponents/UFile/UFile.stories'
// import { UAudioFileS } from './components/ucomponents/UFile/UAudioFile/UAudioFile.stories'
// import { UImageFileS } from '../components/ucomponents/UFile/UImageFile/UImageFile.stories'
