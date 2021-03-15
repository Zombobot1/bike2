import { withBackToAndGirl } from '../passwords/hoc/with-back-to-and-girl';
import LostPasswordCard from '../passwords/lost-password-card';
import compose from '../../utils/utils';

export const LostPassword = compose(withBackToAndGirl)(LostPasswordCard);
