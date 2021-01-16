import './training-deck-heading.scss';
import { ReactComponent as CollapseI } from '../../../icons/chevron-up-icon.svg';
import { cn, pcn } from '../../../../utils/utils';
import { chop, totalToRepeatAndToLearn } from '../../utils';
import TrainingsFilterBtn, { DisplayedTrainingType } from '../training-deck-filter-btn';
import TrainingCardsInfo from '../../../cards/training-cards-info';
import React, { useState } from 'react';
import { useToggle } from '../../../utils/hooks/use-toggle';
import { OverdueType } from '../../../cards/notification/notification';
import { TrainingCardP } from '../../../cards/training-card';
import { NamedDeck } from '../training-deck';

export interface TrainingDeckHeadingBaseP extends NamedDeck {
  deckName: string;
  trainings: TrainingCardP[];
}

export interface TrainingDeckHeadingP extends TrainingDeckHeadingBaseP {
  setDisplayedTrainings: (v: TrainingCardP[]) => void;
  collapseId: string;
}

const TrainingDeckHeading = ({ deckName, trainings, setDisplayedTrainings, collapseId }: TrainingDeckHeadingP) => {
  const hasDanger = trainings.find((e) => e.overdue === OverdueType.Danger);
  const hasWarning = !hasDanger && trainings.find((e) => e.overdue === OverdueType.Warning);
  const subheaderNames = cn('subheader', pcn('overdue-indicator', { '--warning': hasWarning, '--danger': hasDanger }));

  const [isCollapsed, setIsCollapsed] = useToggle(false);
  const [option, setOption] = useState(DisplayedTrainingType.All);
  const totalRepeatAndLearn = totalToRepeatAndToLearn(trainings);
  const filter = (option: DisplayedTrainingType) => {
    if (option === DisplayedTrainingType.All) setDisplayedTrainings(trainings);
    else if (option === DisplayedTrainingType.Danger)
      setDisplayedTrainings(trainings.filter((e) => e.overdue === OverdueType.Danger));
    else setDisplayedTrainings(trainings.filter((e) => e.overdue === OverdueType.Warning));
    setOption(option);
  };
  return (
    <div className="trainings-heading d-flex justify-content-between">
      <button
        className="transparent-button collapse-btn"
        data-bs-toggle="collapse"
        data-bs-target={`#` + collapseId}
        onClick={setIsCollapsed}
      >
        <CollapseI className={cn('chevron-up-icon', { collapsed: isCollapsed })} />
      </button>
      <h3 className={'me-auto ' + subheaderNames}>{chop(deckName, 10)}</h3>
      {!isCollapsed && <TrainingsFilterBtn currentOption={option} setCurrentOption={filter} />}
      {isCollapsed && <TrainingCardsInfo {...totalRepeatAndLearn} />}
    </div>
  );
};

export default TrainingDeckHeading;
