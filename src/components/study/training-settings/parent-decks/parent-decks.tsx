import React from 'react';
import RadioInput from '../../../controls/radio-input';
import { SplittableHierarchy } from '../types';
import { NamedDeck } from '../../training-deck';

export interface ParentDecksP extends NamedDeck, SplittableHierarchy {
  parentNames: string[];
}

const ParentDecks = ({ deckName, parentNames, split, merge }: ParentDecksP) => {
  const options = parentNames.map((e) => ({ id: e, label: e }));
  const onChange = (curr: string, prev: string) => {
    if (prev) split(prev, deckName);
    merge(curr, deckName);
  };
  return (
    <div className="parent-decks mb-3">
      {!parentNames.length && <div className="no-content">This is a root deck. It cannot be merged.</div>}
      <RadioInput name="parents" options={options} onChange={onChange} />
    </div>
  );
};

export default ParentDecks;
