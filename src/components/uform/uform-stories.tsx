import { UChecks } from './ufields/uchecks';
import React, { useEffect, useState } from 'react';
import { Estimations, useUFormSubmit } from './uform';
import { sslugify } from '../../utils/sslugify';
import { UInput } from './ufields/uinput';
import { Question } from '../study/training/types';

interface UQuestion extends Question {
  initialAnswer?: string[];
}
type UQuestions = UQuestion[];

const useQuestions = (questions: UQuestions, submitOneByOne: boolean) => {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [inputs, setInputs] = useState(questions);
  useEffect(() => {
    if (submitOneByOne && questionNumber < questions.length) setInputs([questions[questionNumber]]);
  }, [questionNumber]);
  const [counter, setCounter] = useState(questions.length);

  const add = () => {
    if (inputs.length > 3) return;
    setInputs((is) => [
      ...is,
      { question: `Question ${counter}`, correctAnswer: ['right'], explanation: 'Cuz', options: [] },
    ]);
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
  const [counter, setCounter] = useState(1);
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
  questions: Question[];
  isExtensible: boolean;
  submitOneByOne: boolean;
  submitOnSelect: boolean;
};

export const TUForm = ({ questions, isExtensible, submitOneByOne, submitOnSelect }: TUFormP) => {
  const { inputs, add, remove, addAndRemove, nextQuestion } = useQuestions(questions, submitOneByOne);
  const { info, onSubmit } = useSubmissionsInfo();
  const handleSubmit = !submitOneByOne
    ? onSubmit
    : (es: Estimations) => {
        onSubmit(es);
        nextQuestion();
      };

  const { submit } = useUFormSubmit();

  return (
    <div className="bg-white p-3 rounded" style={{ width: '400px' }}>
      {info && <div className="alert alert-success">{info}</div>}
      {inputs.map((q) => (
        <div key={sslugify(q.question)} className="mb-3">
          {!q.options.length && (
            <UInput {...q} tipOnMobile="SHOW_TIP" autoFocus={false} onAnswer={() => submit(handleSubmit)} />
          )}
          {q.options.length !== 0 && (
            <UChecks
              {...q}
              onAnswer={() => submit(handleSubmit)}
              submitOnSelect={submitOnSelect}
              selectMultiple={q.correctAnswer.length > 1}
            />
          )}
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
        <button className="btn btn-primary" onClick={() => submit(handleSubmit)}>
          Submit
        </button>
      </div>
    </div>
  );
};

const q = (question: string, correctAnswer: string, explanation: string, initialAnswer?: string[]): UQuestion => ({
  question,
  correctAnswer: [correctAnswer],
  explanation,
  options: [],
  initialAnswer,
});
const basicQ = q('Type: a', 'a', 'Just type it using keyboard', ['a']);
const basicQ2 = q('Type: b', 'b', 'Just type it using keyboard', ['a']);
const sillyQ = q('Question 1', 'right', 'Cuz');
const select: Question = {
  question: 'Select correct',
  options: ['Correct option', 'Option 2'],
  correctAnswer: ['Correct option'],
  explanation: 'This answer is correct because: Cuz',
};

const selectMultiple: UQuestion = {
  question: 'Select several correct options (long question to check word wrap)',
  options: ['Right', 'Wrong', 'Also right', 'Option'],
  correctAnswer: ['Right', 'Also right'],
  explanation: 'This answer is correct because: Cuz',
  initialAnswer: ['Wrong', 'Also right'],
};

const selectWithInitialAnswer: UQuestion = {
  ...select,
  initialAnswer: ['Correct option'],
};

const default_: TUFormP = {
  questions: [],
  isExtensible: false,
  submitOneByOne: false,
  submitOnSelect: true,
};

const doNotSubmitIfEmpty: TUFormP = {
  ...default_,
  questions: [sillyQ],
};

const checkAnswersOnSubmission: TUFormP = {
  ...default_,
  questions: [basicQ, basicQ2],
};

const noDataRaceOnAddRemove: TUFormP = {
  ...default_,
  questions: [sillyQ],
  isExtensible: true,
};

const readOnlyAfterSubmit: TUFormP = {
  ...default_,
  questions: [basicQ, basicQ2],
};

const sequentialSubmit: TUFormP = {
  ...default_,
  questions: [basicQ, select, basicQ2],
  submitOneByOne: true,
};

const autoSubmitForUInputAndSelectOne: TUFormP = {
  ...default_,
  questions: [basicQ, select],
  submitOneByOne: true,
};

const composite: TUFormP = {
  ...default_,
  questions: [basicQ, selectWithInitialAnswer, selectMultiple],
  submitOnSelect: false,
};

export const SUFormHook = {
  doNotSubmitIfEmpty: () => <TUForm {...doNotSubmitIfEmpty} />,
  checkAnswersOnSubmission: () => <TUForm {...checkAnswersOnSubmission} />,
  noDataRaceOnAddRemove: () => <TUForm {...noDataRaceOnAddRemove} />,
  readOnlyAfterSubmit: () => <TUForm {...readOnlyAfterSubmit} />,
  sequentialSubmit: () => <TUForm {...sequentialSubmit} />,
  composite: () => <TUForm {...composite} />,
  autoSubmitForUInputAndSelectOne: () => <TUForm {...autoSubmitForUInputAndSelectOne} />,
};
