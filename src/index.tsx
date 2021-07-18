import ReactDOM from 'react-dom';

import { startWorker } from './api/fake-api';

import { Shell } from './components/Shell/Shell';

if (process.env.NODE_ENV === 'development') {
  (async () => {
    await startWorker();
  })();
}

ReactDOM.render(<Shell />, document.getElementById('root'));
