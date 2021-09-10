import { BoolState, Fn, fn, str } from '../../utils/types'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'

export interface AcceptRemovalDialog {
  text: str
  isOpenS: BoolState
  onAccept: Fn
  onClose?: Fn
}

export function AcceptRemovalDialog({ text, isOpenS, onAccept, onClose = fn }: AcceptRemovalDialog) {
  const [isOpen, setIsOpen] = isOpenS

  const handleClose = () => {
    onClose()
    setIsOpen(false)
  }

  const handleAccept = () => {
    onAccept()
    handleClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Accept dangerous action'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleAccept} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
