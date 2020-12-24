import { compose } from 'redux';
import { withAlert } from '../../utils/hoc/with-alert';
import { Alert } from '../../utils';
import LoginForm from '../login-form';

export const LoginWithAlert = compose(withAlert(Alert('danger', 'Wrong login or password')))(LoginForm);
