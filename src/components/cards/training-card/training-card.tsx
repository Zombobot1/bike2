import './training-card.scss';
import { SmallDeckCard } from '../types';
import TrainingConceptsInfo, { TrainingConceptsInfoP } from '../training-cards-info';
import React from 'react';
import { useRouter } from '../../utils/hooks/use-router';
import { TrainingDTO } from '../../study/training/training';
import { STUDY } from '../../navigation/utils';

export interface DeckCard extends SmallDeckCard {
  deckPath: string;
}

export interface TrainingConceptInfo {
  _id: string;
  trainingConceptsInfo: TrainingConceptsInfoP;
}

const TrainingCard = ({ _id, deckColor, deckName, deckPath, trainingConceptsInfo }: TrainingDTO) => {
  const { history } = useRouter();
  const onClick = () => history.push(`${STUDY}/${_id}`);
  return (
    <div className="training-card" onClick={onClick}>
      <div className="deck-mark" style={{ backgroundColor: deckColor }} />
      <span className="deck-path">{deckPath}</span>
      <strong className="deck-name">{deckName}</strong>
      <TrainingConceptsInfo {...trainingConceptsInfo} />
    </div>
  );
};

export default TrainingCard;
