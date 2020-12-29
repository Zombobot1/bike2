import { LOSTPASSWORD } from '../../../pages';
import React from 'react';
import { AlertTextAndRLink } from '../../../utils/alert-text-and-rlink';
import { Alert } from '../../../utils';

const UserAlreadyExists = () => (
  <AlertTextAndRLink text={'User already exists!'} linkText={'Reset password'} to={LOSTPASSWORD} />
);
export const UserAlreadyExistsAlert = Alert('danger', UserAlreadyExists);
