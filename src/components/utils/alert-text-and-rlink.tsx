import { Link } from 'react-router-dom';
import React from 'react';

type AlertTextAndRLinkP = {
  text: string;
  linkText: string;
  to: string;
};

const AlertTextAndRLink = ({ text, linkText, to }: AlertTextAndRLinkP) => (
  <span>
    {text + ' '}
    <Link className="alert-link" to={to}>
      {linkText}
    </Link>
  </span>
);

export { AlertTextAndRLink };
