import './training-controls.scss';
import { StateT } from '../../../forms/hoc/with-validation';
import { cn } from '../../../../utils/utils';
import { ReactComponent as BackI } from '../../../pages/_sandbox/next-gen/arrow-left-short.svg';
import React, { useState } from 'react';
import { TrainingTimer } from './training-timer';
import { AnswerEstimation, CardSide } from '../types';

export interface TrainingControlsP {
  cardSideS: StateT<CardSide>;
  secsLeftS: StateT<number>;
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

export const TrainingControls = ({ cardSideS, secsLeftS, nextCard, estimate }: TrainingControlsP) => {
  const [cardSide, setCardSide] = cardSideS;

  const makeEstimation = (e: AnswerEstimation) => {
    estimate(e);
    nextCard();
  };
  const fail = () => makeEstimation(AnswerEstimation.Bad);

  const backICN = cn('bi bi-arrow-left-short transparent-button', { invisible: cardSide === 'FRONT' });
  return (
    <div className="d-flex justify-content-between align-items-center controls">
      <BackI className={backICN} onClick={() => setCardSide('FRONT')} />
      {cardSide === 'FRONT' && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={() => setCardSide('BACK')}>
          Estimate
        </button>
      )}
      {cardSide === 'BACK' && (
        <div className="btn-group" role="group">
          <EstimationBtn btnClass="btn-danger" estimate={makeEstimation} estimation={AnswerEstimation.Bad} />
          <EstimationBtn btnClass="btn-warning" estimate={makeEstimation} estimation={AnswerEstimation.Poor} />
          <EstimationBtn btnClass="btn-success" estimate={makeEstimation} estimation={AnswerEstimation.Good} />
          <EstimationBtn btnClass="btn-info" estimate={makeEstimation} estimation={AnswerEstimation.Easy} />
        </div>
      )}
      <TrainingTimer secsLeftS={secsLeftS} onTimeout={fail} />
    </div>
  );
};
