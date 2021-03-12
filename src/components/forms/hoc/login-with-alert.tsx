import { withAlert } from '../../utils/hoc/with-alert';
import LoginForm from '../forms/login-form';
import { AlertWithText } from '../../utils/alert';
import compose from '../../../utils/utils';

export const LoginWithAlert = compose(withAlert(AlertWithText('danger', 'Wrong login or password')))(LoginForm);
