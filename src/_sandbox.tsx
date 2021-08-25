import { SoryBook } from './sorybook/sorybook'

export const Sandbox = () => {
  return <SoryBook sories={[LoginPage, NavBar, UCard, UForm, UFormBlock, UChecks, UInput, UTextS, UPageS]} />
  // wrap sorybook Pane in Memory router
}

import * as LoginPage from './components/utils/Shell/LoginPage/LoginPage.stories'
import * as NavBar from './components/utils/Shell/navigation/NavBar/NavBar.stories'
import * as UCard from './components/decks/UCard/UCard.stories'
import * as UForm from './components/uforms/UForm.stories'
import * as UChecks from './components/uforms/UFormBlock/UChecks/UChecks.stories'
import * as UInput from './components/uforms/UFormBlock/UInput/UInput.stories'
import * as UFormBlock from './components/uforms/UFormBlock/UFormBlock.stories'
import * as UTextS from './components/editing/UText/UText.stories'
import * as UPageS from './components/editing/UPage/UPage.stories'

// import { UFileS } from '../components/editing/UFile/UFile.stories'
// import { UAudioFileS } from './components/editing/UFile/UAudioFile/UAudioFile.stories'
// import { UImageFileS } from '../components/editing/UFile/UImageFile/UImageFile.stories'
