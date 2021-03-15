import { withBackToAndGirl } from '../passwords/hoc/with-back-to-and-girl';
import ResetPasswordCard from '../passwords/reset-password-card';
import compose from '../../utils/utils';

export const ResetPassword = compose(withBackToAndGirl)(ResetPasswordCard);
