import './_sandbox.scss';
import React, { FC, useEffect, useRef, useState } from 'react';
import Avatar from './avatar.png';
import { ReactComponent as Bell } from './bell-icon-f.svg';
import { ReactComponent as SettingsThin } from './settings-icon.svg';
import { ReactComponent as Help } from './help-icon-f.svg';
import { ReactComponent as Logo } from './uni-icon.svg';
import { ReactComponent as Logout } from './logout.svg';
import { ReactComponent as Overdue } from './attention-icon.svg';
import { ReactComponent as Clocks } from './clocks-fill-up-icon.svg';
import { varName } from '../../../utils/objects';
import classNames from 'classnames';
import { ClassNamesFn, ClassValue } from 'classnames/types';
import { Link, Route, Switch } from 'react-router-dom';
import { buildRoutes, Routed } from '../../app/app';
import { useRouter } from '../../utils/hooks/use-router';
import { ICONSF, ICONST, SETTINGS } from '../index';
import { useToggle } from '../../utils/hooks/use-toggle';

type FooterP = {
  className: string;
};

const cn: ClassNamesFn = (...classes: ClassValue[]) => classNames(...classes);

const Footer = ({ className }: FooterP) => (
  <div className={'d-flex justify-content-between ' + className}>
    <p className="me-auto">{`Copyright © ${new Date().getFullYear()} Uni`}</p>
    <span className={'d-flex justify-content-between refs'}>
      <a href="#">About</a>
      <a href="#">Presentation</a>
      <a href="#">Contact</a>
    </span>
  </div>
);
const breadcrumbFromPath = (path: string) => {
  const root = path.slice(1);
  return root[0].toUpperCase() + root.slice(1);
};
const Breadcrumb = () => {
  const router = useRouter();
  const Icon = ICONST[router.pathname];
  return (
    <div className="d-flex breadcrumb-container">
      <Icon />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active">{breadcrumbFromPath(router.pathname)}</li>
        </ol>
      </nav>
    </div>
  );
};

const AvatarWithDropdown = () => {
  return (
    <div className="btn-group dropend">
      <img src={Avatar} alt="avatar" data-bs-toggle="dropdown" aria-expanded="false" />
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
          <Link className="dropdown-item" to={SETTINGS}>
            <SettingsThin />
            Settings
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a className="dropdown-item" href="#">
            <Logout />
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};
enum OverdueType {
  None,
  Warning,
  Danger,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cne = (enumKeyAndValue: any, enum_: any) => {
  const classBase = varName(enumKeyAndValue);
  const enumValueName = enum_[enumKeyAndValue[classBase]];
  return `${classBase}--${enumValueName}`.toLowerCase();
};

type NotificationP = {
  overdue: OverdueType;
  deckColor: string;
  deckPath: string;
  deckName: string;
  repeatingCardsNumberStr: string;
  receivingTime: string;
};
const Notification = ({
  overdue,
  deckColor,
  deckPath,
  deckName,
  repeatingCardsNumberStr,
  receivingTime,
}: NotificationP) => {
  return (
    <div className="notification">
      <span className="notification-description">It’s time to learn</span>
      <Overdue className={cne({ overdue }, OverdueType)} />
      <div className="d-flex deck">
        <div className="align-self-center deck-circle" style={{ backgroundColor: deckColor }} />
        <span>
          <span className="deck-path">{deckPath}</span>
          <br />
          <span className="deck-name">{deckName}</span>
        </span>
        <span className="align-self-center ms-auto cards-number">
          <Clocks />
          {repeatingCardsNumberStr}
        </span>
      </div>
      <p className="receiving-time text-end">{receivingTime}</p>
    </div>
  );
};

type NotificationsP = {
  notifications: NotificationP[];
};

const useEventListener = (eventName: string, handler: (e: Event) => void, ref: any) => {
  useEffect(() => {
    const eventListener = (event: Event) => handler(event);
    ref.current.addEventListener(eventName, eventListener);
    return () => ref.current.removeEventListener(eventName, eventListener);
  }, [eventName, ref]);
};

const Notifications = ({ notifications }: NotificationsP) => {
  const [hasNew, setHasNew] = useState(true);
  const onClick = () => setHasNew(false);
  const ref = useRef(null);
  useEventListener('show.bs.dropdown', onClick, ref);
  const containerNames = cn('transparent-button bell-container', { 'bell-container--active': hasNew });
  // const containerNames = cn('transparent-button bell-container');
  return (
    <div className="btn-group dropend" ref={ref}>
      <button className={containerNames} data-bs-toggle="dropdown" aria-expanded="false">
        <Bell />
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
          <p className="dropdown-item text-center">Notifications</p>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        {notifications.map((e, i) => (
          <li key={i}>
            <Notification {...e} />
          </li>
        ))}
        <li>
          <a className="dropdown-item text-center" href="#">
            View all
          </a>
        </li>
      </ul>
    </div>
  );
};

const testNotification = {
  overdue: OverdueType.Warning,
  deckColor: '#FF5151',
  deckPath: 'Statistical methods / Lectures',
  deckName: 'Bayesian approach',
  repeatingCardsNumberStr: '234',
  receivingTime: '2 hrs ago',
};
const testNotification2 = {
  overdue: OverdueType.None,
  deckColor: '#FC5C9F',
  deckPath: 'C++ programming language',
  deckName: 'Chapter 1',
  repeatingCardsNumberStr: '1.2k',
  receivingTime: '1 d ago',
};
const testNotifications = [testNotification, testNotification2, testNotification, testNotification2, testNotification];

const NavBar = () => {
  const router = useRouter();
  console.log('aa', router.pathname, router.query);
  return (
    <nav className="navbar">
      <div className="h-100 d-flex flex-column justify-content-between">
        <div className="avatar-and-bell d-flex flex-column justify-content-between align-items-center">
          <AvatarWithDropdown />
          <Notifications notifications={testNotifications} />
        </div>
        <ul className="navbar-nav">
          {Object.entries(ICONSF).map(([path, Icon], i) => (
            <li className="nav-item" key={i}>
              <Link to={path} className={cn('nav-link', { 'nav-link--active': path === router.pathname })}>
                <Icon />
              </Link>
            </li>
          ))}
          <li className="nav-item">
            <a href="#" className="nav-link">
              <Help />
            </a>
          </li>
        </ul>
        <Logo />
      </div>
    </nav>
  );
};

export const NavAndContent = ({ routes }: Routed) => {
  return (
    <>
      <NavBar />
      <main className="content-area">
        <Breadcrumb />
        <Switch>{routes?.map(buildRoutes)}</Switch>
        <Footer className="footer" />
      </main>
    </>
  );
};

const Sandbox = () => {
  return (
    <div>
      <NavAndContent />
    </div>
  );
};

export { Sandbox };
