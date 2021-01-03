import './notification.scss';
import { ReactComponent as Clocks } from '../../cards/training-cards-info/clocks-fill-up-icon.svg';
import React from 'react';
import { Overdue } from '../../icons/icons';
import { fancyDate } from '../../../utils/formatting';

export enum OverdueType {
  None,
  Warning,
  Danger,
}

export interface NotificationP {
  overdue: OverdueType;
  deckColor: string;
  deckPath: string;
  deckName: string;
  repeatingCardsNumberStr: string;
  receivingTime: string;
}

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
      <Overdue type={overdue} />
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
      <p className="receiving-time text-end">{fancyDate(receivingTime)}</p>
    </div>
  );
};

export default Notification;
