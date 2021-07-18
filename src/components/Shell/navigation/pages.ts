import { Sandbox } from '../../../_sandbox';
import { _SORYBOOK, SoryBook } from '../../../sorybook/sorybook';
import { App } from '../app';
import { TrainingWrapper } from '../../study/training/training/training';
import { Trainings } from '../../study/trainings/trainings';

export const _ROOT = '/';
export const _SANDBOX = '/_';

export const APP = '/';
export const STUDY = APP + 'study';
export const STUDYID = STUDY + '/:id';

export const PAGES = [
  { path: _SANDBOX, component: Sandbox },
  { path: _SORYBOOK, component: SoryBook },
  {
    path: APP,
    component: App,
    routes: [
      { path: STUDYID, component: TrainingWrapper },
      { path: STUDY, component: Trainings },
    ],
  },
];

export const toAppPage = (pageName: string) => `${APP}${pageName.toLowerCase()}`;
