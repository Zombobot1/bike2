import './qa-card.scss';
import React from 'react';
import { CardSide, FieldT } from '../types';
import { Field } from './field/field';

export interface QACardP {
  fields: FieldT[];
  stageColor: string;
  side: CardSide;
}

export const QACard = ({ fields, stageColor, side }: QACardP) => {
  return (
    <div className="qa-card">
      <div className="fields-container">
        {fields.map((f, i) => (f.side === side ? <Field type={f.type} data={f.data} key={i} /> : null))}
      </div>
      <div className="qa-card-bottom" style={{ backgroundColor: stageColor }} />
    </div>
  );
};
