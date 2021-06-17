import 'bootstrap';
import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { TrainingHeader } from '../../components/study/training/training-header';
import { fn } from '../../utils/types';
import { useEffectedState, useMount } from '../../utils/hooks-utils';
import { useTrainingTimer } from '../../components/study/training/training-timer/training-timer';

export default {
  title: 'Training/Training header',
  component: TrainingHeader,
} as Meta;

interface TemplateP {
  oneCardTimeToAnswer: number;
  cardsLength: number;
  currentCardIndex: number;
  timeLeft: number;
  showMore?: boolean;
}

const Template = ({ cardsLength, oneCardTimeToAnswer, currentCardIndex, timeLeft, showMore = true }: TemplateP) => {
  const [cci, setCci] = useEffectedState(currentCardIndex);
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
          handlers={{ onCardDelete: fn, onModalClose: fn, onModalShow: fn }}
          timeToFinish={ttf}
          cardsLength={cardsLength}
          currentCardIndex={cci}
        />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ width: '500px' }}>
      <TrainingHeader
        cardId={'1'}
        handlers={{ onCardDelete: fn, onModalClose: fn, onModalShow: fn }}
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

const Template_: Story<TemplateP> = (args) => <Template {...args} />;

const atStart: TemplateP = {
  cardsLength: 10,
  oneCardTimeToAnswer: 65,
  currentCardIndex: 0,
  timeLeft: 99,
};

const atTimeout: TemplateP = {
  cardsLength: 110,
  oneCardTimeToAnswer: 65,
  currentCardIndex: 56,
  timeLeft: 1,
};

export const OriginalHeader = Template_.bind({});
OriginalHeader.args = {
  ...atStart,
  showMore: false,
  currentCardIndex: 67,
};

export const AtStart = Template_.bind({});
AtStart.args = {
  ...atStart,
};

export const AtEnd = Template_.bind({});
AtEnd.args = {
  ...atStart,
  currentCardIndex: 9,
};

export const AtTimeout = Template_.bind({});
AtTimeout.args = {
  ...atTimeout,
};
