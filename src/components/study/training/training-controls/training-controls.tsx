import './training-controls.scss';
import { StateT } from '../../../forms/hoc/with-validation';
import { cn } from '../../../../utils/utils';
import { ReactComponent as BackI } from '../../../pages/_sandbox/next-gen/arrow-left-short.svg';
import React from 'react';
import { CardSide } from '../qa-card/qa-card';
import { TrainingTimer } from './training-timer';
import { AnswerEstimation } from '../types';

export interface TrainingControlsP {
  cardSideS: StateT<CardSide>;
  timeoutSec: number;
  estimate: (v: AnswerEstimation) => void;
  nextCard: () => void;
}

export interface EstimationBtnP {
  btnClass: string;
  estimation: AnswerEstimation;
  estimate: (v: AnswerEstimation) => void;
}

const EstimationBtn = ({ btnClass, estimate, estimation }: EstimationBtnP) => (
  <button type="button" className={'btn ' + btnClass} onClick={() => estimate(estimation)}>
    {AnswerEstimation[estimation]}
  </button>
);

export const TrainingControls = ({ cardSideS, timeoutSec, nextCard, estimate }: TrainingControlsP) => {
  const [cardSide, setCardSide] = cardSideS;
  const makeEstimation = (e: AnswerEstimation) => {
    estimate(e);
    nextCard();
  };
  const fail = () => makeEstimation(AnswerEstimation.Bad);

  const backICN = cn('bi bi-arrow-left-short transparent-button', { invisible: cardSide === CardSide.Front });
  return (
    <div className="d-flex justify-content-between align-items-center controls">
      <BackI className={backICN} onClick={() => setCardSide(CardSide.Front)} />
      {cardSide === CardSide.Front && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={() => setCardSide(CardSide.Back)}>
          Estimate
        </button>
      )}
      {cardSide === CardSide.Back && (
        <div className="btn-group" role="group">
          <EstimationBtn btnClass="btn-danger" estimate={makeEstimation} estimation={AnswerEstimation.Bad} />
          <EstimationBtn btnClass="btn-warning" estimate={makeEstimation} estimation={AnswerEstimation.Poor} />
          <EstimationBtn btnClass="btn-success" estimate={makeEstimation} estimation={AnswerEstimation.Good} />
          <EstimationBtn btnClass="btn-info" estimate={makeEstimation} estimation={AnswerEstimation.Easy} />
        </div>
      )}
      <TrainingTimer timeout={{ sec: timeoutSec }} onTimeout={fail} />
    </div>
  );
};
