import { Sandbox } from '../../../../_sandbox'
import { App } from '../App'
import { TrainingWrapper } from '../../../studying/training/training/training'
import { Trainings } from '../../../studying/trainings/trainings'
import { FinishRegistration } from '../LoginPage/LoginPage'

export const _SANDBOX = '/_*'
export const _TO_SANDBOX = '/_'

export const APP = '/'
export const FINISH_REGISTRATION = APP + 'finish-registration'
export const STUDY = APP + 'study'
export const STUDYID = STUDY + '/:id'

export const PAGES = [
  { path: _SANDBOX, component: Sandbox },
  { path: FINISH_REGISTRATION, component: FinishRegistration },
  {
    path: APP,
    component: App,
    routes: [
      { path: STUDYID, component: TrainingWrapper },
      { path: STUDY, component: Trainings },
    ],
  },
]

export const toAppPage = (pageName: string) => `${APP}${pageName.toLowerCase()}`
