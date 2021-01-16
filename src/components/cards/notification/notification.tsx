import './notification.scss';
import React from 'react';
import { Overdue } from '../../icons/icons';
import { fancyDate } from '../../../utils/formatting';
import TrainingCardsInfo from '../training-cards-info';

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
  repeatingCardsNumber: number;
  receivingTime: string;
}

const Notification = ({
  overdue,
  deckColor,
  deckPath,
  deckName,
  repeatingCardsNumber,
  receivingTime,
}: NotificationP) => {
  return (
    <div className="notification">
      <span className="notification-description">It’s time to learn</span>
      <Overdue type={overdue} />
      <div className="d-flex deck">
        <div className="align-self-center deck-circle" style={{ backgroundColor: deckColor }} />
        <div className="d-flex flex-column deck-info">
          <p className="deck-path">{deckPath}</p>
          <p className="deck-name">{deckName}</p>
        </div>
        <TrainingCardsInfo className={'align-self-center ms-auto'} toRepeat={repeatingCardsNumber} toLearn={0} />
      </div>
      <p className="receiving-time text-end">{fancyDate(receivingTime)}</p>
    </div>
  );
};

export default Notification;
