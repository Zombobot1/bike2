import { compose } from 'redux';
import { withBackToAndGirl } from '../passwords/hoc/with-back-to-and-girl';
import ForgotPasswordCard from '../passwords/forgot-password-card';

const ForgotPassword = compose(withBackToAndGirl)(ForgotPasswordCard);

export { ForgotPassword };
