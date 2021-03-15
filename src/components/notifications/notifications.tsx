import './notifications.scss';
import React, { useState } from 'react';
import { ReactComponent as Bell } from '../pages/icons/bell-icon-f.svg';
import Notification from '../cards/notification';
import { useEventListener } from '../utils/hooks/use-event-listener';
import { useInfo } from '../context/info-provider';
import { cn } from '../../utils/utils';

const Notifications = () => {
  const info = useInfo();
  const [hasNew, setHasNew] = useState(true);
  const ref = useEventListener('show.bs.dropdown', () => setHasNew(false));
  const containerNames = cn('transparent-button bell-container', { 'bell-container--active': hasNew });
  return (
    <div className="btn-group dropend" ref={ref}>
      <button className={containerNames} data-bs-toggle="dropdown" aria-expanded="false">
        <Bell />
      </button>
      <ul className="dropdown-menu notifications__dropdown" aria-labelledby="dropdownMenuButton">
        <li>
          <p className="dropdown-item text-center">Notifications</p>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        {info.notifications.map((e, i) => (
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

export default Notifications;
