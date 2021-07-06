import { QACard, QACardP } from './qa-card';
import React from 'react';
import { cardWithDifferentFields, cardWithQandA, uCardLong, uCardMinimal } from '../../../../content/content';

export const QACardT = (args: QACardP) => (
  <div style={{ width: '500px', height: '715px' }}>
    <QACard {...args} />
  </div>
);

const hiddenA: QACardP = {
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

const allFieldsShownA: QACardP = {
  ...template1,
};

const estimatedA: QACardP = {
  ...template1,
  estimation: 'GOOD',
};

const template2 = {
  isCurrent: true,
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardMinimal.fields,
};

const minimalA: QACardP = {
  ...template2,
  showHidden: false,
};

const minimalHiddenA: QACardP = {
  ...template2,
};

const longTextA: QACardP = {
  ...template1,
  fields: cardWithQandA.fields,
};

const interactiveAndPassiveA: QACardP = {
  ...template1,
  fields: cardWithDifferentFields.fields,
};

export const SQACard = {
  hidden: () => QACardT(hiddenA),
  allFieldsShown: () => QACardT(allFieldsShownA),
  estimated: () => QACardT(estimatedA),
  minimal: () => QACardT(minimalA),
  minimalHidden: () => QACardT(minimalHiddenA),
  longText: () => QACardT(longTextA),
  interactiveAndPassive: () => QACardT(interactiveAndPassiveA),
};
