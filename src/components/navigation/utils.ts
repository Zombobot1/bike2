import { Sandbox } from '../../_sandbox';
import { _SORYBOOK, SoryBook } from '../../sorybook/sorybook';
import { App } from '../app/app';
import { Study, StudyTraining } from '../pages/study';
import { FC } from 'react';
import { ReactComponent as SandboxT } from '../icons/sandbox-icon.svg';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';

export const _ROOT = '/';
export const _SANDBOX = '/_';

export const APP = '/app';
export const STUDY = APP + '/study';
export const STUDYID = STUDY + '/:id';

export const PAGES = [
  { path: _SANDBOX, component: Sandbox },
  { path: _SORYBOOK, component: SoryBook },
  {
    path: APP,
    component: App,
    routes: [
      { path: STUDYID, component: StudyTraining },
      { path: STUDY, component: Study },
    ],
  },
];

export const ICONST: { [key: string]: FC } = {
  [STUDY]: MenuBookRoundedIcon,
  [_SANDBOX]: SandboxT,
};

export const toAppPage = (pageName: string) => `${APP}/${pageName.toLowerCase()}`;
