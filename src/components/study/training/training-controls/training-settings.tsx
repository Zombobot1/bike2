import { ReactComponent as Dots } from '../../../icons/three-dots-icon.svg';
import { ReactComponent as MarkI } from '../../../icons/patch-exclamation.svg';
import { ReactComponent as EditI } from '../../../icons/pen.svg';
import { ReactComponent as StopTimerI } from '../../../icons/hourglass.svg';
import React from 'react';

export const TrainingSettings = () => (
  <>
    <div className="btn-group dropleft settings">
      <Dots className="dropdown-toggle transparent-button three-dots-icon" data-bs-toggle="dropdown" />
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <li>
          <span className="dropdown-item d-flex align-items-center">
            <MarkI />
            Mark
          </span>
        </li>
        <li>
          <span className="dropdown-item d-flex align-items-center">
            <EditI />
            Edit
          </span>
        </li>
        <li>
          <span className="dropdown-item d-flex align-items-center">
            <StopTimerI />
            Stop timer
          </span>
        </li>
      </ul>
    </div>
  </>
);
