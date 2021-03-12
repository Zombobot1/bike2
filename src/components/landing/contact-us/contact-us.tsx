import { FootlessModal } from '../../utils/footless-modal';
import ContactForm from '../../forms/forms/contact-form';
import compose from '../../../utils/utils';

const ContactUs = compose(FootlessModal({ id: 'contact', title: 'Get your personal solution' }))(ContactForm);

export default ContactUs;
