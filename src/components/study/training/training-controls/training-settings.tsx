import { ReactComponent as Dots } from '../../../icons/three-dots-icon.svg';
import { ReactComponent as MarkI } from '../../../icons/patch-exclamation.svg';
import { ReactComponent as EditI } from '../../../icons/pen.svg';
import { ReactComponent as StopTimerI } from '../../../icons/hourglass.svg';
import { ReactComponent as TrashI } from '../../../icons/bi-trash.svg';
import React, { memo } from 'react';
import { AcceptanceModal } from '../../../utils/footless-modal';
import { Fn } from '../../../../utils/types';

const DELETE_CARD_MODAL_ID = 'delete-card';

export interface ActionOnCardHandlers {
  onModalShow: Fn;
  onModalClose: Fn;
  onCardDelete: Fn;
}

export interface TrainingSettingsP {
  handlers: ActionOnCardHandlers;
  cardId: string;
}

export const TrainingSettings = memo(
  function ({ handlers }: TrainingSettingsP) {
    const CardDeleteModal = AcceptanceModal(
      DELETE_CARD_MODAL_ID,
      handlers.onCardDelete,
      handlers.onModalShow,
      handlers.onModalClose,
    );

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
              <span className="dropdown-item d-flex align-items-center">
                <StopTimerI />
                Stop timer
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
  },
  (p, n) => p.cardId === n.cardId,
);
