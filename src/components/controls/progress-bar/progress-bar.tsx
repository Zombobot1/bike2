import { percentage } from '../../../utils/formatting';
import React from 'react';

export interface ProgressBarP {
  className?: string;
  value: number;
  color: string;
}

export const ProgressBar = ({ className, color, value }: ProgressBarP) => (
  <div className={className + ' progress'}>
    <div className="progress-bar" style={{ width: percentage(value), backgroundColor: color }} />
  </div>
);
