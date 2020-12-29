import React from 'react';
import { Redirect } from 'react-router-dom';
import { SIGNIN } from './index';

export const Page404 = () => <div>404</div>;
export const Redirect404 = () => <Redirect to={SIGNIN} />;
