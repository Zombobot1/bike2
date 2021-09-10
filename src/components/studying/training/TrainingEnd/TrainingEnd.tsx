import { Stack, styled, Typography, useTheme } from '@material-ui/core'
import { useState } from 'react'
import { fancyTime, percentage } from '../../../../utils/formatting'
import { useMount } from '../../../utils/hooks/hooks'
import { num, str } from '../../../../utils/types'
import { TrainingCard } from '../../trainings/training-deck/training-card/training-card'
import { TrainingDTO } from '../training/training'
import { ReactComponent as BadgeI } from './badge.svg'

interface Badge {
  spentTime: num
  expectedTime: num
  mistakesCount: num
}

export interface TrainingEnd extends Badge {
  currentTrainingId: str
}

export function TrainingEnd({ expectedTime, mistakesCount, spentTime, currentTrainingId: _ }: TrainingEnd) {
  const theme = useTheme()
  const [nextTraining] = useState<TrainingDTO | undefined>()

  let color = theme.palette.error.main
  if (spentTime < expectedTime) color = theme.palette.success.main
  const timeDelta =
    spentTime < expectedTime
      ? `-${percentage(1 - spentTime / expectedTime)}`
      : `+${percentage(1 - expectedTime / spentTime)}`

  useMount(() => {
    // api.getNextTraining(currentTrainingId).then(setNextTraining)
  })

  return (
    <Card>
      <Stack direction="row" justifyContent="center">
        <Badge expectedTime={expectedTime} mistakesCount={mistakesCount} spentTime={spentTime} />
      </Stack>
      <Congratulation>
        {newRecord(spentTime, expectedTime, mistakesCount) ? 'WOW, New Record!' : 'Great Job!'}
      </Congratulation>
      <Stats direction="row" justifyContent="space-between">
        <Stack>
          <StatsHeaders>Time</StatsHeaders>
          <Stat>
            {fancyTime(spentTime)}
            <Typography component="span" fontWeight="bold" color={color} sx={{ display: 'inline' }}>
              {' ' + timeDelta}
            </Typography>
          </Stat>
        </Stack>
        <Stack>
          <StatsHeaders>Mistakes</StatsHeaders>
          <Stat color={!mistakesCount ? 'success' : 'error'}>{mistakesCount}</Stat>
        </Stack>
      </Stats>
      {Boolean(nextTraining) && (
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <StatsHeaders>Continue?</StatsHeaders>
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          <TrainingCard {...nextTraining!} />
        </Stack>
      )}
    </Card>
  )
}

const Card = styled('div', { label: 'TrainingEnd' })(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.common.white,
  border: `0.5px solid ${theme.palette.grey['200']}`,
  borderRadius: 25,
  padding: '3rem 2rem',
}))

const newRecord = (spentTime: num, expectedTime: num, mistakesCount: num) =>
  spentTime / expectedTime <= 0.75 && mistakesCount === 0

function Badge({ mistakesCount, expectedTime, spentTime }: Badge) {
  const theme = useTheme()

  let color = theme.palette.warning.main

  if (spentTime <= expectedTime) color = theme.palette.success.main
  if (newRecord(spentTime, expectedTime, mistakesCount)) color = theme.palette.info.main

  const sx = {
    '& .circle': {
      stroke: color,
    },
    '& .star': {
      fill: color,
    },
  }
  return <Icon sx={sx} />
}

const Icon = styled(BadgeI)({
  width: '8rem',
  height: '8rem',
})

const Congratulation = styled(Typography)({
  textAlign: 'center',
  fontSize: '2rem',
  padding: '2rem 0 ',
})

const StatsHeaders = styled(Typography)({
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
})

const Stats = styled(Stack, { label: 'Stats' })(({ theme }) => ({
  padding: '0 1.5rem',
  marginBottom: '3rem',

  [`${theme.breakpoints.up('sm')}`]: {
    marginBottom: '5rem',
    padding: '0 3rem',
  },
}))

const Stat = styled(Typography)({
  textAlign: 'center',
  fontSize: '1.2rem',
  fontWeight: 600,
})
