import './login-options.scss';
import { ReactComponent as Google } from '../../icons/google.svg';
import React from 'react';

export interface LoginOptionsP {
  text: string;
}

const LoginOptions = ({ text }: LoginOptionsP) => (
  <>
    <p className={'login-with'}>{text}</p>
    <div className={'d-flex justify-content-center'}>
      <button className={'btn-google btn btn-outline-primary'}>
        <Google />
        Google
      </button>
    </div>
  </>
);

export default LoginOptions;
