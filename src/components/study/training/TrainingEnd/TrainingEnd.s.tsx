import { Box } from '@material-ui/core'
import { TrainingEnd } from './TrainingEnd'

function Template(props: TrainingEnd) {
  return (
    <Box sx={{ height: '100%', maxWidth: 500, maxHeight: 715, width: '100%' }}>
      <TrainingEnd {...props} />
    </Box>
  )
}

const good: TrainingEnd = {
  currentTrainingId: '',
  mistakesCount: 4,
  expectedTime: 60 * 60,
  spentTime: 60 * 59,
}

const notGood: TrainingEnd = {
  ...good,
  expectedTime: 60 * 60,
  spentTime: 60 * 62,
}

const great: TrainingEnd = {
  ...good,
  mistakesCount: 0,
  spentTime: 60 * 44,
}

export const NotGoodEnd = () => <Template {...notGood} />
export const GoodEnd = () => <Template {...good} />
export const GreatEnd = () => <Template {...great} />
