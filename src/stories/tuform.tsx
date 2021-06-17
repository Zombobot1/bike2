import React, { useEffect, useState } from 'react';
import { Estimations, useUFormSubmit } from '../components/uform/uform';
import { UInput } from '../components/uform/ufields/uinput';
import { QuestionP, QuestionWithoutOptions, URadio } from '../components/uform/ufields/uradio';
import { useEffectedState } from '../utils/hooks-utils';
import { sslugify } from '../utils/sslugify';

type Questions = QuestionWithoutOptions[];

const useWriteQuestions = (questions: Questions, submitOneByOne: boolean) => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [questionsPool, setQuestionsPool] = useState(submitOneByOne ? [questions[questionNumber]] : questions);
  useEffect(() => setQuestionsPool([questions[questionNumber]]), [questionNumber]);
  const [inputs, setInputs] = useEffectedState(questionsPool);

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
    add();
    remove();
  };

  const nextQuestion = () => setQuestionNumber((n) => n + 1);

  return { inputs, add, remove, addAndRemove, nextQuestion };
};

const useSubmissionsInfo = () => {
  const [counter, setCounter] = useState(0);
  const [info, setInfo] = useState('');

  const onSubmit = (es: Estimations) => {
    const right = es.filter((e) => e.estimation === 'RIGHT').length;
    const wrong = es.filter((e) => e.estimation === 'WRONG').length;
    setInfo(`Submission ${counter}. Correct: ${right}. Wrong: ${wrong}`);
    setCounter((c) => c + 1);
  };

  return { info, onSubmit };
};

export type TUFormP = {
  writeQuestions: Questions;
  isExtensible: boolean;
  submitOneByOne: boolean;
  selectOneQuestions?: QuestionP[];
};

export const TUForm = ({ writeQuestions, isExtensible, submitOneByOne, selectOneQuestions = [] }: TUFormP) => {
  const { inputs, add, remove, addAndRemove, nextQuestion } = useWriteQuestions(writeQuestions, submitOneByOne);
  const { info, onSubmit } = useSubmissionsInfo();
  const handleSubmit = !submitOneByOne
    ? onSubmit
    : (es: Estimations) => {
        onSubmit(es);
        nextQuestion();
      };

  const { submit } = useUFormSubmit();

  return (
    <div className="w-25">
      {info && <div className="alert alert-success">{info}</div>}
      {inputs
        .filter((q) => Boolean(q))
        .map((q) => (
          <div key={sslugify(q.question)} className="mb-3">
            <UInput {...q} />
          </div>
        ))}
      {selectOneQuestions?.map((q) => (
        <URadio key={q.question} {...q} />
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
        <button className="btn btn-primary" onClick={() => submit(handleSubmit)}>
          Submit
        </button>
      </div>
    </div>
  );
};
