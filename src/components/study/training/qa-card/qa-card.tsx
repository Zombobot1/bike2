import './qa-card.scss';
import React from 'react';
import { CardEstimation, estimationColor, FieldDTO } from '../types';
import { Field } from './field/field';
import { COLORS } from '../../../../config';

export interface QACardP {
  fields: FieldDTO[];
  stageColor: string;
  isCurrent: boolean;
  isMediaActive?: boolean;
  showHidden: boolean;
  estimation?: CardEstimation;
}

export const QACard = ({ fields, stageColor, isCurrent, isMediaActive = true, showHidden, estimation }: QACardP) => {
  const fieldsToShow = fields.filter((f) => f.status === 'SHOW');
  const hiddenFields = fields.filter((f) => f.status === 'HIDE');
  const backgroundColors = `linear-gradient(${COLORS.white} 0%, ${COLORS.white} 92%, ${stageColor} 92%, ${stageColor} 100%)`;
  return (
    <div className="qa-card-container" style={{ background: backgroundColors }}>
      {estimation && (
        <div className="estimation-bubble" style={{ backgroundColor: estimationColor(estimation) }}>
          <span className="estimation">{estimation[0]}</span>
        </div>
      )}
      <div className="qa-card">
        {fieldsToShow.map((f, i) => (
          <Field
            type={f.type}
            passiveData={f.passiveData}
            interactiveData={f.interactiveData}
            key={i}
            isMediaActive={isCurrent}
            isCurrent={isCurrent}
          />
        ))}
        {showHidden && hiddenFields.length !== 0 && <hr />}
        {showHidden &&
          hiddenFields.map((f, i) => (
            <Field
              type={f.type}
              passiveData={f.passiveData}
              interactiveData={f.interactiveData}
              key={i}
              isMediaActive={isCurrent && isMediaActive}
              isCurrent={isCurrent}
            />
          ))}
      </div>
    </div>
  );
};
