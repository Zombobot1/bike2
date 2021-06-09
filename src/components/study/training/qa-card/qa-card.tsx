import './qa-card.scss';
import React from 'react';
import { CardSide, FieldDTO } from '../types';
import { Field } from './field/field';

export interface QACardP {
  fields: FieldDTO[];
  stageColor: string;
  side: CardSide;
  isCurrent: boolean;
}

export const QACard = ({ fields, stageColor, side, isCurrent }: QACardP) => {
  return (
    <>
      <div className="qa-card">
        {fields.map((f, i) =>
          f.side === side ? (
            <Field
              type={f.type}
              passiveData={f.passiveData}
              interactiveData={f.interactiveData}
              key={i}
              isMediaActive={isCurrent}
              isCurrent={isCurrent}
            />
          ) : null,
        )}
      </div>
      <div className="qa-card-bottom" style={{ backgroundColor: stageColor }} />
    </>
  );
};
