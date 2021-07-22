import { storify } from './utils'
import * as UCard from '../components/decks/UCard/UCard.s'
import * as UCardEditor from '../components/decks/UCardEditor/UCardEditor.s'
import * as UCardField from '../components/decks/UCard/UCardField/UCardField.s'
import * as Training from '../components/study/training/training/training.s'
import * as TrainingHeader from '../components/study/training/training-header/training-header.s'
import * as TrainingControls from '../components/study/training/training-controls/training-controls.s'
import * as UFormHook from '../components/uform/uform.s'
import * as UChecksElement from '../components/uform/ufields/uchecks.s'
import * as UInputElement from '../components/uform/ufields/uinput.s'
import * as UTable from '../components/ucomponents/UTable.s'
import * as TrainingTimer from '../components/study/training/training-timer/trainingTimer.s'
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
      storify({ TrainingTimer }),
    ],
  },
  {
    name: 'UComponents',
    components: [storify({ UTable })],
  },
  {
    name: 'Decks',
    components: [storify({ UCardEditor }), storify({ UCard }), storify({ UCardField })],
  },
  {
    name: 'UForm',
    components: [storify({ UFormHook }), storify({ UChecksElement }), storify({ UInputElement })],
  },
  {
    name: 'Utils',
    components: [storify({ Slides }), storify({ FetchedData }), storify({ Breadcrumb })],
  },
]
