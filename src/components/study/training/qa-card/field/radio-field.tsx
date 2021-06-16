import { URadio, URadioP } from '../../../../uform/ufields/uradio';
import { shuffle } from '../../../../../utils/algorithms';
import React, { useState } from 'react';

export const RadioField = (props: URadioP) => {
  const [shuffledOptions] = useState(() => shuffle(props.options));
  return <URadio {...props} options={shuffledOptions} />;
};
