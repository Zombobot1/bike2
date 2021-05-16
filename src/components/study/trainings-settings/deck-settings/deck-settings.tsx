import './deck-settings.scss';
import React, { useState } from 'react';
import { SplittableHierarchy } from '../types';
import { NamedDeck } from '../../training-deck';
import TrainingDeckSettingsHeader from '../training-deck-settings-header';
import Subdecks from '../subdecks';
import ParentDecks from '../parent-decks';

export interface DeckSettingsP extends NamedDeck, SplittableHierarchy {
  subdecksNames: string[];
  parentsNames: string[];
  back: () => void;
}

const DeckSettings = ({ deckName, merge, split, parentsNames, subdecksNames, back }: DeckSettingsP) => {
  const isSplittingActive = useState(true);
  const decks = { deckName: deckName, merge, split };
  const subdecks = { ...decks, subdeckNames: subdecksNames };
  const parents = { ...decks, parentNames: parentsNames };
  const splitInfo = 'Tap on a deck to show it separately on the screen';
  const mergeInfo = 'Select a deck to include this one inside';
  return (
    <>
      <TrainingDeckSettingsHeader splittingActive={isSplittingActive} deckName={deckName} back={back} />
      <p className="settings-info mb-4">{isSplittingActive ? splitInfo : mergeInfo}</p>
      {isSplittingActive[0] && <Subdecks {...subdecks} deckName={deckName} />}
      {!isSplittingActive[0] && <ParentDecks {...parents} deckName={deckName} />}
    </>
  );
};

export default DeckSettings;
