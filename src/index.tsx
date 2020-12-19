import React from 'react';
import ReactDOM from 'react-dom';

const text = 'Hello world!!';

type RFC<T> = React.FunctionComponent<T>;
type WithMessage = { message: string };
type AppT = RFC<WithMessage>;

const App: AppT = ({ message }) => <div>{message}</div>;

ReactDOM.render(
  <React.StrictMode>
    <App message={text} />
  </React.StrictMode>,
  document.getElementById('root'),
);
