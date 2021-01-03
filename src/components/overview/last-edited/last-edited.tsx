import './last-edited.scss';
import React from 'react';
import LastEditedCard from '../../cards/last-edited-card';
import { LastEditedCardP } from '../../cards/last-edited-card/last-edited-card';
import { Link } from 'react-router-dom';
import { DECKS } from '../../pages';

export interface LastEditedP {
  lastEditedCards: LastEditedCardP[];
}

const LastEdited = ({ lastEditedCards }: LastEditedP) => {
  return (
    <div className="col-3 me-3 last-edited">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Last edited</h3>
        <Link className="btn btn-sm btn-secondary" to={DECKS}>
          See all
        </Link>
      </div>
      <div className="decks-small-cards">
        {lastEditedCards.map((e, i) => (
          <LastEditedCard {...e} key={i} />
        ))}
      </div>
    </div>
  );
};

export default LastEdited;
