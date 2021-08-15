import { Sandbox } from '../../../_sandbox'
import { App } from '../App'
import { TrainingWrapper } from '../../study/training/training/training'
import { Trainings } from '../../study/trainings/trainings'

export const _SANDBOX = '/_*'
export const _TO_SANDBOX = '/_'

export const APP = '/'
export const STUDY = APP + 'study'
export const STUDYID = STUDY + '/:id'

export const PAGES = [
  { path: _SANDBOX, component: Sandbox },
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
