import { ReviewInfo } from '../../../cards/last-review-card/last-review-card';
import { ReactComponent as Bookmark } from '../../../cards/training-cards-info/bookmark-icon.svg';
import { fancyDate, percentage } from '../../../../utils/formatting';
import { lastMonth, yesterday } from '../../../../content';
import React from 'react';
import { DeckCard } from '../../../cards/training-card';

export interface ReviewCardP extends DeckCard, ReviewInfo {
  isActive: boolean;
}

const ReviewCard = ({ deckName, deckPath, deckColor, reviewDate, reviewResult, isActive }: ReviewCardP) => {
  return (
    <div className="review-card">
      <Bookmark style={{ fill: deckColor }} />
      <span className="deck-path">{deckPath}</span>
      <strong className="deck-name">{deckName}</strong>
      {!isActive && <span className="review-result">{percentage(reviewResult)}</span>}
      <span className="time">{isActive ? 'Click to continue' : 'Reviewed: ' + fancyDate(reviewDate)}</span>
    </div>
  );
};

export interface ReviewsP {
  reviews: ReviewCardP[];
}

export const Reviews = ({ reviews }: ReviewsP) => {
  return (
    <div className="review-cards">
      <div className="heading d-flex justify-content-between">
        <h3 className="me-auto subheader">Reviews</h3>
        <button className="btn btn-sm btn-tertiary">New</button>
      </div>
      <div className="d-flex flex-column cards">
        {reviews.map((e, i) => (
          <ReviewCard {...e} key={i} />
        ))}
      </div>
    </div>
  );
};

export const reviews = [
  {
    deckColor: '#735CFC',
    deckName: 'Exersices 1-10',
    deckPath: 'Nouns / Collocations',
    reviewDate: yesterday(),
    reviewResult: 0.2,
    isActive: true,
  },
  {
    deckColor: '#FC5C9F',
    deckName: 'Chapter 1',
    deckPath: 'C++ programming language',
    reviewDate: lastMonth(),
    reviewResult: 0.95,
    isActive: false,
  },
  {
    deckColor: '#FF5151',
    deckName: 'Bayesian approach',
    deckPath: 'Statistical methods / Lectures',
    reviewDate: lastMonth(),
    reviewResult: 0.87,
    isActive: false,
  },
  {
    deckColor: '#DC5CFC',
    deckName: 'Borsh',
    deckPath: 'Recipes',
    reviewDate: lastMonth(),
    reviewResult: 0.88,
    isActive: false,
  },
];
