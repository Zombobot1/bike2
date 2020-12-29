import './page404.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { OVERVIEW } from '../index';
import { ReactComponent as Image404 } from '../images/404image.svg';

const Page404 = () => (
  <div className="page404 d-flex flex-column">
    <Image404 />
    <p className="page404__h">
      Page not <b>found</b>
    </p>
    <p>Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.</p>
    <Link className="btn-lg btn-primary" to={OVERVIEW}>
      Go back home
    </Link>
  </div>
);

export default Page404;
