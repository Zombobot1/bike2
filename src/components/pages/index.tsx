import { Landing } from './landing';
import { SignUp } from './sign-up';
import { NavAndContent, Sandbox } from './_sandbox/_sandbox';
import { Overview } from './overview';
import { SignIn } from './sign-in';
import { LostPassword } from './lost-password';
import { ResetPassword } from './reset-password';
import { Study } from './study';
import { Page404 } from './page404';
import { Decks } from './decks';
import { Schedule } from './schedule';
import { Settings } from './settings';

import { ReactComponent as OverviewI } from './_sandbox/overview-icon-f.svg';
import { ReactComponent as StudyI } from './_sandbox/study-icon-f.svg';
import { ReactComponent as DecksI } from './_sandbox/decks-icon-f.svg';
import { ReactComponent as ScheduleI } from './_sandbox/schedule-icon-f.svg';
import { ReactComponent as SettingsI } from './_sandbox/settings-icon-f.svg';
import { ReactComponent as OverviewT } from './_sandbox/overview-icon.svg';
import { ReactComponent as StudyT } from './_sandbox/study-icon.svg';
import { ReactComponent as DecksT } from './_sandbox/decks-icon.svg';
import { ReactComponent as ScheduleT } from './_sandbox/schedule-icon.svg';
import { ReactComponent as SettingsT } from './_sandbox/settings-icon.svg';
import { FC } from 'react';

export const LANDING = '/landing';
export const SIGNIN = '/signin';
export const SIGNUP = '/signup';
export const LOSTPASSWORD = '/lostpassword';
export const RESETPASSWORD = '/resetpassword';
export const _SANDBOX = '/_';
export const _ROOT = '/';
export const OVERVIEW = '/overview';
export const STUDY = '/study';
export const DECKS = '/decks';
export const SCHEDULE = '/schedule';
export const SETTINGS = '/settings';
export const _ANY = '*';

export const PAGES = [
  { path: LANDING, component: Landing },
  { path: SIGNIN, component: SignIn },
  { path: SIGNUP, component: SignUp },
  { path: LOSTPASSWORD, component: LostPassword },
  { path: RESETPASSWORD, component: ResetPassword },
  { path: _SANDBOX, component: Sandbox },
  {
    path: _ROOT,
    component: NavAndContent,
    routes: [
      { path: OVERVIEW, component: Overview },
      { path: STUDY, component: Study },
      { path: DECKS, component: Decks },
      { path: SCHEDULE, component: Schedule },
      { path: SETTINGS, component: Settings },
      { path: _ANY, component: Page404 },
    ],
  },
  { path: _ANY, component: Page404 },
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
};
