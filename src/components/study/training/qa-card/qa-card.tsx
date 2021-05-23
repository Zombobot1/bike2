import './qa-card.scss';
import React from 'react';
import { CardSide, FieldT } from '../types';
import { Field } from './field/field';

export interface QACardP {
  fields: FieldT[];
  stageColor: string;
  side: CardSide;
  isCurrent: boolean;
}

export const QACard = ({ fields, stageColor, side, isCurrent }: QACardP) => {
  return (
    <>
      <div className="qa-card">
        <form>
          {fields.map((f, i) =>
            f.side === side ? (
              <Field type={f.type} data={f.data} key={i} isMediaActive={f.side === 'BACK'} isCurrent={isCurrent} />
            ) : null,
          )}
        </form>
      </div>
      <div className="qa-card-bottom" style={{ backgroundColor: stageColor }} />
    </>
  );
};
