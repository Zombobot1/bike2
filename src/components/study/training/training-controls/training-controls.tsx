import { IsSM, rstyled } from '../../../../utils/utils';
import { useEffect, useState } from 'react';
import { TrainingTimer, useTrainingTimer } from '../training-timer/training-timer';
import { cardEstimationToNumber, CardType } from '../types';
import { Fn } from '../../../../utils/types';
import { Estimations, useUFormSubmit } from '../../../uform/uform';
import { min } from '../../../../utils/algorithms';
import { EstimateCard } from '../training/hooks';
import { useInteractiveSubmit } from '../hooks';
import { Button, ButtonGroup, ButtonProps, Stack, styled } from '@material-ui/core';
import { useIsSM } from '../../../../utils/hooks-utils';
import { TrainingSettings } from './training-settings';
import { TrainingSettingsP } from './training-settings';

const EstimationBtn = rstyled(Button)<ButtonProps & IsSM>(({ isSM }) => ({
  width: isSM ? 85 : 65,
  fontWeight: 'bold',
}));

const Btn = styled(Button)({
  fontWeight: 'bold',
});

export interface TrainingControlsP extends TrainingSettingsP {
  estimate: EstimateCard;
  areFieldsHidden: boolean;
  showHiddenFields: Fn;
  cardType: CardType;
  currentCardIndex: number;
}

interface SelfEstimateBtnP {
  areFieldsHidden: boolean;
  showHiddenFields: Fn;
  estimate: EstimateCard;
}

const SelfEstimateBtn = ({ areFieldsHidden, showHiddenFields, estimate }: SelfEstimateBtnP) => {
  const bad = () => estimate('BAD');
  const poor = () => estimate('POOR');
  const good = () => estimate('GOOD');
  const easy = () => estimate('EASY');

  const isSM = useIsSM();
  const size = isSM ? 'large' : 'medium';
  return (
    <>
      {areFieldsHidden && (
        <Btn variant="outlined" size={size} onClick={showHiddenFields}>
          Estimate
        </Btn>
      )}
      {!areFieldsHidden && (
        <ButtonGroup variant="text" size={size}>
          <EstimationBtn isSM={isSM} color="warning" onClick={poor}>
            Poor
          </EstimationBtn>
          <EstimationBtn isSM={isSM} color="error" onClick={bad}>
            Bad
          </EstimationBtn>
          <EstimationBtn isSM={isSM} color="success" onClick={good}>
            Good
          </EstimationBtn>
          <EstimationBtn isSM={isSM} color="info" onClick={easy}>
            Easy
          </EstimationBtn>
        </ButtonGroup>
      )}
    </>
  );
};

type GoToNextCard = { go: Fn } | null;

interface EstimateBtnP {
  isSubmitted: boolean;
  submit: Fn;
  goToNextCard: Fn;
}

const EstimateBtn = ({ isSubmitted, submit, goToNextCard }: EstimateBtnP) => {
  const isSM = useIsSM();
  const size = isSM ? 'large' : 'medium';

  return (
    <>
      {!isSubmitted && (
        <Btn variant="outlined" size={size} onClick={submit}>
          Estimate
        </Btn>
      )}
      {isSubmitted && (
        <Btn variant="outlined" size={size} onClick={goToNextCard}>
          Next
        </Btn>
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
  cardId,
  deleteCard,
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
    <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
      <TrainingTimer />
      {cardType === 'PASSIVE' && (
        <SelfEstimateBtn estimate={estimate} areFieldsHidden={areFieldsHidden} showHiddenFields={showHiddenFields} />
      )}
      {cardType === 'INTERACTIVE' && (
        <EstimateBtn submit={interactiveSubmit} goToNextCard={goToNextCard} isSubmitted={Boolean(goToNextCardFn)} />
      )}
      <TrainingSettings cardId={cardId} deleteCard={deleteCard} />
    </Stack>
  );
};
