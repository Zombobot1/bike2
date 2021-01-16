import './trainings-heading.scss';
import React from 'react';
import DeckSettingsModal, { DeckSettingsModalTrigger } from '../training-settings/deck-settings-modal';

const TrainingsHeading = () => (
  <div className="d-flex justify-content-between regular-trainings-heading">
    <h2 className="page-header">Regular trainings</h2>
    <DeckSettingsModalTrigger />
    <DeckSettingsModal />
  </div>
);

export default TrainingsHeading;
