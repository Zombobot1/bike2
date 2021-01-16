import React from 'react';

export interface TrainingsFilterBtnP {
  currentOption: DisplayedTrainingType;
  setCurrentOption: (option: DisplayedTrainingType) => void;
}

export enum DisplayedTrainingType {
  All,
  Warning,
  Danger,
}

const TrainingsFilterBtn = ({ currentOption, setCurrentOption }: TrainingsFilterBtnP) => {
  return (
    <>
      <button className="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown">
        {DisplayedTrainingType[currentOption]}
      </button>
      <ul className="dropdown-menu">
        <li>
          <div className="dropdown-item" onClick={() => setCurrentOption(DisplayedTrainingType.All)}>
            All
          </div>
        </li>
        <li>
          <div className="dropdown-item" onClick={() => setCurrentOption(DisplayedTrainingType.Warning)}>
            Warning
          </div>
        </li>
        <li>
          <div className="dropdown-item" onClick={() => setCurrentOption(DisplayedTrainingType.Danger)}>
            Danger
          </div>
        </li>
      </ul>
    </>
  );
};

export default TrainingsFilterBtn;
