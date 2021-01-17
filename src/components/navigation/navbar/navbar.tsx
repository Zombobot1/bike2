import './navbar.scss';
import { useRouter } from '../../utils/hooks/use-router';
import { ICONSF } from '../../pages';
import { Link } from 'react-router-dom';
import { ReactComponent as Help } from '../../pages/icons/help-icon-f.svg';
import { ReactComponent as Logo } from '../../pages/icons/uni-icon.svg';
import React from 'react';
import Avatar from './avatar/avatar';
import Notifications from '../../notifications';
import { cn } from '../../../utils/utils';

export interface NavBarP {
  visibility: boolean;
  toggleVisibility: () => void;
}

const NavBar = ({ visibility, toggleVisibility }: NavBarP) => {
  const router = useRouter();
  return (
    <>
      <nav className={cn('navbar', { 'navbar--visible': visibility })}>
        <div className="h-100 d-flex flex-column justify-content-between">
          <div className="avatar-and-bell d-flex flex-column justify-content-between align-items-center">
            <Avatar />
            <Notifications />
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
      <div className={cn('nav-backdrop', { 'nav-backdrop--visible': visibility })} onClick={toggleVisibility} />
    </>
  );
};

export default NavBar;
