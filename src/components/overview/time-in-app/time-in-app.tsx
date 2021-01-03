import './time-in-app.scss';
import { Serie } from '@nivo/line';
import React from 'react';
import TimeInAppLine from '../graphs/time-in-app-line';
import { datumAvg } from '../../../utils/algorithms';
import { addS } from '../../../utils/formatting';
import { Link } from 'react-router-dom';
import { SCHEDULE } from '../../pages';

export interface TimeInAppP {
  data: Serie[];
}

const hoursAndMinutes = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins} min${addS(mins)}`;
  return `${hrs} hr${addS(hrs)} ${mins} min${addS(mins)}`;
};

const TimeInApp = ({ data }: TimeInAppP) => {
  return (
    <div className="col-9 me-3 time-in-app">
      <div className="d-flex justify-content-between">
        <h3 className="overview__subheader">Time in application</h3>
        <h6 className="align-self-center">Average: {hoursAndMinutes(datumAvg(data[0].data))}</h6>
        <Link className="btn btn-sm btn-primary" to={SCHEDULE}>
          Schedule
        </Link>
      </div>
      <div className="time-in-app-line-container">
        <TimeInAppLine data={data} />
      </div>
    </div>
  );
};

export default TimeInApp;
