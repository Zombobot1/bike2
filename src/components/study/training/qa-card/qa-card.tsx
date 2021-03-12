import './qa-card.scss';
import React from 'react';

export enum CardSide {
  Front,
  Back,
}

export interface QACardP {
  question: string;
  answer: string;
  stageColor: string;
  side: CardSide;
}

export const QACard = ({ question, answer, stageColor, side }: QACardP) => {
  return (
    <div className="qa-card-container">
      <div className="qa-card">
        <pre>{side === CardSide.Front ? question : answer}</pre>
      </div>
      <div className="qa-card-bottom" style={{ backgroundColor: stageColor }} />
    </div>
  );
};
