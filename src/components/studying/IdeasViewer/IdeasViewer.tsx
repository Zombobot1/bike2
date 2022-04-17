import { Modal, Box, styled, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { TrainingIdAndDTO } from '../../../fb/FSSchema'
import { bool, Fn, str, strs } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { uuid } from '../../../utils/wrappers/uuid'

import { EditableText } from '../../utils/EditableText/EditableText'
import { Fetch } from '../../utils/Fetch/Fetch'
import { IBtn, Hr, RStack } from '../../utils/MuiUtils'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

import { workspace } from '../../application/Workspace/WorkspaceState'
import { UAutocomplete } from '../../utils/UAutocomplete/UAutocomplete'
import { useCollectionData } from '../../../fb/useData'
import { q } from '../../../fb/q'
import { getUserId } from '../../editing/UPage/userId'
import { IdeaEditor } from './IdeaEditor/IdeaEditor'

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
  const [ideaId, setIdeaId] = useState('')

  return (
    <IdeasViewer_>
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
          onClick={() => setIdeaId(uuid())}
          sx={{ marginLeft: 'auto' }}
          data-cy="new-idea"
        />
      </RStack>
      <Hr sx={{ marginBottom: '0.5rem' }} />
      <Fetch>
        <Trainings upageId={selectedUPageId} pagesTree={pagesIn} />
      </Fetch>
      <EditorModal isEditorOpen={!!ideaId} close={() => setIdeaId('')} upageId={selectedUPageId} ideaId={ideaId} />
    </IdeasViewer_>
  )
}

const IdeasViewer_ = styled(Box)({
  width: '100%',
  maxWidth: 900,
})

interface EditorPs {
  ideaId: str
  training?: TrainingIdAndDTO
  isEditorOpen: bool
  close: Fn
  upageId: str
}

function EditorModal({ ideaId, training, upageId, isEditorOpen, close }: EditorPs) {
  return (
    <Modal open={isEditorOpen}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <IdeaEditor id={ideaId} training={training} upageId={upageId} close={close} />
      </Box>
    </Modal>
  )
}

interface Trainings {
  upageId: str
  pagesTree: strs
}

function Trainings({ pagesTree, upageId }: Trainings) {
  const trainings = useCollectionData(q('trainings').where('userId', '==', getUserId()).orderBy('createdAt', 'desc'))
  const trainingsForPage = trainings.filter((t) => pagesTree.includes(t.upageId))
  // TODO: handle empty case
  return (
    <Stack spacing={1}>
      {trainingsForPage.map((dto) => (
        <TrainingItem key={dto.ideaId} dto={dto} upageId={upageId} />
      ))}
    </Stack>
  )
}

interface TrainingItem {
  upageId: str
  dto: TrainingIdAndDTO
}

function TrainingItem({ dto, upageId }: TrainingItem) {
  const [open, setIsOpen] = useState(false)
  return (
    <TrainingItem_ onClick={() => setIsOpen(true)}>
      <Typography sx={{ marginRight: 'auto' }}>{dto.preview}</Typography>
      <EditorModal
        isEditorOpen={open}
        close={() => setIsOpen(false)}
        ideaId={dto.ideaId}
        upageId={upageId}
        training={dto}
      />
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
