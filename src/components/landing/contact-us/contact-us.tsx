import { compose } from 'redux';
import { FootlessModal } from '../../utils/footless-modal';
import ContactForm from '../../forms/forms/contact-form';

const ContactUs = compose(FootlessModal({ id: 'contact', title: 'Get your personal solution' }))(ContactForm);

export default ContactUs;
