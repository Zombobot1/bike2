import './deck-selection.scss';
import React from 'react';

export interface DeckSelectionP {
  decks: string[];
  select: (v: string) => void;
}

const DeckSelection = ({ decks, select }: DeckSelectionP) => {
  return (
    <>
      <h3 className="selection-info">Select a deck to split or merge</h3>
      <ul className="list-group mb-3 mt-4">
        {decks.map((e, i) => (
          <li className="list-group-item deck-to-tune" onClick={() => select(e)} key={i}>
            {e}
          </li>
        ))}
      </ul>
    </>
  );
};

export default DeckSelection;
