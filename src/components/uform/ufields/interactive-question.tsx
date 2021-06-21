import React from 'react';
import { ReactComponent as Ok } from '../../icons/bi-check.svg';
import { ReactComponent as NotOk } from '../../icons/bi-exclamation-circle.svg';
import { Validity } from '../types';

export interface InteractiveQuestionP {
  question: string;
  id?: string;
  status: Validity;
}

export function InteractiveQuestion({ id, question, status }: InteractiveQuestionP) {
  if (!question) return null;

  return (
    <div className="interactive-question">
      {status === 'VALID' && <Ok />}
      {status === 'INVALID' && <NotOk />}
      <label className="form-label" htmlFor={id ?? ''}>
        {question}
      </label>
    </div>
  );
}
