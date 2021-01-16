import { HeadlessModal } from '../../../utils/footless-modal';
import TrainingDecksSettings from '../training-decks-settings';
import { ModalTrigger } from '../../../utils/modal-trigger';
import React from 'react';
import { useInfo } from '../../../info-provider';

const deckSettingsModalId = 'split-merge-decks';

export const DeckSettingsModalTrigger = () => (
  <ModalTrigger className="btn btn-sm btn-outline-primary settings-trigger" text="Tune" modalId={deckSettingsModalId} />
);

const DeckSettingsModal = () => {
  const settings = useInfo().study.trainingDecksSettings;
  const Modal = HeadlessModal(deckSettingsModalId, () => <TrainingDecksSettings {...settings} />);
  return <Modal />;
};

export default DeckSettingsModal;
