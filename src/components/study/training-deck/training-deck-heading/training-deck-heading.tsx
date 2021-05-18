import './training-deck-heading.scss';
import { ReactComponent as CollapseI } from '../../../icons/chevron-up-icon.svg';
import { cn, pcn } from '../../../../utils/utils';
import { chop, totalToRepeatAndToLearn } from '../../utils';
import TrainingsFilterBtn, { DisplayedTrainingType } from '../training-deck-filter-btn';
import TrainingCardsInfo from '../../../cards/training-cards-info';
import React, { useState } from 'react';
import { useToggle } from '../../../utils/hooks/use-toggle';
import { TrainingDTO } from '../../training/training';

export interface TrainingsGroupDTO {
  rootDeckName: string;
  trainings: TrainingDTO[];
}

export interface TrainingDeckHeadingP extends TrainingsGroupDTO {
  setDisplayedTrainings: (v: TrainingDTO[]) => void;
  collapseId: string;
}

const availableOptions = (trainings: TrainingDTO[]): DisplayedTrainingType[] => {
  const overdues = [...new Set(trainings.map((t) => t.overdue))];
  const result: DisplayedTrainingType[] = ['ALL'];
  if (overdues.includes('WARNING')) result.push('WARNING');
  if (overdues.includes('DANGER')) result.push('DANGER');
  return result;
};

const hasDifferentOverdue = (trainings: TrainingDTO[]): boolean => {
  if (trainings.length < 2) return false;
  const firstType = trainings[0].overdue;
  return Boolean(trainings.slice(1).find((t) => t.overdue !== firstType));
};

const TrainingDeckHeading = ({ rootDeckName, trainings, setDisplayedTrainings, collapseId }: TrainingDeckHeadingP) => {
  const hasDanger = trainings.find((e) => e.overdue === 'DANGER');
  const hasWarning = !hasDanger && trainings.find((e) => e.overdue === 'WARNING');
  const subheaderNames = cn('subheader', pcn('overdue-indicator', { '--warning': hasWarning, '--danger': hasDanger }));

  const [isCollapsed, setIsCollapsed] = useToggle(false);
  const [option, setOption] = useState<DisplayedTrainingType>('ALL');
  const totalRepeatAndLearn = totalToRepeatAndToLearn(trainings);
  const filter = (option: DisplayedTrainingType) => {
    if (option === 'ALL') setDisplayedTrainings(trainings);
    else if (option === 'DANGER') setDisplayedTrainings(trainings.filter((e) => e.overdue === 'DANGER'));
    else setDisplayedTrainings(trainings.filter((e) => e.overdue === 'WARNING'));
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
      <h3 className={'me-auto ' + subheaderNames}>{chop(rootDeckName, 10)}</h3>
      {!isCollapsed && (
        <TrainingsFilterBtn
          options={availableOptions(trainings)}
          currentOption={option}
          setCurrentOption={filter}
          isActive={hasDifferentOverdue(trainings)}
        />
      )}
      {isCollapsed && <TrainingCardsInfo {...totalRepeatAndLearn} />}
    </div>
  );
};

export default TrainingDeckHeading;
