import { storify } from './utils'
import * as UCard from '../components/decks/UCard/UCard.s'
import * as UCardEditor from '../components/decks/UCardEditor/UCardEditor.s'
import * as UCardField from '../components/decks/UCard/UCardField/UCardField.s'
import * as Training from '../components/study/training/training/training.s'
import * as TrainingHeader from '../components/study/training/training-header/training-header.s'
import * as TrainingControls from '../components/study/training/training-controls/training-controls.s'
import * as UFormHook from '../components/uform/uform.s'
import { UChecksS } from '../components/uform/UFormBlock/UChecks/UChecks.stories'
import { UInputS } from '../components/uform/UFormBlock/UInput/UInput.stories'
import { UFormBlockS } from '../components/uform/UFormBlock/UFormBlock.stories'
import * as UTable from '../components/ucomponents/UTable/UTable.s'
import { UTextS } from '../components/ucomponents/UText/UText.stories'
import { UFileS } from '../components/ucomponents/UFile/UFile.stories'
import { UAudioFileS } from '../components/ucomponents/UFile/UAudioFile/UAudioFile.stories'
import { UImageFileS } from '../components/ucomponents/UFile/UImageFile/UImageFile.stories'
import { UPageS } from '../components/ucomponents/UPage/UPage.stories'
import * as TrainingTimer from '../components/study/training/training-timer/trainingTimer.s'
import * as TrainingEnd from '../components/study/training/TrainingEnd/TrainingEnd.s'
import * as Breadcrumb from '../components/Shell/navigation/breadcrumb/breadcrumb.s'
import * as TrainingCard from '../components/study/trainings/training-deck/training-card/trainingCard.s'
import * as TrainingDeck from '../components/study/trainings/training-deck/TrainingDeck.s'
import * as Trainings from '../components/study/trainings/Trainings.s'
import * as FetchedData from '../components/utils/FetchedData.s'
import * as Slides from '../components/utils/Slides.s'

export const sories = [
  {
    name: 'Trainings',
    components: [
      storify({ Trainings }),
      storify({ TrainingDeck }),
      storify({ TrainingCard }),
      storify({ Training }),
      storify({ TrainingHeader }),
      storify({ TrainingControls }),
      storify({ TrainingEnd }),
      storify({ TrainingTimer }),
    ],
  },
  {
    name: 'Decks',
    components: [storify({ UCardEditor }), storify({ UCard }), storify({ UCardField })],
  },
  {
    name: 'UComponents',
    components: [
      storify({ UTable }),
      storify({ UTextS }),
      storify({ UFileS }),
      storify({ UAudioFileS }),
      storify({ UImageFileS }),
      storify({ UPageS }),
    ],
  },
  {
    name: 'UForm',
    components: [storify({ UFormHook }), storify({ UFormBlockS }), storify({ UChecksS }), storify({ UInputS })],
  },
  {
    name: 'Utils',
    components: [storify({ Slides }), storify({ FetchedData }), storify({ Breadcrumb })],
  },
]
