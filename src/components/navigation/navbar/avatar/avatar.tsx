import './avatar.scss';
import AvatarI from './avatar.png';
import { Link } from 'react-router-dom';
import { SETTINGS } from '../../../pages';
import { ReactComponent as SettingsThin } from '../../../pages/icons/settings-icon.svg';
import { ReactComponent as Logout } from '../../../pages/icons/logout.svg';
import React from 'react';

const Avatar = () => {
  return (
    <div className="btn-group dropend">
      <img src={AvatarI} alt="avatar" data-bs-toggle="dropdown" aria-expanded="false" />
      <ul className="dropdown-menu avatar__dropdown" aria-labelledby="dropdownMenuButton">
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

export default Avatar;
