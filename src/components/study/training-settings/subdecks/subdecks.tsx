import { curry } from 'lodash';
import React from 'react';
import { NamedDeck } from '../../training-deck';
import { SplittableHierarchy } from '../types';
import Subdeck from '../subdeck';

export interface SubdecksBaseP extends SplittableHierarchy {
  subdeckNames: string[];
}

export interface SubdecksP extends SubdecksBaseP, NamedDeck {}

const Subdecks = ({ deckName, subdeckNames, split, merge }: SubdecksP) => {
  const splitMe = curry(split)(deckName);
  const mergeWithMe = curry(merge)(deckName);
  return (
    <>
      {!subdeckNames.length && <div className="no-content">There is no subdecks to split.</div>}
      <ul className="list-group mb-3">
        {subdeckNames.map((e, i) => (
          <Subdeck name={e} split={splitMe} merge={mergeWithMe} key={i} />
        ))}
      </ul>
    </>
  );
};

export default Subdecks;
