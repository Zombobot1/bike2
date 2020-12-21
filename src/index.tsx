import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

const header = 'Learn better with Uni';
const paragraph =
  'Achieve the highest results in studying using the most powerful flashcards application and do not worry about forgetting with flexible spaced repetition';
const btn_text = 'Register for free';

ReactDOM.render(
  <React.StrictMode>
    <App header={header} paragraph={paragraph} btn_text={btn_text} />
  </React.StrictMode>,
  document.getElementById('root'),
);
