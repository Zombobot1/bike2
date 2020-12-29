import './with-back-to-and-girl.scss';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as ChevronLeft } from '../../../components/icons/chevron-left.svg';
import { ReactComponent as Girl } from '../../../components/images/standing-girl.svg';
import { PAGES, SIGNIN } from '../../pages';

const withBackToAndGirl = (Base: FC) => () => {
  return (
    <>
      <div className="forgot-password-container d-flex flex-column">
        <Link className="back-to align-self-center" to={SIGNIN}>
          <ChevronLeft />
          <span>Back to log in</span>
        </Link>
        <Base />
      </div>
      <Girl />
    </>
  );
};

export { withBackToAndGirl };
