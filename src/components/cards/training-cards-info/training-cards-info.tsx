import { ReactComponent as Clocks } from './clocks-fill-up-icon.svg';
import { ReactComponent as Glasses } from './glasses-icon.svg';
import React from 'react';
import { fancyNumber } from '../../../utils/formatting';

export interface TrainingCardsInfoP {
  toRepeat: number;
  toLearn: number;
}

const TrainingCardsInfo = ({ toRepeat, toLearn }: TrainingCardsInfoP) => {
  const repeatInfo = () => (
    <span>
      <Clocks />
      {fancyNumber(toRepeat)}
    </span>
  );
  const learnInfo = () => (
    <span>
      <Glasses />
      {fancyNumber(toLearn)}
    </span>
  );

  return (
    <span className="training-cards-number">
      {Boolean(toRepeat) && repeatInfo()} {Boolean(toLearn) && learnInfo()}
    </span>
  );
};

export default TrainingCardsInfo;
