import { Sandbox } from '../../_sandbox';
import { _SORYBOOK, SoryBook } from '../../sorybook/sorybook';
import App from '../app';
import { Study, StudyTraining } from '../../study';
import { FC } from 'react';
import { ReactComponent as StudyT } from '../icons/study-icon.svg';
import { ReactComponent as SandboxT } from '../icons/sandbox-icon.svg';

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
  [STUDY]: StudyT,
  [_SANDBOX]: SandboxT,
};

export const toAppPage = (pageName: string) => `${APP}/${pageName.toLowerCase()}`;
export const iconForAppPage = (pageName: string) => {
  if (pageName === 'Sandbox') return ICONST[_SANDBOX]; // exception for /_ path
  return ICONST[toAppPage(pageName)];
};
