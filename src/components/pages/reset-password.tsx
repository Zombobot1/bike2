import { compose } from 'redux';
import { withBackToAndGirl } from '../passwords/hoc';
import ResetPasswordCard from '../passwords/reset-password-card';

const ResetPassword = compose(withBackToAndGirl)(ResetPasswordCard);
export { ResetPassword };
