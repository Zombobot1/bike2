import React from 'react';
import { capitalizeFirstLetter } from '../../../utils/utils';

export interface TrainingsFilterBtnP {
  options: DisplayedTrainingType[];
  currentOption: DisplayedTrainingType;
  setCurrentOption: (option: DisplayedTrainingType) => void;
  isActive?: boolean;
}

export type DisplayedTrainingType = 'ALL' | 'WARNING' | 'DANGER';

const TrainingsFilterBtn = ({ options, currentOption, setCurrentOption, isActive = true }: TrainingsFilterBtnP) => {
  if (!isActive) return null;
  return (
    <>
      <button className="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
        {capitalizeFirstLetter(currentOption)}
      </button>
      <ul className="dropdown-menu">
        {options.map((o) => (
          <li key={o}>
            <div className="dropdown-item" onClick={() => setCurrentOption(o)}>
              {capitalizeFirstLetter(o)}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TrainingsFilterBtn;
