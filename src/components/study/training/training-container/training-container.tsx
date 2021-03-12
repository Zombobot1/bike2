import './training-container.scss';
import React from 'react';
import { Training } from '../training';
import { useInfo } from '../../../context/info-provider';

export const TrainingContainer = () => {
  const info = useInfo();
  return (
    <div className="d-flex justify-content-center align-items-center training-container">
      <Training {...info.training} />
    </div>
  );
};
