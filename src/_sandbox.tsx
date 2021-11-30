import { SoryBook } from './sorybook/sorybook'
import ReactDOM from 'react-dom'
let init = { read: fn }
if (process.env.NODE_ENV !== 'development' || !_MOCK_FB) init = wrapPromise(_initFB())

const Sandbox = () => {
  init.read()

  return (
    <OuterShell>
      <SoryBook
        sories={[
          UTextOptions,
          UDivider,
          Equation,
          UVideoFile,
          UAutocomplete,
          CodeEditor,
          Code,
          Callout,
          Quote,
          BlockAutocomplete,
          EditableText,
          InlineQuestion,
          Selection,
          ResizableWidth,
          UList,
          Dropzone,
          UBlocksSet,
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
          UText,
          SB,
        ]}
      />
    </OuterShell>
  )
}

import * as UTextOptions from './components/editing/UText/UTextOptions/UTextOptions.stories'
import * as UDivider from './components/editing/UDivider/UDivider.stories'
import * as Equation from './components/editing/Equation/Equation.stories'
import * as CodeEditor from './components/utils/CodeEditor/CodeEditor.stories'
import * as UVideoFile from './components/editing/UFile/UVideoFile/UVideoFile.stories'
import * as UFile from './components/editing/UFile/UFile.stories'
import * as UAudio from './components/utils/UAudio/UAudio.stories'
import * as UAutocomplete from './components/utils/UAutocomplete/UAutocomplete.stories'
import * as UBlocksSet from './components/editing/UPage/UBlocksSet/UBlocksSet.stories'
import * as UPage from './components/editing/UPage/UPage.stories'
import * as AppBar from './components/application/navigation/AppBar/AppBar.stories'
import * as NavBar from './components/application/navigation/NavBar/NavBar.stories'
import * as App from './components/application/App/App.stories'
import * as Selection from './components/utils/Selection/Selection.stories'
import * as EditableText from './components/utils/EditableText/EditableText.stories'
import * as Dropzone from './components/utils/Dropzone/Dropzone.stories'
import * as ResizableWidth from './components/utils/ResizableWidth/ResizableWidth.stories'
import * as Fetch from './components/utils/Fetch/Fetch.stories'
import * as FetchingStateS from './components/utils/Fetch/FetchingState/FetchingState.stories'
import * as ThemeBtn from './components/application/theming/ThemeBtn.stories'
import * as Page404 from './components/application/Page404/Page404.stories'
import * as LoginPage from './components/application/LoginPage/LoginPage.stories'
import * as UCard from './components/decks/UCard/UCard.stories'
import * as UForm from './components/uforms/UForm.stories'
import * as UChecks from './components/uforms/UFormBlock/UChecks/UChecks.stories'
import * as UInput from './components/uforms/UFormBlock/UInput/UInput.stories'
import * as InlineQuestion from './components/uforms/UFormBlock/InlineQuestion/InlineQuestion.stories'
import * as UFormBlock from './components/uforms/UFormBlock/UFormBlock.stories'
import * as Code from './components/editing/UText/Code/Code.stories'
import * as Callout from './components/editing/UText/Callout/Callout.stories'
import * as Quote from './components/editing/UText/Quote/Quote.stories'
import * as UList from './components/editing/UText/UList/UList.stories'
import * as UText from './components/editing/UText/UText.stories'
import * as BlockAutocomplete from './components/editing/UBlock/BlockAutocomplete/BlockAutocomplete.stories'
import * as UAudioFile from './components/editing/UFile/UAudioFile/UAudioFile.stories'
import * as UImageFile from './components/editing/UFile/UImageFile/UImageFile.stories'
import * as SB from './components/utils/Sandbox.stories'
import { OuterShell } from './components/application/Shell'
import { wrapPromise, _initFB } from './_seeding'
import { Suspense } from 'react'
import { FetchingState } from './components/utils/Fetch/FetchingState/FetchingState'

import { _MOCK_FB } from './fb/utils'
import { fn } from './utils/types'

// import { UAudioFileS } from './components/editing/UFile/UAudioFile/UAudioFile.stories'

ReactDOM.render(
  <Suspense fallback={<FetchingState />}>
    <Sandbox />
  </Suspense>,
  document.getElementById('root'),
)
