import { compose } from 'redux';
import { withAlert } from '../../utils/hoc/with-alert';
import LoginForm from '../login-form';
import { AlertWithText } from '../../utils/alert';

export const LoginWithAlert = compose(withAlert(AlertWithText('danger', 'Wrong login or password')))(LoginForm);
