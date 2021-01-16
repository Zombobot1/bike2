import './training-cards-info.scss';
import { ReactComponent as Clocks } from './clocks-fill-up-icon.svg';
import { ReactComponent as Glasses } from './glasses-icon.svg';
import React from 'react';
import { fancyNumber } from '../../../utils/formatting';

export interface TrainingCardsInfoP {
  toRepeat: number;
  toLearn: number;
  className?: string;
}

const TrainingCardsInfo = ({ toRepeat, toLearn, className }: TrainingCardsInfoP) => {
  const repeatInfo = () => (
    <span className="repeat-info">
      <Clocks />
      {fancyNumber(toRepeat)}
    </span>
  );
  const learnInfo = () => (
    <span className="learn-info">
      <Glasses />
      {fancyNumber(toLearn)}
    </span>
  );

  return (
    <span className={'training-cards-number ' + className}>
      {Boolean(toRepeat) && repeatInfo()} {Boolean(toLearn) && learnInfo()}
    </span>
  );
};

export default TrainingCardsInfo;
