import { shuffle } from '../../../../../utils/algorithms';
import React, { useState } from 'react';
import { UChecks, UChecksP } from '../../../../uform/ufields/uchecks';

export const RadioField = (props: UChecksP) => {
  const [shuffledOptions] = useState(() => shuffle(props.options));
  return <UChecks {...props} options={shuffledOptions} />;
};
