import { QACard, QACardP } from './qa-card';
import React from 'react';
import { cardWithDifferentFields, cardWithQandA, uCardLong, uCardMinimal } from '../../../../content';

export const QACardT = (args: QACardP) => (
  <div style={{ width: '500px', height: '715px' }}>
    <QACard {...args} />
  </div>
);

export const hiddenA: QACardP = {
  isCurrent: true,
  stageColor: '#6C38FF',
  showHidden: false,
  fields: uCardLong.fields,
};

const template1 = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardLong.fields,
};

export const allFieldsShownA: QACardP = {
  ...template1,
};

export const estimatedA: QACardP = {
  ...template1,
  estimation: 'RIGHT',
};

const template2 = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardMinimal.fields,
};

export const minimalA: QACardP = {
  ...template2,
  showHidden: false,
};

export const minimalHiddenA: QACardP = {
  ...template2,
};

export const longTextA: QACardP = {
  ...template1,
  fields: cardWithQandA.fields,
};

export const interactiveAndPassiveA: QACardP = {
  ...template1,
  fields: cardWithDifferentFields.fields,
};
