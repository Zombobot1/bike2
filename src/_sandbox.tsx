import { SoryBook } from './sorybook/sorybook'
import ReactDOM from 'react-dom'

if (!isInProduction) setFSD(firestoreMockData)

const Sandbox = () => {
  return (
    <ErrorBoundary fallbackRender={({ error }) => <p>{error.message}</p>}>
      <OuterShell>
        <SoryBook
          sories={[
            UPage,
            UBlocksSet,
            UText,
            Code,
            Callout,
            Quote,
            UList,
            UGrid,
            UPageBlock,
            UTable,
            UDivider,
            Equation,
            UVideoFile,
            UFile,
            UAudioFile,
            UImageFile,
            BlockAutocomplete,
            UTextOptions,
            TableOfContents,
            UForm,
            InlineExercise,
            UChecks,
            UInput,
            UAutocomplete,
            CodeEditor,
            EditableText,
            Selection,
            ResizableWidth,
            Dropzone,
            UAudio,
            AppBar,
            NavBar,
            App,
            Fetch,
            FetchingStateS,
            Page404,
            ThemeBtn,
            LoginPage,
            UCard,
            IdeasViewer,
            SB,
          ]}
          sections={['Editing core', 'Editing extras', 'UForms', 'Ideas', 'App', 'Utils', 'Sandbox']}
        />
      </OuterShell>
    </ErrorBoundary>
  )
}

import * as UTextOptions from './components/editing/UText/UTextOptions/UTextOptions.stories'
import * as UDivider from './components/editing/UDivider/UDivider.stories'
import * as UGrid from './components/editing/UGrid/UGrid.stories'
import * as Equation from './components/editing/UEquation/UEquation.stories'
import * as CodeEditor from './components/utils/CodeEditor/CodeEditor.stories'
import * as UVideoFile from './components/editing/UFile/UVideoFile/UVideoFile.stories'
import * as UFile from './components/editing/UFile/UFile.stories'
import * as UAudio from './components/utils/UAudio/UAudio.stories'
import * as UAutocomplete from './components/utils/UAutocomplete/UAutocomplete.stories'
import * as UBlocksSet from './components/editing/UPage/UBlockSet/UBlockSet.stories'
import * as UTable from './components/editing/UTable/UTable.stories'
import * as TableOfContents from './components/editing/UPage/TableOfContents/TableOfContents.stories'
import * as UPageBlock from './components/editing/UPage/UPageBlock/UPageBlock.stories'
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
import * as UForm from './components/editing/UForm/UForm.stories'
import * as UChecks from './components/editing/UForm/UFormBlock/UChecks/UChecks.stories'
import * as UInput from './components/editing/UForm/UFormBlock/UInput/UInput.stories'
import * as InlineExercise from './components/editing/UForm/UFormBlock/InlineExercise/InlineExercise.stories'
import * as Code from './components/editing/UText/Code/Code.stories'
import * as Callout from './components/editing/UText/Callout/Callout.stories'
import * as Quote from './components/editing/UText/Quote/Quote.stories'
import * as UList from './components/editing/UList/UList.stories'
import * as UText from './components/editing/UText/UText.stories'
import * as BlockAutocomplete from './components/editing/UPage/UBlock/BlockAutocomplete/BlockAutocomplete.stories'
import * as UAudioFile from './components/editing/UFile/UAudioFile/UAudioFile.stories'
import * as UImageFile from './components/editing/UFile/UImageFile/UImageFile.stories'
import * as SB from './components/utils/Sandbox.stories'
import * as UCard from './components/studying/decks/UCard/UCard.stories'
import * as IdeasViewer from './components/studying/IdeasViewer/IdeasViewer.stories'
import { OuterShell } from './components/application/Shell'
import { Suspense } from 'react'
import { FetchingState } from './components/utils/Fetch/FetchingState/FetchingState'

import { ErrorBoundary } from 'react-error-boundary'
import { isInProduction } from './fb/utils'
import { setFSD } from './fb/firestore'
import { firestoreMockData } from './content/firestoreMockData'

if (![].at) {
  Array.prototype.at = function (i) {
    const arr = this as unknown as unknown[]
    return i < 0 ? arr[arr.length - -i] : arr[i]
  }
}

ReactDOM.render(
  <Suspense fallback={<FetchingState />}>
    <Sandbox />
  </Suspense>,
  document.getElementById('root'),
)
