import React from 'react';
import ReactDOM from 'react-dom';

import './components/shared-icons/shared-icons.scss';

import App from './components/app';

const hero_header = 'Learn better with Uni';
const paragraph =
  'Achieve the highest results in studying using the most powerful flashcards application and do not worry about forgetting with flexible spaced repetition';
const btn_text = 'Register for free';

const features_header = 'Features';
const features = [
  {
    subheader: 'Spaced repetition',
    description:
      'According to many studies people forget up to 80% of information they learn. \n' +
      '\n' +
      'Different techniques of spaced repetition will help you to consolidate your memories.',
  },
  {
    subheader: 'High flexibility',
    description:
      'Various types of information require different representation to ease learning. \n' +
      '\n' +
      'You can create your own flashcards and integrate images and sounds inside them.',
  },
  {
    subheader: 'Full control',
    description:
      'It is really important to stick to a systematic approach when  learning.\n' +
      '\n' +
      'Uni will organize your study process to help you minimize learning time.',
  },
];

const appProperties = {
  hero: {
    header: hero_header,
    paragraph,
    btn_text,
  },
  features: {
    header: features_header,
    features,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <App hero={appProperties.hero} features={appProperties.features} />
  </React.StrictMode>,
  document.getElementById('root'),
);
