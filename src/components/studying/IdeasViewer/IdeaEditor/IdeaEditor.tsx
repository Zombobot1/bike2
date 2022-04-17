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
import { useState } from 'react'
import { TrainingIdAndDTO, UCardPriority } from '../../../../fb/FSSchema'
import { str, bool, Fn } from '../../../../utils/types'
import { all } from '../../../../utils/utils'
import { uformBlocks } from '../../../editing/UPage/UBlock/BlockAutocomplete/BlockAutocompleteOptions'
import { UBlocksSet } from '../../../editing/UPage/UBlockSet/UBlockSet'
import { isUFormBlock } from '../../../editing/UPage/ublockTypes'
import { useIsSM } from '../../../utils/hooks/hooks'
import { RStack, USelect, IBtn } from '../../../utils/MuiUtils'
import { IdeaState, useIdeaState } from '../../IdeaState'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded'
import { IdeaData, IdeaType } from '../../types'
import { chop } from '../../utils'

export interface IdeaEditor {
  upageId: str
  id: str
  close: Fn
  training?: TrainingIdAndDTO
}

type UCardInfo = { id: str; preview: str; priority: UCardPriority; frozen?: bool }
type UCardInfos = UCardInfo[]
function ucardInfo(preview: (id: str) => str, training: TrainingIdAndDTO, id: str): UCardInfo {
  const indicators = training.idAndIndicators[id]
  return { id, preview: preview(id), priority: indicators.priority, frozen: indicators.frozen }
}

export function IdeaEditor({ id, upageId, training, close }: IdeaEditor) {
  const { data, changer } = useIdeaState(id, upageId, training)
  const created = !!training

  const ucards = [] as UCardInfos
  if (training) {
    if (data.ucards) data.ucards.forEach((c) => ucards.push(ucardInfo(changer.preview, training, c.id)))
    else ucards.push(ucardInfo(changer.preview, training, 'r'))
  }

  return (
    <Grid onClick={(e) => e.stopPropagation()}>
      <Box className="history">{created && <Box sx={{ backgroundColor: 'blue', height: '2rem' }}>History</Box>}</Box>
      <Box className="editor">
        <IdeaDataEditor data={data} changer={changer} created={created} close={close} />
      </Box>
      <Box className="ucards-and-stats">
        {created && (
          <>
            <Box className="ucards">
              <UCards>
                <Typography sx={{ fontWeight: 'bold' }}>Flashcards</Typography>
                <Stack spacing={1}>
                  {ucards.map(({ id, preview, priority, frozen }) => (
                    <RStack key={id} justifyContent="start">
                      <Typography sx={{ marginRight: 'auto' }}>{chop(preview, 10)}</Typography>
                      <IBtn icon={VisibilityRoundedIcon} size="small" sx={{ marginRight: '0.5rem' }} />
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
              <Box sx={{ backgroundColor: 'red', height: '2rem' }}>Stats</Box>
            </Box>
          </>
        )}
      </Box>
    </Grid>
  )
}

const UCards = styled(Box, { label: 'UCards' })(({ theme }) => ({
  padding: '1rem',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}))

const Grid = styled(Box, { label: 'IdeaEditor' })(({ theme }) => ({
  minHeight: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  overflowX: 'hidden',

  '.history': { order: 4 },
  '.editor': { order: 1, height: '32rem' }, // height 32rem instead of minHeight: 90, because if grid is in parent with height 100% it doesn't work
  '.ucards-and-stats': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1rem',
    order: 3,
  },

  [`${theme.breakpoints.up('md')}`]: {
    display: 'grid',
    gridTemplateColumns: '25% 35% 25%',
    gridTemplateRows: '80%',
    gridGap: '1rem',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 0,

    '.history': {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
      overflow: 'auto',
    },

    '.editor': {
      height: 'auto',
      gridColumn: '2 / 3',
    },

    '.ucards-and-stats': {
      gridColumn: '3 / 4',
      overflow: 'auto',

      '.ucards, .stats': {
        maxHeight: '50%',
        overflow: 'auto',
      },
    },
  },
}))

interface IdeaDataEditor {
  data: IdeaData
  changer: IdeaState
  close: Fn
  created: bool
}

function IdeaDataEditor({ data, changer, close, created }: IdeaDataEditor) {
  const [type, setType] = useState<IdeaType>(data.type || 'question')
  const [showError, setShowError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const isSM = useIsSM()

  const blockIcons = uformBlocks()
  const hasUFormBlock = data.ublocks.find((b) => isUFormBlock(b.type))
  /* TODO: on edit show text "Edit ${type}", add options btn (remove, moveTo) */
  return (
    <EditorWrapper>
      <CloseBtnWrapper>
        <IBtn
          icon={CloseRoundedIcon}
          size={isSM ? 'medium' : 'small'}
          onClick={() => {
            if (changer.hasUnsavedChanges()) setModalOpen(true)
            else close()
          }}
        />
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
  right: '-1.15rem',
  top: '-1.15rem',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,

  [`${theme.breakpoints.up('sm')}`]: {
    right: '-1rem',
    top: '-1rem',
  },
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
