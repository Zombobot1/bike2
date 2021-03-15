import './training-controls.scss';
import { StateT } from '../../../forms/hoc/with-validation';
import { cn } from '../../../../utils/utils';
import { ReactComponent as BackI } from '../../../pages/_sandbox/next-gen/arrow-left-short.svg';
import React from 'react';
import { TrainingTimer } from './training-timer';
import { AnswerEstimation, CardSide } from '../types';

export interface TrainingControlsP {
  cardSideS: StateT<CardSide>;
  secsLeftS: StateT<number>;
  estimate: (v: AnswerEstimation) => void;
}

export interface EstimationBtnP {
  btnClass: string;
  estimation: AnswerEstimation;
  estimate: (v: AnswerEstimation) => void;
}

export const EstimationBtn = ({ btnClass, estimate, estimation }: EstimationBtnP) => (
  <button type="button" className={'btn ' + btnClass} onClick={() => estimate(estimation)}>
    {AnswerEstimation[estimation]}
  </button>
);

export const TrainingControls = ({ cardSideS, secsLeftS, estimate }: TrainingControlsP) => {
  const [cardSide, setCardSide] = cardSideS;

  const fail = () => estimate(AnswerEstimation.Bad);

  const backICN = cn('bi bi-arrow-left-short transparent-button', { invisible: cardSide === 'FRONT' });
  return (
    <div className="controls">
      <BackI className={backICN} onClick={() => setCardSide('FRONT')} />
      {cardSide === 'FRONT' && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={() => setCardSide('BACK')}>
          Estimate
        </button>
      )}
      {cardSide === 'BACK' && (
        <div className="btn-group" role="group">
          <EstimationBtn btnClass="btn-danger" estimate={estimate} estimation={AnswerEstimation.Bad} />
          <EstimationBtn btnClass="btn-warning" estimate={estimate} estimation={AnswerEstimation.Poor} />
          <EstimationBtn btnClass="btn-success" estimate={estimate} estimation={AnswerEstimation.Good} />
          <EstimationBtn btnClass="btn-info" estimate={estimate} estimation={AnswerEstimation.Easy} />
        </div>
      )}
      <TrainingTimer secsLeftS={secsLeftS} onTimeout={fail} />
    </div>
  );
};
