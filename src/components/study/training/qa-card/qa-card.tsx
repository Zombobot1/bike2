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
  const fieldsToShow = fields.filter((f) => f.state === 'SHOW');
  const hiddenFields = fields.filter((f) => !f.state || f.state === 'HIDE');
  const backgroundColors = `linear-gradient(${COLORS.white} 0%, ${COLORS.white} 75%, ${stageColor} 75%, ${stageColor} 100%)`;
  console.log(fieldsToShow.length);
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
        {showHidden && <div className="fields-separator" />}
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
