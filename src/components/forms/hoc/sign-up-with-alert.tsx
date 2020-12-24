import { compose } from 'redux';
import { withAlert } from '../../utils/hoc/with-alert';
import { Alert } from '../../utils';
import SignUpForm from '../sign-up-form';

export const SignUpWithAlert = compose(withAlert(Alert('danger', 'This user already exists')))(SignUpForm);
