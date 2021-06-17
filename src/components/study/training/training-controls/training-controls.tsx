import './training-controls.scss';
import { capitalizeOnlyFirstLetter } from '../../../../utils/utils';
import React, { useEffect, useState } from 'react';
import { TrainingTimer } from './training-timer';
import { CardEstimation, cardEstimationToNumber, CardType } from '../types';
import { Fn, NumStateT } from '../../../../utils/types';
import { Estimations, useUFormSubmit } from '../../../uform/uform';
import { min } from '../../../../utils/algorithms';
import { EstimateCard } from '../training/hooks';
import { useInteractiveSubmit } from '../hooks';

export interface TrainingControlsP {
  estimate: EstimateCard;
  areFieldsHidden: boolean;
  showHiddenFields: Fn;
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
  areFieldsHidden: boolean;
  showHiddenFields: Fn;
  estimate: EstimateCard;
}

const PassiveEstimateBtn = ({ areFieldsHidden, showHiddenFields, estimate }: PassiveEstimateBtnP) => {
  return (
    <>
      {areFieldsHidden && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={showHiddenFields}>
          Estimate
        </button>
      )}
      {!areFieldsHidden && (
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
  areFieldsHidden,
  showHiddenFields,
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

  const { interactiveSubmit, setInteractiveSubmit } = useInteractiveSubmit();

  useEffect(() => {
    setInteractiveSubmit(() => submit(onSubmit));
  }, [submit]);

  const fail = () => estimate('BAD');

  return (
    <div className="controls">
      {cardType === 'PASSIVE' && (
        <PassiveEstimateBtn estimate={estimate} areFieldsHidden={areFieldsHidden} showHiddenFields={showHiddenFields} />
      )}
      {cardType === 'INTERACTIVE' && (
        <InteractiveEstimateBtn
          sumbit={interactiveSubmit}
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
