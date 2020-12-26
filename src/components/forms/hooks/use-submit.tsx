import { activateAll, InputControl } from '../utils';
import { useState } from 'react';

const useSubmit = (inputs: InputControl[]) => {
  const [isSubmittable, setIsSubmittable] = useState(false);
  const validateInputs = () => {
    activateAll(inputs);
    const isNotValid = (e: InputControl) => !e.isValid();
    setIsSubmittable(!inputs.find(isNotValid));
  };
  return { isSubmittable, validateInputs };
};

export { useSubmit };
