import React, { useState } from 'react';
import { keys } from 'lodash';
import { SplittableHierarchy } from '../types';
import DeckSettings from '../deck-settings';
import DeckSelection from '../deck-selection';

export interface TrainingDecksSettingsP extends SplittableHierarchy {
  trainingDecks: {
    [p: string]: { subdecksNames: string[]; parentsNames: string[] };
  };
}

const TrainingDecksSettings = ({ trainingDecks, merge, split }: TrainingDecksSettingsP) => {
  const [selectedDeck, setSelectedDeck] = useState('');
  const { subdecksNames, parentsNames } = trainingDecks[selectedDeck] || {};
  const decks = keys(trainingDecks);
  return (
    <div>
      {!selectedDeck && <DeckSelection decks={decks} select={setSelectedDeck} />}
      {selectedDeck && (
        <DeckSettings
          subdecksNames={subdecksNames}
          parentsNames={parentsNames}
          deckName={selectedDeck}
          split={split}
          merge={merge}
          back={() => setSelectedDeck('')}
        />
      )}
    </div>
  );
};

export default TrainingDecksSettings;
