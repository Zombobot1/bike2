import './last-trainings.scss';
import React from 'react';
import LastTrainingCard from '../../cards/last-training-card';
import { LastTrainingCardP } from '../../cards/last-training-card/last-training-card';
import { Link } from 'react-router-dom';
import { STUDY } from '../../pages';

export interface LastTrainingsP {
  lastTrainings: LastTrainingCardP[];
}

const LastTrainings = ({ lastTrainings }: LastTrainingsP) => {
  return (
    <div className="col-4 me-3 last-trainings">
      <div className="d-flex justify-content-between last-trainings__header">
        <h3 className="overview__subheader">Last trainings</h3>
        <Link className="btn btn-sm btn-secondary" to={STUDY}>
          See all
        </Link>
      </div>
      <div className="decks-small-cards">
        {lastTrainings.map((e, i) => (
          <LastTrainingCard {...e} key={i} />
        ))}
      </div>
    </div>
  );
};

export default LastTrainings;
