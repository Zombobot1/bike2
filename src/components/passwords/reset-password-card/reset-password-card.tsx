import '../common.scss';
import React from 'react';
import ResetPasswordForm from '../../forms/forms/reset-password-form';

const ResetPasswordCard = () => {
  return (
    <div className="password-card align-self-center">
      <h2 className="card__header">Reset password</h2>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordCard;
