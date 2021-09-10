import { SoryBook } from './sorybook/sorybook'
import ReactDOM from 'react-dom'

const init = wrapPromise(_initFB())

const Sandbox = () => {
  init.read()

  return (
    <OuterShell>
      <SoryBook
        sories={[
          UFile,
          UAudioFile,
          UImageFile,
          UAudio,
          UPage,
          AppBar,
          NavBar,
          App,
          Fetch,
          FetchingStateS,
          Page404,
          ThemeBtn,
          LoginPage,
          UCard,
          UForm,
          UFormBlock,
          UChecks,
          UInput,
          UTextS,
          UBlocksSet,
        ]}
      />
    </OuterShell>
  )
}

import * as UFile from './components/editing/UFile/UFile.stories'
import * as UAudio from './components/utils/UAudio/UAudio.stories'
import * as UPage from './components/editing/UPage/UPage.stories'
import * as AppBar from './components/application/navigation/Crumbs/AppBar.stories'
import * as NavBar from './components/application/navigation/NavBar/NavBar.stories'
import * as App from './components/application/App/App.stories'
import * as Fetch from './components/utils/Fetch/Fetch.stories'
import * as FetchingStateS from './components/utils/Fetch/FetchingState/FetchingState.stories'
import * as ThemeBtn from './components/application/theming/ThemeBtn.stories'
import * as Page404 from './components/application/Page404/Page404.stories'
import * as LoginPage from './components/application/LoginPage/LoginPage.stories'
import * as UCard from './components/decks/UCard/UCard.stories'
import * as UForm from './components/uforms/UForm.stories'
import * as UChecks from './components/uforms/UFormBlock/UChecks/UChecks.stories'
import * as UInput from './components/uforms/UFormBlock/UInput/UInput.stories'
import * as UFormBlock from './components/uforms/UFormBlock/UFormBlock.stories'
import * as UTextS from './components/editing/UText/UText.stories'
import * as UAudioFile from './components/editing/UFile/UAudioFile/UAudioFile.stories'
import * as UImageFile from './components/editing/UFile/UImageFile/UImageFile.stories'
import * as UBlocksSet from './components/editing/UPage/UBlocksSet/UBlocksSet.stories'
import { OuterShell } from './components/application/Shell'
import { wrapPromise, _initFB } from './_seeding'
import { Suspense, useRef } from 'react'
import { FetchingState } from './components/utils/Fetch/FetchingState/FetchingState'
import { Box, Stack } from '@material-ui/core'
import { ResizableWidth } from './components/editing/UFile/UImageFile/UImageFile'
import { Rec } from './components/utils/Rec'

// import { UAudioFileS } from './components/editing/UFile/UAudioFile/UAudioFile.stories'

ReactDOM.render(
  <Suspense fallback={<FetchingState />}>
    <Sandbox />
  </Suspense>,
  document.getElementById('root'),
)
