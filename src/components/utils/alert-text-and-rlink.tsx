import { Link } from 'react-router-dom';
import React from 'react';

export interface AlertTextAndRLinkP {
  text: string;
  linkText: string;
  to: string;
}

export const AlertTextAndRLink = ({ text, linkText, to }: AlertTextAndRLinkP) => (
  <span>
    {text + ' '}
    <Link className="alert-link" to={to}>
      {linkText}
    </Link>
  </span>
);
