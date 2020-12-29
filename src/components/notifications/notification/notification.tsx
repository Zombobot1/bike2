import './notification.scss';
import { ReactComponent as Overdue } from '../../pages/icons/attention-icon.svg';
import { ReactComponent as Clocks } from '../../pages/icons/clocks-fill-up-icon.svg';
import React from 'react';
import { cne } from '../../../utils/utils';

export enum OverdueType {
  None,
  Warning,
  Danger,
}

export type NotificationP = {
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

export default Notification;
