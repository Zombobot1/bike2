import { Trainings } from '../study/trainings/trainings';
import { TrainingWrapper } from '../study/training/training/training';

export const Study = () => {
  return (
    <div>
      <Trainings />
    </div>
  );
};

export const StudyTraining = () => <TrainingWrapper />;
