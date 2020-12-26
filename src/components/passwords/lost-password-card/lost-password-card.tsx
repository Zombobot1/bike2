import '../password-card.scss';
import React from 'react';
import RecoverPasswordForm from '../../forms/forms/recover-password-form';

const chillingText = "Don't fret! Just type in your email and we will send you a code to reset your password!";

const LostPasswordCard = () => {
  return (
    <div className="password-card align-self-center">
      <h2 className="card__header">Forgot your password?</h2>
      <p>{chillingText}</p>
      <RecoverPasswordForm />
    </div>
  );
};

export default LostPasswordCard;
