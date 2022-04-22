import {
  Modal,
  ClickAwayListener,
  Snackbar,
  Alert,
  Box,
  styled,
  Stack,
  Typography,
  MenuItem,
  Button,
  Fab,
  AlertTitle,
  FormControl,
  InputLabel,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { TrainingIdAndDTO, UCardPriority } from '../../../../fb/FSSchema'
import { str, bool, Fn, num, NumState } from '../../../../utils/types'
import { all, cut } from '../../../../utils/utils'
import { uformBlocks } from '../../../editing/UPage/UBlock/BlockAutocomplete/BlockAutocompleteOptions'
import { UBlocksSet } from '../../../editing/UPage/UBlockSet/UBlockSet'
import { isUFormBlock } from '../../../editing/UPage/ublockTypes'
import { useIsSM } from '../../../utils/hooks/hooks'
import { RStack, USelect, IBtn } from '../../../utils/MuiUtils'
import { IdeaState, useIdeaState } from '../../IdeaState'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded'
import { IdeaData, IdeaType } from '../../types'

export interface IdeaEditor {
  upageId: str
  id: str
  close: Fn
  training?: TrainingIdAndDTO
  closeTriggerS: NumState
}

export function IdeaEditor({ id, upageId, training, close, closeTriggerS }: IdeaEditor) {
  const { data, changer } = useIdeaState(id, upageId, training)
  return <IdeaEditor_ data={data} changer={changer} training={training} close={close} closeTriggerS={closeTriggerS} />
}

interface IdeaEditor_ {
  data: IdeaData
  changer: IdeaState
  training?: TrainingIdAndDTO
  close: Fn
  closeTriggerS: NumState
}

export function IdeaEditor_({ data, changer, training, close, closeTriggerS }: IdeaEditor_) {
  const [closeTrigger, setCloseTrigger] = closeTriggerS
  const created = !!training

  return (
    <Grid onClick={() => setCloseTrigger((o) => o + 1)}>
      <Box className="history">
        {created && (
          <Box onClick={(e) => e.stopPropagation()} sx={{ backgroundColor: 'blue', height: '2rem' }}>
            History
          </Box>
        )}
      </Box>
      <Box className="editor">
        <IdeaDataEditor data={data} changer={changer} created={created} close={close} closeTrigger={closeTrigger} />
      </Box>
      <Box className="ucards-and-stats">
        {created && (
          <>
            <Box className="ucards">
              <UCards onClick={(e) => e.stopPropagation()}>
                <Typography sx={{ fontWeight: 'bold' }}>Flashcards</Typography>
                <Stack spacing={1.5}>
                  {changer.ucardInfos().map(({ id, preview, priority, frozen }) => (
                    <RStack key={id} justifyContent="start">
                      <UCardPreview>{cut(preview, 10)}</UCardPreview>
                      <FormControl>
                        <InputLabel id={`priority-${id}`}>Priority</InputLabel>
                        <USelect
                          size="small"
                          value={priority}
                          onChange={(v) => changer.changePriority(id, v.target.value as UCardPriority)}
                          label="Priority"
                          labelId={`priority-${id}`}
                          sx={{ width: '7.25rem', marginRight: '0.5rem' }}
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </USelect>
                      </FormControl>
                      <IBtn
                        onClick={() => changer.toggleFreeze(id)}
                        icon={AcUnitRoundedIcon}
                        color={frozen ? 'info' : 'default'}
                        size="small"
                      />
                    </RStack>
                  ))}
                </Stack>
              </UCards>
            </Box>
            <Box className="stats">
              <Box onClick={(e) => e.stopPropagation()} sx={{ backgroundColor: 'red', height: '2rem' }}>
                Stats
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Grid>
  )
}

const Grid = styled(Box, { label: 'IdeaEditor' })(({ theme }) => ({
  minHeight: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 32rem)',
  gridTemplateRows: 'auto auto auto', // % leads to weird overflow
  gap: '1rem',
  justifyContent: 'center',
  alignContent: 'center',
  padding: '1rem',
  overflowX: 'hidden',

  '.editor': { minHeight: '32rem' }, // minHeight 32rem instead of minHeight: 90, because if grid is in parent with height 100% it doesn't work
  '.history': { gridRow: '3 / 4' },

  '.ucards-and-stats': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1rem',
  },

  [`${theme.breakpoints.up('md')}`]: {
    gridTemplateColumns: '35% 45%',
    gridTemplateRows: '60vh 20vh', // % leads to weird overflow
    padding: 0,

    '.history': {
      gridColumn: '1 / 2',
      gridRow: '2 / 3',
      overflow: 'auto',
    },

    '.editor': {
      height: 'auto',
      gridColumn: '2 / 3',
      gridRow: '1 / 3',
    },

    '.ucards-and-stats': {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
      overflow: 'auto',
      justifyContent: 'start',

      '.ucards, .stats': {
        maxHeight: '50%',
        overflow: 'auto',
      },
    },
  },

  [`${theme.breakpoints.up('lg')}`]: {
    gridTemplateColumns: '25% 35% minmax(315px, 25%)',
    gridTemplateRows: '80vh', // % leads to weird overflow

    '.history': {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
    },

    '.editor': {
      gridColumn: '2 / 3',
      gridRow: '1 / 1',
    },

    '.ucards-and-stats': {
      gridColumn: '3 / 4',
      gridRow: '1 / 1',
      justifyContent: 'center',
    },
  },
}))

// function TestGrid() { // use for test in Sandbox.stories
//   const fill = false
//   return (
//     <Box sx={{ width: '100%', height: '100%' }}>
//       <Grid>
//         <Box className="history" onClick={(e) => e.stopPropagation()}>
//           <Box sx={{ backgroundColor: 'blue', minHeight: '2rem' }}>
//             History
//             {fill && gen(12, (i) => <div style={{ height: '5rem' }}>{i}</div>)}
//           </Box>
//         </Box>
//         <Box className="editor" onClick={(e) => e.stopPropagation()}>
//           <Box sx={{ backgroundColor: 'yellow', height: '100%' }}>Editor</Box>
//         </Box>
//         <Box className="ucards-and-stats" onClick={(e) => e.stopPropagation()}>
//           <Box className="ucards">
//             <Box sx={{ backgroundColor: 'green', minHeight: '2rem' }}>
//               Cards
//               {fill && gen(12, (i) => <div style={{ height: '5rem' }}>{i}</div>)}
//             </Box>
//           </Box>
//           <Box className="stats">
//             <Box sx={{ backgroundColor: 'red', minHeight: '2rem' }}>
//               Stats
//               {fill && gen(12, (i) => <div style={{ height: '5rem' }}>{i}</div>)}
//             </Box>
//           </Box>
//         </Box>
//       </Grid>
//     </Box>
//   )
// }

const UCards = styled(Box, { label: 'UCards' })(({ theme }) => ({
  padding: '1rem',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}))

const UCardPreview = styled(Typography)({
  marginRight: 'auto',
  cursor: 'pointer',
  textUnderlineOffset: '0.25rem',

  ':hover': {
    textDecoration: 'underline',
  },
})

interface IdeaDataEditor {
  data: IdeaData
  changer: IdeaState
  close: Fn
  created: bool
  closeTrigger: num
}

function IdeaDataEditor({ data, changer, close, created, closeTrigger }: IdeaDataEditor) {
  const [type, setType] = useState<IdeaType>(data.type || 'question')
  const [showError, setShowError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const isSM = useIsSM()

  const onClose = () => {
    if (changer.hasUnsavedChanges()) setModalOpen(true)
    else close()
  }

  useEffect(() => {
    if (closeTrigger) onClose()
  }, [closeTrigger])

  const blockIcons = uformBlocks()
  const hasUFormBlock = data.ublocks.find((b) => isUFormBlock(b.type))
  /* TODO: on edit show text "Edit ${type}", add options btn (remove, moveTo) */
  return (
    <EditorWrapper onClick={(e) => e.stopPropagation()}>
      <CloseBtnWrapper>
        <IBtn icon={CloseRoundedIcon} size={isSM ? 'medium' : 'small'} onClick={onClose} />
      </CloseBtnWrapper>
      <EditorHeader justifyContent="space-between" sx={{ marginBottom: '1rem' }}>
        <Typography sx={{ fontWeight: 'bold' }}>{created ? 'Edit idea' : 'Create new'}</Typography>
        <USelect
          size="small"
          value={type}
          onChange={(v) => setType(v.target.value as IdeaType)}
          sx={{ width: '8rem' }}
          disabled={created}
          label="Create new"
        >
          <MenuItem value="question">Question</MenuItem>
          <MenuItem value="error">Error</MenuItem>
        </USelect>
      </EditorHeader>
      <ClickAwayListener onClickAway={changer.unselect}>
        <EditorBody>
          <UBlocksSet id="r" blocks={data.ublocks} factoryPlaceholder="Write / for commands" />
          {!hasUFormBlock && (
            <UFormBlocksRow>
              {blockIcons.map(({ type, icon }) => (
                <IBtn key={type} icon={icon} onClick={() => changer.add(data.ublocks.at(-1)?.id || '', type)} />
              ))}
            </UFormBlocksRow>
          )}
        </EditorBody>
      </ClickAwayListener>
      <FAB
        color={data.$error ? 'error' : 'primary'}
        aria-label="add"
        size={isSM ? 'medium' : 'small'}
        onClick={() => {
          setShowError(!changer.save())
        }}
      >
        <SaveI />
      </FAB>
      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {data.$error}
        </Alert>
      </Snackbar>
      <Modal open={modalOpen} hideBackdrop>
        <UnsavedAlert severity="warning">
          <AlertTitle>Unsaved changes!</AlertTitle>
          Do you want to discard unsaved changes?
          <RStack spacing={1} justifyContent="end">
            <Button onClick={() => setModalOpen(false)} size="small">
              Cancel
            </Button>
            <Button onClick={all(() => setModalOpen(false), close)} variant="contained" color="warning" size="small">
              Discard
            </Button>
          </RStack>
        </UnsavedAlert>
      </Modal>
    </EditorWrapper>
  )
}

const pdRightSM = '2.75rem' // so big to give space for UBlock small buttons
const pdRight = '1.5rem'
const pd = `1rem ${pdRight}`
const pdSM = `1.5rem ${pdRightSM}`
const EditorWrapper = styled(Box, { label: 'IdeaDataEditor' })(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}))

const EditorHeader = styled(RStack)(({ theme }) => ({
  padding: pd,
  paddingBottom: 0,

  [`${theme.breakpoints.up('sm')}`]: {
    padding: pdSM,
    paddingBottom: 0,
  },
}))

const EditorBody = styled(Box)(({ theme }) => ({
  padding: pd,
  paddingTop: 0,
  overflowY: 'auto',
  maxHeight: '85%',
  width: '100%',

  [`${theme.breakpoints.up('sm')}`]: {
    padding: pdSM,
    paddingTop: 0,
  },
}))

const UFormBlocksRow = styled(RStack)(({ theme }) => ({
  marginTop: '1rem',
  backgroundColor: theme.apm('100'),
  borderRadius: theme.shape.borderRadius,
}))

const CloseBtnWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: '-0.75rem',
  top: '-0.75rem',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
}))

const UnsavedAlert = styled(Alert)({
  maxWidth: '20rem',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  outline: 'none',
})

const FAB = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  right: '1rem',
  bottom: '1rem',

  [`${theme.breakpoints.up('sm')}`]: { right: '1.5rem', bottom: '1.5rem' },
}))

const SaveI = styled(SaveRoundedIcon)(({ theme }) => ({
  [`${theme.breakpoints.up('sm')}`]: {
    width: 32,
    height: 32,
  },
}))
