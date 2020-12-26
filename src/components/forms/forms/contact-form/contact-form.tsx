import './contact-form.scss';
import { useStrInput } from '../../hooks/use-validation';
import { ContactFormV } from '../../../../validation/contact-form';
import { useSubmit } from '../../hooks/use-submit';
import { preventAndCall } from '../../../../utils/events';
import { ValidatedEmail } from '../../validated-fields';
import { ValidatedTextArea } from '../../validated-fields/validated-fields';
import ModalSubmitBtn from '../../modal-submit-btn';
import React from 'react';

const ContactForm = () => {
  const email = useStrInput('email', ContactFormV.validateEmail);
  const message = useStrInput('message', ContactFormV.validateMessage);
  const { isSubmittable, validateInputs } = useSubmit([email, message]);
  return (
    <form className={'contact-form'} onSubmit={preventAndCall(validateInputs)}>
      <ValidatedEmail {...email} />
      <ValidatedTextArea {...message} />
      <ModalSubmitBtn canDismiss={isSubmittable} />
    </form>
  );
};

export default ContactForm;
