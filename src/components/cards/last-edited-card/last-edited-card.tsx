import './last-edited-card.scss';
import React from 'react';
import { SmallDeckCard } from '../types';
import { fancyDate } from '../../../utils/formatting';

export interface LastEditedCardP extends SmallDeckCard {
  editingDate: string;
}

const LastEditedCard = ({ deckColor, deckName, editingDate }: LastEditedCardP) => {
  return (
    <div className="last-edited-card">
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <strong className="deck-name">{deckName}</strong>
      <span className="time">Edited: {fancyDate(editingDate)}</span>
    </div>
  );
};

export default LastEditedCard;
