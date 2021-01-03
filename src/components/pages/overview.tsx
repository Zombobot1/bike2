import React from 'react';
import { useInfo } from '../info-provider/info-provider';
import LastReviews from '../overview/last-reviews';
import TimeInApp from '../overview/time-in-app';
import LastTrainings from '../overview/last-trainings';
import CardsPerDay from '../overview/cards-per-day';
import DecksProgress from '../overview/decks-progress';
import CardsTypes from '../overview/cards-types';
import LastEdited from '../overview/last-edited';

export const Overview = () => {
  const info = useInfo();
  return (
    <div className="statistics container-fluid">
      <div className="row mb-3">
        <LastTrainings lastTrainings={info.overview.lastTrainings} />
        <CardsPerDay data={info.overview.cardsPerDayData} />
      </div>
      <div className="row mb-3">
        <DecksProgress deckProgresses={info.overview.deckProgresses} />
        <CardsTypes data={info.overview.cardsTypesData} />
        <LastEdited lastEditedCards={info.overview.lastEditedCards} />
      </div>
      <div className="row">
        <TimeInApp data={info.overview.timeInAppData} />
        <LastReviews lastReviews={info.overview.lastReviews} />
      </div>
    </div>
  );
};
