import './training-controls.scss';
import { capitalizeOnlyFirstLetter, cn } from '../../../../utils/utils';
import { ReactComponent as BackI } from '../../../pages/_sandbox/next-gen/arrow-left-short.svg';
import React, { useState } from 'react';
import { TrainingTimer } from './training-timer';
import { CardEstimation, cardEstimationToNumber, CardSide, CardType } from '../types';
import { Fn, NumStateT, StateT } from '../../../../utils/types';
import { Estimations, useUFormSubmit } from '../../../uform/uform';
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
    {capitalizeOnlyFirstLetter(estimation)}
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

type GoToNextCard = { go: Fn } | null;

interface InteractiveEstimateBtnP {
  isSubmitted: boolean;
  sumbit: Fn;
  goToNextCard: Fn;
}

const InteractiveEstimateBtn = ({ isSubmitted, sumbit, goToNextCard }: InteractiveEstimateBtnP) => {
  return (
    <>
      {!isSubmitted && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={sumbit}>
          Estimate
        </button>
      )}
      {isSubmitted && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={goToNextCard}>
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
  const { submit } = useUFormSubmit();

  const [goToNextCardFn, setGoToNextCardFn] = useState<GoToNextCard | null>(null);

  const onSubmit = (estimations: Estimations) => {
    const finalMark = min(estimations, (e) => cardEstimationToNumber(e.estimation));
    const gtnc = estimate(finalMark.estimation, 'NO_TRANSITION');
    if (gtnc) setGoToNextCardFn({ go: gtnc });
  };

  const goToNextCard = () => {
    if (!goToNextCardFn) return;
    goToNextCardFn.go();
    setGoToNextCardFn(null);
  };

  const fail = () => estimate('BAD');

  const [currentCardSide, setCurrentSide] = currentCardSideS;

  const backICN = cn('bi bi-arrow-left-short transparent-button', { invisible: currentCardSide === 'FRONT' });
  return (
    <div className="controls">
      <BackI className={backICN} onClick={() => setCurrentSide('FRONT')} />
      {cardType === 'PASSIVE' && <PassiveEstimateBtn estimate={estimate} currentCardSideS={currentCardSideS} />}
      {cardType === 'INTERACTIVE' && (
        <InteractiveEstimateBtn
          sumbit={() => submit(onSubmit)}
          goToNextCard={goToNextCard}
          isSubmitted={Boolean(goToNextCardFn)}
        />
      )}
      <TrainingTimer
        onTimeout={() => (goToNextCardFn ? goToNextCard() : fail())}
        timeToAnswerS={timeToAnswerS}
        isRunning={isTimerRunning}
      />
    </div>
  );
};
