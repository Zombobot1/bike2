import './training-controls.scss';
import { capitalizeFirstLetter, cn } from '../../../../utils/utils';
import { ReactComponent as BackI } from '../../../pages/_sandbox/next-gen/arrow-left-short.svg';
import React from 'react';
import { TrainingTimer } from './training-timer';
import { CardEstimation, CardSide } from '../types';
import { NumStateT, StateT } from '../../../../utils/types';

export interface TrainingControlsP {
  estimate: (v: CardEstimation) => void;
  currentCardSideS: StateT<CardSide>;
  timeToAnswerS: NumStateT;
}

export interface EstimationBtnP {
  btnClass: string;
  estimation: CardEstimation;
  estimate: (v: CardEstimation) => void;
}

export const EstimationBtn = ({ btnClass, estimate, estimation }: EstimationBtnP) => (
  <button type="button" className={'btn ' + btnClass} onClick={() => estimate(estimation)}>
    {capitalizeFirstLetter(estimation)}
  </button>
);

export const TrainingControls = ({ estimate, timeToAnswerS, currentCardSideS }: TrainingControlsP) => {
  const fail = () => estimate('BAD');

  const [currentCardSide, setCurrentSide] = currentCardSideS;

  const backICN = cn('bi bi-arrow-left-short transparent-button', { invisible: currentCardSide === 'FRONT' });
  return (
    <div className="controls">
      <BackI className={backICN} onClick={() => setCurrentSide('FRONT')} />
      {currentCardSide === 'FRONT' && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={() => setCurrentSide('BACK')}>
          Estimate
        </button>
      )}
      {currentCardSide === 'BACK' && (
        <div className="btn-group" role="group">
          <EstimationBtn btnClass="btn-danger" estimate={estimate} estimation={'BAD'} />
          <EstimationBtn btnClass="btn-warning" estimate={estimate} estimation={'POOR'} />
          <EstimationBtn btnClass="btn-success" estimate={estimate} estimation={'GOOD'} />
          <EstimationBtn btnClass="btn-info" estimate={estimate} estimation={'EASY'} />
        </div>
      )}
      <TrainingTimer onTimeout={fail} timeToAnswerS={timeToAnswerS} />
    </div>
  );
};
