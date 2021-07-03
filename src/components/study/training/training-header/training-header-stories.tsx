import { useEffectedState } from '../../../../utils/hooks-utils';
import React from 'react';
import { TrainingHeader } from './training-header';

export interface TrainingHeaderTP {
  oneCardTimeToAnswer: number;
  cardsLength: number;
  currentCardIndex: number;
  showMore?: boolean;
}

export const TrainingHeaderT = ({
  cardsLength,
  oneCardTimeToAnswer,
  currentCardIndex,
  showMore = true,
}: TrainingHeaderTP) => {
  const [cci, setCci] = useEffectedState(currentCardIndex);
  const ttf = (cardsLength - cci) * oneCardTimeToAnswer;

  if (!showMore) {
    return (
      <div className="d-flex flex-column" style={{ width: '500px' }}>
        <TrainingHeader timeToFinish={ttf} cardsLength={cardsLength} currentCardIndex={cci} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ width: '500px' }}>
      <TrainingHeader timeToFinish={ttf} cardsLength={cardsLength} currentCardIndex={cci} />
      <hr className="w-25 mt-3 mb-2 align-self-center" />
      <label htmlFor="customRange3" className="form-label">
        Current index
      </label>
      <input
        type="range"
        className="form-range mb-3"
        min="0"
        max={cardsLength - 1}
        step="1"
        id="customRange3"
        value={cci}
        onChange={(e) => setCci(+e.target.value)}
      />
    </div>
  );
};

const atStartA: TrainingHeaderTP = {
  cardsLength: 10,
  oneCardTimeToAnswer: 65,
  currentCardIndex: 0,
};

const originalHeaderA: TrainingHeaderTP = {
  ...atStartA,
  cardsLength: 110,
  showMore: false,
  currentCardIndex: 67,
};

const atEndA: TrainingHeaderTP = {
  ...atStartA,
  currentCardIndex: 9,
};

const longestCardsLeftInfo: TrainingHeaderTP = {
  ...atStartA,
  cardsLength: 99,
  oneCardTimeToAnswer: 70,
};

export const STrainingHeader = {
  OriginalHeader: () => <TrainingHeaderT {...originalHeaderA} />,
  AtStart: () => <TrainingHeaderT {...atStartA} />,
  AtEnd: () => <TrainingHeaderT {...atEndA} />,
  LongestCardsLeftInfo: () => <TrainingHeaderT {...longestCardsLeftInfo} />,
};
