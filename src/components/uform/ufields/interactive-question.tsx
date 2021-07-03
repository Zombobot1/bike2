import { styled, Typography } from '@material-ui/core';
import React from 'react';
import { Validity } from '../types';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

export interface InteractiveQuestionP {
  question: string;
  status: Validity;
}

const Question = styled(Typography)({
  fontSize: 25,
  marginBottom: 10,
});

export function InteractiveQuestion({ question, status }: InteractiveQuestionP) {
  if (!question) return null;

  const sx = { marginBottom: 0.6, marginRight: 0.6 };

  return (
    <Question>
      {status === 'VALID' && <CheckIcon color="success" sx={sx} />}
      {status === 'INVALID' && <CloseIcon color="error" sx={sx} />}
      {question}
    </Question>
  );
}
