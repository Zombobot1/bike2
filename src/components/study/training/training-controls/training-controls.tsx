import './training-controls.scss';
import { capitalizeOnlyFirstLetter } from '../../../../utils/utils';
import React, { useEffect, useState } from 'react';
import { TrainingTimer, useTrainingTimer } from '../training-timer/training-timer';
import { CardEstimation, cardEstimationToNumber, CardType } from '../types';
import { Fn } from '../../../../utils/types';
import { Estimations, useUFormSubmit } from '../../../uform/uform';
import { min } from '../../../../utils/algorithms';
import { EstimateCard } from '../training/hooks';
import { useInteractiveSubmit } from '../hooks';

export interface TrainingControlsP {
  estimate: EstimateCard;
  areFieldsHidden: boolean;
  showHiddenFields: Fn;
  cardType: CardType;
  currentCardIndex: number;
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

interface SelfEstimateBtnP {
  areFieldsHidden: boolean;
  showHiddenFields: Fn;
  estimate: EstimateCard;
}

const SelfEstimateBtn = ({ areFieldsHidden, showHiddenFields, estimate }: SelfEstimateBtnP) => {
  return (
    <>
      {areFieldsHidden && (
        <button className="btn btn-lg btn-primary estimate-btn" onClick={showHiddenFields}>
          Estimate
        </button>
      )}
      {!areFieldsHidden && (
        <div className="btn-group" role="group">
          <EstimationBtn btnClass="btn-warning" estimate={estimate} estimation={'SOSO'} />
          <EstimationBtn btnClass="btn-danger" estimate={estimate} estimation={'BAD'} />
          <EstimationBtn btnClass="btn-success" estimate={estimate} estimation={'GOOD'} />
          <EstimationBtn btnClass="btn-info" estimate={estimate} estimation={'EASY'} />
        </div>
      )}
    </>
  );
};

type GoToNextCard = { go: Fn } | null;

interface EstimateBtnP {
  isSubmitted: boolean;
  sumbit: Fn;
  goToNextCard: Fn;
}

const EstimateBtn = ({ isSubmitted, sumbit, goToNextCard }: EstimateBtnP) => {
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
  areFieldsHidden,
  showHiddenFields,
  currentCardIndex,
}: TrainingControlsP) => {
  const { submit } = useUFormSubmit();

  const [goToNextCardFn, setGoToNextCardFn] = useState<GoToNextCard | null>(null);

  const onSubmit = (estimations: Estimations) => {
    const finalMark = estimations.length
      ? min(estimations, (e) => cardEstimationToNumber(e.estimation)).estimation
      : 'BAD';
    const gtnc = estimate(finalMark, 'NO_TRANSITION');
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

  const { setOnTimeout } = useTrainingTimer();
  const fail = () => estimate('BAD');
  const onTimeout = () => (goToNextCardFn ? goToNextCard() : fail());
  useEffect(() => {
    setOnTimeout(onTimeout);
  }, [currentCardIndex]);

  return (
    <div className="d-flex align-items-center justify-content-between controls w-100">
      <TrainingTimer />
      {cardType === 'PASSIVE' && (
        <SelfEstimateBtn estimate={estimate} areFieldsHidden={areFieldsHidden} showHiddenFields={showHiddenFields} />
      )}
      {cardType === 'INTERACTIVE' && (
        <EstimateBtn sumbit={interactiveSubmit} goToNextCard={goToNextCard} isSubmitted={Boolean(goToNextCardFn)} />
      )}
      <div style={{ height: '5px', minWidth: '70px' }} />
    </div>
  );
};
