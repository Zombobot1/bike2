import { compose } from 'redux';
import { withBackToAndGirl } from '../passwords/hoc/with-back-to-and-girl';
import LostPasswordCard from '../passwords/lost-password-card';

const LostPassword = compose(withBackToAndGirl)(LostPasswordCard);

export { LostPassword };
