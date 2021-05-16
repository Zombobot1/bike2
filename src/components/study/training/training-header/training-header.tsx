import './training-header.scss';
import { COLORS } from '../../../../config';
import React from 'react';
import { ProgressBar } from '../../../controls/progress-bar';
import { FullScreenTrigger } from '../../../utils/full-screen-trigger';
import { fancyTime } from '../../../../utils/formatting';
import { TrainingSettings, TrainingSettingsP } from '../training-controls/training-settings';

export interface TrainingHeaderP extends TrainingSettingsP {
  deckName: string;
  timeToFinish: number;
  progress: number;
}

export const TrainingHeader = ({ deckName, progress, timeToFinish, handlers, cardId }: TrainingHeaderP) => (
  <>
    <h3 className="header">{'Learning ' + deckName}</h3>
    <div className="d-flex align-items-center heading">
      <ProgressBar className="align-self-center me-2" value={progress} color={COLORS.tertiary} />
      <span className="align-self-center me-auto cards-left-info">{fancyTime(timeToFinish)} left.</span>
      <FullScreenTrigger />
      <TrainingSettings handlers={handlers} cardId={cardId} />
    </div>
  </>
);
