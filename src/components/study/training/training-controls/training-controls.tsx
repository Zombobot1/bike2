import './training-controls.scss';
import { StateT } from '../../../forms/hoc/with-validation';
import { capitalizeFirstLetter, cn } from '../../../../utils/utils';
import { ReactComponent as BackI } from '../../../pages/_sandbox/next-gen/arrow-left-short.svg';
import React from 'react';
import { TrainingTimer } from './training-timer';
import { CardEstimation, CardSide } from '../types';

export interface TrainingControlsP {
  cardSideS: StateT<CardSide>;
  secsLeftS: StateT<number>;
  estimate: (v: CardEstimation) => void;
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

export const TrainingControls = ({ cardSideS, secsLeftS, estimate }: TrainingControlsP) => {
  const [cardSide, setCardSide] = cardSideS;

  const fail = () => estimate('BAD');

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
          <EstimationBtn btnClass="btn-danger" estimate={estimate} estimation={'BAD'} />
          <EstimationBtn btnClass="btn-warning" estimate={estimate} estimation={'POOR'} />
          <EstimationBtn btnClass="btn-success" estimate={estimate} estimation={'GOOD'} />
          <EstimationBtn btnClass="btn-info" estimate={estimate} estimation={'EASY'} />
        </div>
      )}
      <TrainingTimer secsLeftS={secsLeftS} onTimeout={fail} />
    </div>
  );
};
