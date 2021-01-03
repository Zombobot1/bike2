import { compose } from 'redux';
import { withBackToAndGirl } from '../passwords/hoc/with-back-to-and-girl';
import LostPasswordCard from '../passwords/lost-password-card';

export const LostPassword = compose(withBackToAndGirl)(LostPasswordCard);
