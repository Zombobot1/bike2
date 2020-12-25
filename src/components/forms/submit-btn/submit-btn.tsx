import React from 'react';

type SubmitBtnP = {
  text?: string;
};

const SubmitBtn = ({ text = 'Sign in' }: SubmitBtnP) => (
  <button type="submit" className="btn btn-primary">
    {text}
  </button>
);

export default SubmitBtn;
