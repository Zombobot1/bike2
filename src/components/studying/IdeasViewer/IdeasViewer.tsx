import { Modal, ClickAwayListener, IconButton, Snackbar, Alert, Box, styled, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { TrainingDTO } from '../../../fb/FSSchema'
import { str, bool, Fn, SetStr, strs } from '../../../utils/types'
import { isStr, safe } from '../../../utils/utils'
import { now } from '../../../utils/wrappers/timeUtils'
import { uuid } from '../../../utils/wrappers/uuid'
import { uformBlocks } from '../../editing/UPage/UBlock/BlockAutocomplete/BlockAutocompleteOptions'
import { UBlocksSet } from '../../editing/UPage/UBlockSet/UBlockSet'
import {
  isUFormBlock,
  UBlocks,
  UBlock,
  isUListBlock,
  isStringBasedBlock,
  isAdvancedText,
  InlineExerciseData,
  UChecksData,
} from '../../editing/UPage/ublockTypes'
import { bfsUBlocks } from '../../editing/UPage/UPageState/crdtParser/UPageTree'
import { EditableText } from '../../utils/EditableText/EditableText'
import { Fetch } from '../../utils/Fetch/Fetch'
import { IBtn, Hr, RStack } from '../../utils/MuiUtils'
import { useIdeaState } from '../IdeaState'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { workspace } from '../../application/Workspace/WorkspaceState'
import { UAutocomplete } from '../../utils/UAutocomplete/UAutocomplete'
import { backend, useCollectionData } from '../../../fb/useData'
import { q } from '../../../fb/q'

// TODO: sync preview on editor close
// TODO: sync upageId on editor open (show warning that idea was moved), on idea training

// TODO: every idea has owner - in whose ws it was created, on dto deletion idea is marked as deleted
// TODO: owner ones per month runs clean up and deletes everything that was marked, platform runs cleanups every 6 months end deletes what's left
// TODO: pages unlike ideas don't have owner, it's deduced from ws

// TODO: prevent addition & change of built in ideas

// TODO: delete & move ideas: on press selection starts, viewer has ... menu btn that allows to delete move selected (or all when selection is empty)
// TODO: client side filter by preview, sort by error rate | created data
// TODO: frozen are hidden by def, add btn to show them (frozen - text.secondary) (but hide non frozen)
// TODO: show info (flex end on desktop, as 2nd row on mob): created date (text.2ndary), error rate (if > 10%), stage: borderLeft: 'solid 2px red',

export function IdeasViewer() {
  const [topPaths] = useState(() => workspace.topPaths()) // TODO: update on paths change
  const [selectedUPageI, setSelectedUPageI] = useState(0) // TODO: handle empty workspace
  const selectedUPageId = topPaths[selectedUPageI]?.id || ''
  const pagesIn = workspace.getPagesIn(selectedUPageId)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [idea, setIdea] = useState({ id: '', create: true })

  return (
    <Root>
      <RStack justifyContent="start">
        <EditableText text={'Ideas'} tag="h3" placeholder="Untitled" />
        <Box sx={{ transform: 'translate(1rem, 0.15rem)' }}>
          <UAutocomplete
            placeholder="top page"
            options={topPaths.map((p) => p.name)}
            selected={topPaths[0].name}
            onSelect={(_, i) => {
              setSelectedUPageI(safe(i))
            }}
            width="15rem"
          />
        </Box>
        <IBtn
          icon={AddCircleOutlineRoundedIcon}
          onClick={() => {
            setIdea({ id: uuid(), create: true })
            setIsEditorOpen(true)
          }}
          sx={{ marginLeft: 'auto' }}
          data-cy="new-idea"
        />
      </RStack>
      <Hr sx={{ marginBottom: '0.5rem' }} />
      <Fetch>
        <IdeaDTOs
          pagesTree={pagesIn}
          editDTO={(id) => {
            setIdea({ id, create: false })
            setIsEditorOpen(true)
          }}
        />
      </Fetch>
      <Modal open={isEditorOpen} onClose={() => !idea.create && setIsEditorOpen(false)}>
        <EditorWrapper>
          <IdeaEditor
            id={idea.id}
            upageId={selectedUPageId}
            create={idea.create}
            close={() => setIsEditorOpen(false)}
          />
        </EditorWrapper>
      </Modal>
    </Root>
  )
}

const Root = styled(Box)({
  width: '100%',
  maxWidth: 900,
})

interface IdeaDTOs {
  pagesTree: strs
  editDTO: SetStr
}

function IdeaDTOs({ editDTO, pagesTree }: IdeaDTOs) {
  const trainings = useCollectionData(q('trainings', { combineWithUserId: true }).orderBy('createdAt', 'desc'))
  const trainingsForPage = trainings.filter((t) => pagesTree.includes(t.upageId))
  // TODO: handle empty case
  return (
    <Stack spacing={1}>
      {trainingsForPage.map((dto) => (
        <TrainingItem key={dto.dataId} dto={dto} editDTO={editDTO} />
      ))}
    </Stack>
  )
}

const EditorWrapper = styled(Box)(({ theme }) => ({
  padding: '1.5rem 2.75rem',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '32rem',
  height: '100%',
  maxHeight: '40rem',
  backgroundColor: theme.palette.common.white,
  border: theme.bd(),
  borderRadius: theme.shape.borderRadius,
  outline: 'none',
}))

interface IdeaEditor {
  upageId: str
  id: str
  create?: bool
  close: Fn
}

function IdeaEditor({ id, upageId, create, close }: IdeaEditor) {
  const { data, changer } = useIdeaState(id, upageId, { create, editing: true })

  const [showError, setShowError] = useState(false)

  const blocks = uformBlocks()
  const hasUFormBlock = data.ublocks.find((b) => isUFormBlock(b.type))

  return (
    <>
      <ClickAwayListener onClickAway={changer.unselect}>
        <div>
          <UBlocksSet id="r" blocks={data.ublocks} factoryPlaceholder="Write something" />
        </div>
      </ClickAwayListener>
      {!hasUFormBlock && (
        <RStack>
          {blocks.map(({ type, icon }) => (
            <IBtn key={type} icon={icon} onClick={() => changer.add(data.ublocks.at(-1)?.id || '', type)} />
          ))}
        </RStack>
      )}
      <RStack sx={{ position: 'absolute', left: 0, bottom: 10, width: '100%' }}>
        {create && (
          <IconButton color="error" onClick={close}>
            <CancelRoundedIcon sx={{ width: 32, height: 32 }} />
          </IconButton>
        )}
        <IconButton
          color="success"
          onClick={() => {
            const success = changer.handleUCardEvent('toggle-edit')
            setShowError(!success)
            if (!success) return

            if (create) {
              backend.addData('trainings', uuid(), {
                upageId,
                dataId: id,
                idAndIndicators: {},
                preview: extractPreview(data.ublocks),
                repeatAt: 0,
                createdAt: now(),
              })
            }

            close()
          }}
        >
          {!create && <SaveRoundedIcon sx={{ width: 32, height: 32 }} />}
          {create && <AddCircleRoundedIcon sx={{ width: 32, height: 32 }} />}
        </IconButton>
        <Snackbar
          open={showError}
          autoHideDuration={2000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {data.$error}
          </Alert>
        </Snackbar>
      </RStack>
    </>
  )
}

interface TrainingItem {
  dto: TrainingDTO
  editDTO: (id: str) => void
}

function TrainingItem({ dto, editDTO }: TrainingItem) {
  return (
    <TrainingItem_ onClick={() => editDTO(dto.dataId)}>
      <Typography sx={{ marginRight: 'auto' }}>{dto.preview}</Typography>
    </TrainingItem_>
  )
}

const TrainingItem_ = styled(RStack)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: '0.25rem 0.5rem',

  ':hover': {
    cursor: 'pointer',
    backgroundColor: theme.apm('bg-hover'),
  },
}))

function extractPreview(ublocks: UBlocks, maxLength = 50): str {
  let r = ''
  let i = 0

  while (r.length < maxLength && i < ublocks.length) {
    r += preview(ublocks[i++])
  }

  return r.slice(0, maxLength)
}

function preview(block: UBlock): str {
  if (isUListBlock(block.type))
    return bfsUBlocks([block])
      .slice(1)
      .map((b) => preview(b))
      .join('\n')

  if (isStringBasedBlock(block.type)) return block.data as str
  if (isAdvancedText(block.type)) return (block.data as { text: str }).text
  if (isUFormBlock(block.type)) {
    if (block.type === 'inline-exercise') {
      const data = block.data as InlineExerciseData
      return data.content
        .map((sq) => {
          if (isStr(sq)) return sq

          if (sq.type === 'short-answer') return '__'
          const options = sq.options.join()
          return sq.type === 'single-choice' ? `(${options})` : `[${options}]`
        })
        .flat()
        .join(' ')
    }

    const data = block.data as UChecksData
    return data.question
  }

  return ''
}
