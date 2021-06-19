import { useEffectedState, useMount } from '../../../../utils/hooks-utils';
import React, { useState } from 'react';
import { useTrainingTimer } from '../training-timer/training-timer';
import { TrainingHeader } from './training-header';
import { fn } from '../../../../utils/types';

export interface TrainingHeaderTP {
  oneCardTimeToAnswer: number;
  cardsLength: number;
  currentCardIndex: number;
  timeLeft: number;
  showMore?: boolean;
  mobileWidth?: string;
}

export const TrainingHeaderT = ({
  cardsLength,
  oneCardTimeToAnswer,
  currentCardIndex,
  timeLeft,
  showMore = true,
  mobileWidth,
}: TrainingHeaderTP) => {
  const [cci, setCci] = useEffectedState(currentCardIndex);
  const [wasDeleted, setWasDeleted] = useState(false);
  const ttf = (cardsLength - cci) * oneCardTimeToAnswer;

  const [isTimeOut, setIsTimeOut] = useState(false);
  const { setTimeToAnswer, setOnTimeout } = useTrainingTimer();

  useMount(() => {
    setOnTimeout(() => setIsTimeOut(true));
    setTimeToAnswer(timeLeft);
  });

  if (!showMore) {
    return (
      <div className="d-flex flex-column" style={{ width: '500px' }}>
        <TrainingHeader
          cardId={'1'}
          deleteCard={fn}
          timeToFinish={ttf}
          cardsLength={cardsLength}
          currentCardIndex={cci}
        />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ width: mobileWidth ? mobileWidth : '500px' }}>
      <TrainingHeader
        cardId={'1'}
        deleteCard={() => setWasDeleted(true)}
        timeToFinish={ttf}
        cardsLength={cardsLength}
        currentCardIndex={cci}
      />
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
      {wasDeleted && <h3 className="text-danger">Deleted card</h3>}
      {isTimeOut && (
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            setIsTimeOut(false);
            setTimeToAnswer(timeLeft);
          }}
        >
          Timout! Relaunch
        </button>
      )}
    </div>
  );
};

export const atStartA: TrainingHeaderTP = {
  cardsLength: 10,
  oneCardTimeToAnswer: 65,
  currentCardIndex: 0,
  timeLeft: 99,
};

export const atTimeoutA: TrainingHeaderTP = {
  cardsLength: 110,
  oneCardTimeToAnswer: 65,
  currentCardIndex: 56,
  timeLeft: 1,
};

export const originalHeaderA: TrainingHeaderTP = {
  ...atStartA,
  showMore: false,
  currentCardIndex: 67,
};

export const atEndA: TrainingHeaderTP = {
  ...atStartA,
  currentCardIndex: 9,
};

export const canDeleteCardA: TrainingHeaderTP = {
  ...atStartA,
};

export const longestCardsLeftInfo: TrainingHeaderTP = {
  ...atStartA,
  cardsLength: 99,
  oneCardTimeToAnswer: 70,
  mobileWidth: '380px',
};
