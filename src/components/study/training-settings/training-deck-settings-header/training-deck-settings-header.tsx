import './training-deck-settings-header.scss';
import { BoolStateT } from '../../../forms/hoc/with-validation';
import { ReactComponent as Left } from '../../../icons/chevron-left.svg';
import { cn } from '../../../../utils/utils';
import React from 'react';

export interface TrainingDeckSettingsHeaderP {
  deckName: string;
  splittingActive: BoolStateT;
  back: () => void;
}

const TrainingDeckSettingsHeader = ({ deckName, splittingActive, back }: TrainingDeckSettingsHeaderP) => {
  const [isSplittingActive, setIsSplittingActive] = splittingActive;
  return (
    <>
      <div className="d-flex justify-content-start">
        <Left className="transparent-button align-self-center me-3" onClick={back} />
        <div className="d-flex flex-column">
          <span className="settings__deck-label-container">
            <span className="settings__deck-label">Deck</span>
          </span>
          <span className="settings__deck-name">{deckName}</span>
        </div>
      </div>
      <ul className="nav nav-tabs mb-3 mt-3">
        <li className="nav-item">
          <span
            className={cn('nav-link', { active: isSplittingActive })}
            onClick={() => {
              setIsSplittingActive(true);
            }}
            aria-current="page"
          >
            Split
          </span>
        </li>
        <li className="nav-item">
          <span
            className={cn('nav-link', { active: !isSplittingActive })}
            onClick={() => {
              setIsSplittingActive(false);
            }}
          >
            Merge
          </span>
        </li>
      </ul>
    </>
  );
};

export default TrainingDeckSettingsHeader;
