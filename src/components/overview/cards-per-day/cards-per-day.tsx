import './cards-per-day.scss';
import { Serie } from '@nivo/line';
import React from 'react';
import CardsPerDayLine from '../graphs/cards-per-day-line';
import { datumAvg } from '../../../utils/algorithms';
import { Link } from 'react-router-dom';
import { STUDY } from '../../pages';

export interface CardsPerDayP {
  data: Serie[];
}

const CardsPerDay = ({ data }: CardsPerDayP) => {
  return (
    <div className="col-7 me-3 cards-per-day">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Cards per day</h3>
        <h6 className="align-self-center">Average: {Math.floor(datumAvg(data[0].data))} cards</h6>
        <Link className="btn btn-sm btn-primary" to={STUDY}>
          Study
        </Link>
      </div>
      <div className="cards-per-day-line-container">
        <CardsPerDayLine data={data} />
      </div>
    </div>
  );
};

export default CardsPerDay;
