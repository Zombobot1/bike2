import { BoolStateT, Fn } from '../../../../utils/types';
import { useTrainingTimer } from '../training-timer/training-timer';
import React, { MouseEvent, useState, memo } from 'react';
import {
  IconButton,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import TimerOffRoundedIcon from '@material-ui/icons/TimerOffRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';

interface AlertDialogP {
  isOpenS: BoolStateT;
  onAccept: Fn;
  onClose: Fn;
}

function AlertDialog({ isOpenS, onAccept, onClose }: AlertDialogP) {
  const [isOpen, setIsOpen] = isOpenS;

  const handleClose = () => {
    onClose();
    setIsOpen(false);
  };

  const handleAccept = () => {
    onAccept();
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Accept dangerous action'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">Do you want to remove card?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleAccept} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface TrainingSettingsP {
  deleteCard: Fn;
  cardId: string;
}

export interface TrainingSettings_P extends TrainingSettingsP {
  isTimerRunning: boolean;
  pauseTimer: Fn;
  resumeTimer: Fn;
}

export function TrainingSettings_({ deleteCard, isTimerRunning, pauseTimer, resumeTimer }: TrainingSettings_P) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isAlertOpenS = useState(false);
  const [_, setIsAlertOpen] = isAlertOpenS;

  const deleteCardClick = () => {
    handleMenuClose();
    pauseTimer();
    setIsAlertOpen(true);
  };

  const stopTimer = () => {
    handleMenuClose();
    if (isTimerRunning) pauseTimer();
    else resumeTimer();
  };

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
      <AlertDialog isOpenS={isAlertOpenS} onAccept={deleteCard} onClose={resumeTimer} />
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
  );
}

const TrainingSettingsMemoized = memo(
  function (props: TrainingSettings_P) {
    return <TrainingSettings_ {...props} />;
  },
  (p, n) => p.cardId === n.cardId && p.isTimerRunning === n.isTimerRunning,
);

export const TrainingSettings = ({ deleteCard, cardId }: TrainingSettingsP) => {
  const { pause, resume, isRunning } = useTrainingTimer();
  return (
    <TrainingSettingsMemoized
      isTimerRunning={isRunning}
      pauseTimer={pause}
      resumeTimer={resume}
      deleteCard={deleteCard}
      cardId={cardId}
    />
  );
};
