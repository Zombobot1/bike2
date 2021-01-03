import './decks-progress.scss';
import React from 'react';
import DeckProgress from '../../cards/deck-progress';
import { DeckProgressP } from '../../cards/deck-progress/deck-progress';

export interface DecksProgressP {
  deckProgresses: DeckProgressP[];
}

const DecksProgress = ({ deckProgresses }: DecksProgressP) => {
  return (
    <div className="col-5 me-3 decks-progress">
      <h3 className="overview__subheader">Decks progress</h3>
      <div className="progresses">
        {deckProgresses.map((e, i) => (
          <DeckProgress {...e} key={i} />
        ))}
      </div>
    </div>
  );
};

export default DecksProgress;
