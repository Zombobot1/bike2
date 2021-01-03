import { compose } from 'redux';
import { withBackToAndGirl } from '../passwords/hoc/with-back-to-and-girl';
import ResetPasswordCard from '../passwords/reset-password-card';

export const ResetPassword = compose(withBackToAndGirl)(ResetPasswordCard);
