import { ReactComponent as Dots } from '../../../icons/three-dots-icon.svg';
import { ReactComponent as MarkI } from '../../../icons/patch-exclamation.svg';
import { ReactComponent as EditI } from '../../../icons/pen.svg';
import { ReactComponent as StopTimerI } from '../../../icons/hourglass.svg';
import { ReactComponent as TrashI } from '../../../icons/bi-trash.svg';
import React, { memo } from 'react';
import { AcceptanceModal } from '../../../utils/modal';
import { Fn } from '../../../../utils/types';
import { useTrainingTimer } from '../training-timer/training-timer';

const DELETE_CARD_MODAL_ID = 'delete-card';

export interface TrainingSettingsP {
  deleteCard: Fn;
  cardId: string;
}

interface TrainingSettings_P extends TrainingSettingsP {
  pauseTimer: Fn;
  resumeTimer: Fn;
  isTimerRunning: boolean;
}

const TrainingSettings_ = ({ deleteCard, isTimerRunning, pauseTimer, resumeTimer }: TrainingSettings_P) => {
  const CardDeleteModal = AcceptanceModal(DELETE_CARD_MODAL_ID, deleteCard, pauseTimer, resumeTimer);
  return (
    <>
      <CardDeleteModal />
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
            <span
              className="dropdown-item d-flex align-items-center"
              onClick={isTimerRunning ? pauseTimer : resumeTimer}
            >
              <StopTimerI />
              {isTimerRunning ? 'Stop' : 'Resume'} timer
            </span>
          </li>
          <li>
            <span
              className="dropdown-item d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target={`#${DELETE_CARD_MODAL_ID}`}
            >
              <TrashI />
              Delete
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

const TrainingSettingsMemoized = memo(
  function (props: TrainingSettings_P) {
    return <TrainingSettings_ {...props} />;
  },
  (p, n) => p.cardId === n.cardId,
);

export const TrainingSettings = ({ deleteCard, cardId }: TrainingSettingsP) => {
  const { pause, resume, isRunning } = useTrainingTimer();
  return (
    <TrainingSettingsMemoized
      pauseTimer={pause}
      resumeTimer={resume}
      isTimerRunning={isRunning}
      deleteCard={deleteCard}
      cardId={cardId}
    />
  );
};
