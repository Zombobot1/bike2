import ReactDOM from 'react-dom'
import { Shell } from './components/Shell/Shell'
import { startWorker } from './api/fapi'

if (process.env.NODE_ENV === 'development') startWorker()

ReactDOM.render(<Shell />, document.getElementById('root'))
