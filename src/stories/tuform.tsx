import React, { useState } from 'react';
import { Estimations, useUForm } from '../components/pages/_sandbox/uform';
import { UInput } from '../components/uform/ufields/uinput';

type Question = { question: string; correctAnswer: string; explanation: string };
type Questions = Question[];

const useQuestions = (questions: Questions) => {
  const [inputs, setInputs] = useState(questions);
  const [counter, setCounter] = useState(2);

  const add = () => {
    if (inputs.length > 3) return;
    setInputs((is) => [...is, { question: `Question ${counter}`, correctAnswer: 'right', explanation: 'Cuz' }]);
    setCounter((c) => c + 1);
  };

  const remove = () => {
    if (inputs.length < 2) return;
    setInputs((is) => is.filter((_, i) => i !== 0));
  };

  const addAndRemove = () => {
    // edge case: if number of questions does not change instead of mounting/unmounting just properties changes happen
    setInputs((is) => [...is, { question: `Random question ${counter}`, correctAnswer: 'right', explanation: 'Cuz' }]);
    add();
    remove();
  };

  return { inputs, add, remove, addAndRemove };
};

const useSubmissionsInfo = () => {
  const [counter, setCounter] = useState(0);
  const [info, setInfo] = useState('');

  const onSubmit = (es: Estimations) => {
    const right = es.filter((e) => e.estimation === 'GOOD').length;
    const wrong = es.filter((e) => e.estimation === 'BAD').length;
    setInfo(`Submission ${counter}. Correct: ${right}. Wrong: ${wrong}`);
    setCounter((c) => c + 1);
  };

  return { info, onSubmit };
};

export type TUFormP = {
  questions: Questions;
  isExtensible: boolean;
};

export const TUForm = ({ questions, isExtensible }: TUFormP) => {
  const { inputs, add, remove, addAndRemove } = useQuestions(questions);
  const { info, onSubmit } = useSubmissionsInfo();

  const { submit } = useUForm(onSubmit);

  return (
    <div className="w-25">
      {info && <div className="alert alert-success">{info}</div>}
      {inputs.map((q, i) => (
        <div key={i} className="mb-3">
          <UInput {...q} />
        </div>
      ))}
      <div className="d-flex justify-content-end">
        {isExtensible && (
          <div className="pe-3">
            <div className="btn-group">
              <button className="btn btn-outline-primary" onClick={add}>
                +
              </button>
              <button className="btn btn-outline-primary" onClick={addAndRemove}>
                + -
              </button>
              <button className="btn btn-outline-primary" onClick={remove}>
                -
              </button>
            </div>
          </div>
        )}
        <button className="btn btn-primary" onClick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
};
