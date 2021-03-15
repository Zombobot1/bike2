import { Landing } from './landing';
import { SignUp } from './sign-up';
import { Sandbox } from './_sandbox';
import { Overview } from './overview';
import { SignIn } from './sign-in';
import { LostPassword } from './lost-password';
import { ResetPassword } from './reset-password';
import { Study, StudyTraining } from './study';
import { Decks } from './decks';
import { Schedule } from './schedule';
import { Settings } from './settings';

import { ReactComponent as OverviewI } from './icons/overview-icon-f.svg';
import { ReactComponent as StudyI } from './icons/study-icon-f.svg';
import { ReactComponent as DecksI } from './icons/decks-icon-f.svg';
import { ReactComponent as ScheduleI } from './icons/schedule-icon-f.svg';
import { ReactComponent as SettingsI } from './icons/settings-icon-f.svg';
import { ReactComponent as OverviewT } from './icons/overview-icon.svg';
import { ReactComponent as StudyT } from './icons/study-icon.svg';
import { ReactComponent as DecksT } from './icons/decks-icon.svg';
import { ReactComponent as ScheduleT } from './icons/schedule-icon.svg';
import { ReactComponent as SettingsT } from './icons/settings-icon.svg';
import { ReactComponent as SandboxT } from './icons/sandbox-icon.svg';
import { FC } from 'react';
import App from '../app';
import Page404 from './page404';
import { Redirect404 } from '../utils/routing';

export const LANDING = '/landing';
export const SIGNIN = '/signin';
export const SIGNUP = '/signup';
export const LOSTPASSWORD = '/lostpassword';
export const RESETPASSWORD = '/resetpassword';
export const _ROOT = '/';
export const _SANDBOX = '/_';
export const APP = '/app';
export const OVERVIEW = APP + '/overview';
export const STUDY = APP + '/study';
export const STUDYID = STUDY + '/:id';
export const DECKS = APP + '/decks';
export const SCHEDULE = APP + '/schedule';
export const SETTINGS = APP + '/settings';
export const _ANY = '*';
export const _PAGE404 = '/404';

export const PAGES = [
  { path: LANDING, component: Landing },
  { path: SIGNIN, component: SignIn },
  { path: SIGNUP, component: SignUp },
  { path: LOSTPASSWORD, component: LostPassword },
  { path: RESETPASSWORD, component: ResetPassword },
  { path: _SANDBOX, component: Sandbox },
  { path: _PAGE404, component: Page404 },
  {
    path: APP,
    component: App,
    routes: [
      { path: OVERVIEW, component: Overview },
      { path: STUDYID, component: StudyTraining },
      { path: STUDY, component: Study },
      { path: DECKS, component: Decks },
      { path: SCHEDULE, component: Schedule },
      { path: SETTINGS, component: Settings },
      { path: _ANY, component: Redirect404 },
    ],
  },
  { path: _ANY, component: Redirect404 },
];

export const ICONSF = {
  [OVERVIEW]: OverviewI,
  [STUDY]: StudyI,
  [DECKS]: DecksI,
  [SCHEDULE]: ScheduleI,
  [SETTINGS]: SettingsI,
};

export const ICONST: { [key: string]: FC } = {
  [OVERVIEW]: OverviewT,
  [STUDY]: StudyT,
  [DECKS]: DecksT,
  [SCHEDULE]: ScheduleT,
  [SETTINGS]: SettingsT,
  [_SANDBOX]: SandboxT,
};

export const toAppPage = (pageName: string) => `${APP}/${pageName.toLowerCase()}`;
export const iconForAppPage = (pageName: string) => {
  if (pageName === 'Sandbox') return ICONST[_SANDBOX]; // exception for /_ path
  return ICONST[toAppPage(pageName)];
};
