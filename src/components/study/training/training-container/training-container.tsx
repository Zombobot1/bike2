import './training-container.scss';
import React from 'react';
import { Training } from '../training';
import { useTraining } from '../../hooks';
import { useRouter } from '../../../utils/hooks/use-router';
import { FetchedData } from '../../../utils/hoc/fetched-data';

export const TrainingContainer = () => {
  const { query } = useRouter();
  const training = useTraining(query('id') || '1');

  return (
    <div className="d-flex justify-content-center align-items-center training-container">
      <FetchedData Base={Training} {...training} />
    </div>
  );
};
