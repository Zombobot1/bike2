import { QuestionP, QuestionWithoutOptions, URadio, URadioElement } from './ufields/uradio';
import React, { useEffect, useState } from 'react';
import { useEffectedState } from '../../utils/hooks-utils';
import { Estimations, useUFormSubmit } from './uform';
import { sslugify } from '../../utils/sslugify';
import { UInput } from './ufields/uinput';

type Questions = QuestionWithoutOptions[];

const useWriteQuestions = (questions: Questions, submitOneByOne: boolean) => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [questionsPool, setQuestionsPool] = useState(submitOneByOne ? [questions[questionNumber]] : questions);
  useEffect(() => setQuestionsPool([questions[questionNumber]]), [questionNumber]);
  const [inputs, setInputs] = useEffectedState(questionsPool);

  const [counter, setCounter] = useState(2);

  const add = () => {
    if (inputs.length > 3) return;
    setInputs((is) => [...is, { question: `Question ${counter}`, correctAnswer: ['right'], explanation: 'Cuz' }]);
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
    const right = es.filter((e) => e.estimation === 'GOOD').length;
    const wrong = es.filter((e) => e.estimation === 'BAD').length;
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
    <div className="w-50">
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

const q = (question: string, correctAnswer: string, explanation: string, initialAnswer = '') => ({
  question,
  correctAnswer: [correctAnswer],
  explanation,
  initialAnswer,
});
const basicQ = q('Type: a', 'a', 'Just type it using keyboard', 'a');
const basicQ2 = q('Type: b', 'b', 'Just type it using keyboard', 'a');
const sillyQ = q('Question 1', 'right', 'Cuz');

const doNotSubmitIfEmpty = {
  writeQuestions: [sillyQ],
  isExtensible: false,
  submitOneByOne: false,
};

const checkAnswersOnSubmission = {
  writeQuestions: [basicQ, basicQ2],
  isExtensible: false,
  submitOneByOne: false,
};

const noDataRaceOnAddRemove = {
  writeQuestions: [sillyQ],
  isExtensible: true,
  submitOneByOne: false,
};

const readOnlyAfterSubmit = {
  writeQuestions: [basicQ, basicQ2],
  isExtensible: false,
  submitOneByOne: false,
};

const sequentialSubmit = {
  writeQuestions: [basicQ, basicQ2],
  isExtensible: false,
  submitOneByOne: true,
};

const longText = 'Looooooooooooooooooong text inside this option renders without visual deffects';

const composite = {
  writeQuestions: [basicQ],
  isExtensible: false,
  selectOneQuestions: [
    {
      question: 'Select correct',
      options: ['Correct option', longText],
      correctAnswer: ['Correct option'],
      explanation: 'Cuz',
    },
  ],
  submitOneByOne: false,
};

export const SUFormHook = {
  doNotSubmitIfEmpty: () => <TUForm {...doNotSubmitIfEmpty} />,
  checkAnswersOnSubmission: () => <TUForm {...checkAnswersOnSubmission} />,
  noDataRaceOnAddRemove: () => <TUForm {...noDataRaceOnAddRemove} />,
  readOnlyAfterSubmit: () => <TUForm {...readOnlyAfterSubmit} />,
  sequentialSubmit: () => <TUForm {...sequentialSubmit} />,
  composite: () => <TUForm {...composite} />,
};

export interface TURadioP extends QuestionP {
  wasSubmitted: boolean;
  value: string;
}

export const TURadio = ({ question, options, correctAnswer, explanation, value, wasSubmitted }: TURadioP) => {
  const [value_, setValue] = useState(value);
  return (
    <URadioElement
      name={sslugify(question)}
      value={value_}
      onChange={(_, v) => setValue(v)}
      validationError={''}
      wasSubmitted={wasSubmitted}
      options={options}
      question={question}
      correctAnswer={correctAnswer}
      explanation={explanation}
    />
  );
};

const radioData = {
  question: 'Please select',
  options: ['Option 1', 'Option 2', 'Option 3'],
  correctAnswer: ['Option 1'],
  explanation: 'This is a loooooooooooooooooooooong Cuz',
};

const default_ = {
  ...radioData,
  wasSubmitted: false,
  value: '',
};

const submitted = {
  ...radioData,
  wasSubmitted: true,
  value: 'Option 1',
};

export const SUradio = {
  Default: () => <TURadio {...default_} />,
  Submitted: () => <TURadio {...submitted} />,
};
