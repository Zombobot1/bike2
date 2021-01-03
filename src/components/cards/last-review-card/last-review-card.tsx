import './last-review-card.scss';
import { ReactComponent as Bookmark } from '../training-cards-info/bookmark-icon.svg';
import React from 'react';
import { DeckCard } from '../types';
import { fancyDate, percentage } from '../../../utils/formatting';

export interface LastReviewCardP extends DeckCard {
  reviewResult: number;
  reviewDate: string;
}

const LastReviewCard = ({ deckName, deckColor, reviewDate, reviewResult }: LastReviewCardP) => {
  return (
    <div className="last-review-card">
      <Bookmark style={{ fill: deckColor }} />
      <strong className="deck-name">{deckName}</strong>
      <span className="review-result">{percentage(reviewResult)}</span>
      <span className="time">Reviewed: {fancyDate(reviewDate)}</span>
    </div>
  );
};

export default LastReviewCard;
