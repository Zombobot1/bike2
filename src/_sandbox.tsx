import { SoryBook } from './sorybook/sorybook'
import ReactDOM from 'react-dom'

_initFB()

const Sandbox = () => {
  return (
    <OuterShell>
      <SoryBook
        sories={[
          App,
          Fetch,
          FetchingState,
          Page404,
          ThemeBtn,
          LoginPage,
          NavBar,
          UCard,
          UForm,
          UFormBlock,
          UChecks,
          UInput,
          UTextS,
          UPageS,
        ]}
      />
    </OuterShell>
  )
}

import * as App from './components/utils/Shell/App/App.stories'
import * as Fetch from './components/utils/Fetch/Fetch.stories'
import * as FetchingState from './components/utils/Fetch/FetchingState/FetchingState.stories'
import * as ThemeBtn from './components/utils/Shell/theming/ThemeBtn.stories'
import * as Page404 from './components/utils/Shell/Page404/Page404.stories'
import * as LoginPage from './components/utils/Shell/LoginPage/LoginPage.stories'
import * as NavBar from './components/utils/Shell/navigation/NavBar/NavBar.stories'
import * as UCard from './components/decks/UCard/UCard.stories'
import * as UForm from './components/uforms/UForm.stories'
import * as UChecks from './components/uforms/UFormBlock/UChecks/UChecks.stories'
import * as UInput from './components/uforms/UFormBlock/UInput/UInput.stories'
import * as UFormBlock from './components/uforms/UFormBlock/UFormBlock.stories'
import * as UTextS from './components/editing/UText/UText.stories'
import * as UPageS from './components/editing/UPage/UPage.stories'
import { OuterShell } from './components/utils/Shell/Shell'
import { _initFB } from './_seeding'

// import { UFileS } from '../components/editing/UFile/UFile.stories'
// import { UAudioFileS } from './components/editing/UFile/UAudioFile/UAudioFile.stories'
// import { UImageFileS } from '../components/editing/UFile/UImageFile/UImageFile.stories'

ReactDOM.render(<Sandbox />, document.getElementById('root'))
