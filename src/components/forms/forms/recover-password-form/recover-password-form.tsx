import { submit } from '../../utils';
import { ValidatedEmail } from '../../validated-fields';
import SubmitBtn from '../../submit-btn';
import React from 'react';
import { useStrInput } from '../../hooks/use-validation';
import { EmailV } from '../../../../validation/atoms';

const RecoverPasswordForm = () => {
  const email = useStrInput('email', EmailV.validateEmail);
  return (
    <form className="form" onSubmit={submit([email])}>
      <ValidatedEmail {...email} />
      <SubmitBtn className={'mt-4'} text="Recover password" />
    </form>
  );
};

export default RecoverPasswordForm;
