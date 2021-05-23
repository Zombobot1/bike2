import './training-controls.scss';
import { capitalizeFirstLetter, cn } from '../../../../utils/utils';
import { ReactComponent as BackI } from '../../../pages/_sandbox/next-gen/arrow-left-short.svg';
import React, { useState } from 'react';
import { TrainingTimer } from './training-timer';
import { CardEstimation, cardEstimationToNumber, CardSide, CardType } from '../types';
import { Fn, NumStateT, StateT } from '../../../../utils/types';
import { useUForm } from '../../../pages/_sandbox/uform';
import { min } from '../../../../utils/algorithms';
import { EstimateCard } from '../training/hooks';

export interface TrainingControlsP {
  estimate: EstimateCard;
  currentCardSideS: StateT<CardSide>;
  cardType: CardType;
  timeToAnswerS: NumStateT;
  isTimerRunning: boolean;
}

interface EstimationBtnP {
  btnClass: string;
  estimation: CardEstimation;
  estimate: EstimateCard;
}

const EstimationBtn = ({ btnClass, estimate, estimation }: EstimationBtnP) => (
  <button type="button" className={'btn ' + btnClass} onClick={() => estimate(estimation)}>
    {capitalizeFirstLetter(estimation)}
  </button>
);

interface PassiveEstimateBtnP {
  currentCardSideS: StateT<CardSide>;
  estimate: EstimateCard;
}

const PassiveEstimateBtn = ({ currentCardSideS, estimate }: PassiveEstimateBtnP) => {
  const [currentCardSide, setCurrentSide] = currentCardSideS;
  return (
    <>
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
    </>
  );
};

interface InteractiveEstimateBtnP {
  estimate: EstimateCard;
}
type GoToNextFn = { go: Fn };
const InteractiveEstimateBtn = ({ estimate }: InteractiveEstimateBtnP) => {
  const [goToNextCard, setGoToNextCard] = useState<GoToNextFn | null>(null);

  const { submit, isSubmitted } = useUForm((estimations) => {
    const finalMark = min(estimations, (e) => cardEstimationToNumber(e.estimation));
    const gtnc = estimate(finalMark.estimation, 'NO_TRANSITION');
    if (gtnc) setGoToNextCard({ go: gtnc });
  });

  const goToNext = () => {
    if (!goToNextCard) return;
    goToNextCard.go();
    setGoToNextCard(null);
  };
  return (
    <>
      {!isSubmitted && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={submit}>
          Estimate
        </button>
      )}
      {isSubmitted && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={goToNext}>
          Next
        </button>
      )}
    </>
  );
};

export const TrainingControls = ({
  cardType,
  estimate,
  timeToAnswerS,
  currentCardSideS,
  isTimerRunning,
}: TrainingControlsP) => {
  const fail = () => estimate('BAD');

  const [currentCardSide, setCurrentSide] = currentCardSideS;

  const backICN = cn('bi bi-arrow-left-short transparent-button', { invisible: currentCardSide === 'FRONT' });
  return (
    <div className="controls">
      <BackI className={backICN} onClick={() => setCurrentSide('FRONT')} />
      {cardType === 'PASSIVE' && <PassiveEstimateBtn estimate={estimate} currentCardSideS={currentCardSideS} />}
      {cardType === 'INTERACTIVE' && <InteractiveEstimateBtn estimate={estimate} />}
      <TrainingTimer onTimeout={fail} timeToAnswerS={timeToAnswerS} isRunning={isTimerRunning} />
    </div>
  );
};
