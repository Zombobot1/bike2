import React from 'react';
import ReactDOM from 'react-dom';

const text = 'Hello world'

const App: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);

ReactDOM.render(
  <React.StrictMode>
    <App message={text}/>
  </React.StrictMode>,
  document.getElementById('root')
);
