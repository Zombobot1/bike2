import { Fn } from '../../../../utils/types'
import { useTrainingTimer } from '../training-timer/training-timer'
import { MouseEvent, useState, memo } from 'react'
import { IconButton, MenuItem, Menu, ListItemIcon, ListItemText } from '@mui/material'
import TimerOffRoundedIcon from '@mui/icons-material/TimerOffRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { AcceptRemovalDialog } from '../../../utils/AcceptRemovalDialog'

export interface TrainingSettingsP {
  deleteCard: Fn
  cardId: string
}

export interface TrainingSettings_P extends TrainingSettingsP {
  isTimerRunning: boolean
  pauseTimer: Fn
  resumeTimer: Fn
}

export function TrainingSettings_({ deleteCard, isTimerRunning, pauseTimer, resumeTimer }: TrainingSettings_P) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const isAlertOpenS = useState(false)
  const [_, setIsAlertOpen] = isAlertOpenS

  const deleteCardClick = () => {
    handleMenuClose()
    pauseTimer()
    setIsAlertOpen(true)
  }

  const stopTimer = () => {
    handleMenuClose()
    if (isTimerRunning) pauseTimer()
    else resumeTimer()
  }

  return (
    <>
      <IconButton
        id="demo-positioned-button"
        aria-controls="demo-positioned-menu"
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? 'true' : undefined}
        onClick={handleMenuOpen}
      >
        <SettingsRoundedIcon />
      </IconButton>
      <AcceptRemovalDialog
        text="Do you want to remove card?"
        isOpenS={isAlertOpenS}
        onAccept={deleteCard}
        onClose={resumeTimer}
      />
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        // sx={{ transform: 'translate(-130px, -80px)' }}
      >
        <MenuItem onClick={stopTimer}>
          <ListItemIcon>
            <TimerOffRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isTimerRunning ? 'Stop' : 'Resume'} timer</ListItemText>
        </MenuItem>
        <MenuItem onClick={deleteCardClick}>
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete card</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

const TrainingSettingsMemoized = memo(
  function (props: TrainingSettings_P) {
    return <TrainingSettings_ {...props} />
  },
  (p, n) => p.cardId === n.cardId && p.isTimerRunning === n.isTimerRunning,
)

export const TrainingSettings = ({ deleteCard, cardId }: TrainingSettingsP) => {
  const { pause, resume, isRunning } = useTrainingTimer()
  return (
    <TrainingSettingsMemoized
      isTimerRunning={isRunning}
      pauseTimer={pause}
      resumeTimer={resume}
      deleteCard={deleteCard}
      cardId={cardId}
    />
  )
}
