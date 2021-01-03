import './last-reviews.scss';
import React from 'react';
import LastReviewCard from '../../cards/last-review-card';
import { LastReviewCardP } from '../../cards/last-review-card/last-review-card';
import { STUDY } from '../../pages';
import { Link } from 'react-router-dom';

export interface LastReviewsP {
  lastReviews: LastReviewCardP[];
}

const LastReviews = ({ lastReviews }: LastReviewsP) => {
  return (
    <div className="col-2 last-reviews">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Reviews</h3>
        <Link className="btn btn-sm btn-tertiary" to={STUDY}>
          See all
        </Link>
      </div>
      <div className="decks-small-cards">
        {lastReviews.map((e, i) => (
          <LastReviewCard {...e} key={i} />
        ))}
      </div>
    </div>
  );
};

export default LastReviews;
