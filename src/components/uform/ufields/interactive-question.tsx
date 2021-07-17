import { styled, Typography } from '@material-ui/core';
import { Validity } from '../types';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

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
      {status === 'VALID' && <CheckRoundedIcon color="success" sx={sx} />}
      {status === 'INVALID' && <CloseRoundedIcon color="error" sx={sx} />}
      {question}
    </Question>
  );
}
