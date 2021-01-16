import './deck-progress.scss';
import React, { useState } from 'react';
import { SmallDeckCard } from '../types';
import { percentage } from '../../../utils/formatting';
import { cn } from '../../../utils/utils';

export interface DeckProgressP extends SmallDeckCard {
  progress: number;
}

const DeckProgress = ({ deckColor, deckName, progress }: DeckProgressP) => {
  const [isHovered, setIsHovered] = useState(false);
  const cns = cn('progress-bar', { 'progress-bar-striped progress-bar-animated': isHovered });
  return (
    <div className="deck-progress" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="d-flex justify-content-between">
        <span className="deck-name">{deckName}</span>
        <span className="progress-value">{percentage(progress)}</span>
      </div>
      <div className="progress">
        <div className={cns} style={{ width: percentage(progress), backgroundColor: deckColor }} />
      </div>
    </div>
  );
};

export default DeckProgress;
