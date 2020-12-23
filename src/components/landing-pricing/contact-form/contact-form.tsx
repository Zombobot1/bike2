import { ReactComponent as X } from './x.svg';
import React from 'react';
import './contact-form.scss';

const ContactForm = (onX: () => void) => {
  return (
    <form className={'landing__form'}>
      <div className="form-group email-group">
        <label htmlFor="inputEmail">Your Email</label>
        <input type="email" className="form-control" id="inputEmail" placeholder="example@company.com" />
      </div>
      <div className="form-group">
        <label htmlFor="textArea">Message</label>
        <textarea className="form-control" id="textArea" rows={6} />
      </div>
      <div className={'d-flex justify-content-center'}>
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </div>
      <button className={'btn-x'} onClick={onX}>
        <X />
      </button>
    </form>
  );
};

export default ContactForm;
