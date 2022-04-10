import { Box, Button, Chip, Stack, styled } from '@mui/material'
import { bool, Fn, num, str } from '../../../utils/types'
import { UBlockContent } from '../types'
import { EditableText } from '../../utils/EditableText/EditableText'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { Hr, IBtn, RStack } from '../../utils/MuiUtils'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { useState } from 'react'
import { useIsSM } from '../../utils/hooks/hooks'
import { UFormData } from '../UPage/ublockTypes'
import { deriveUFromError, UPageUFormEvent } from '../UPage/UPageState/crdtParser/UPageRuntimeTree'
import { UBlocksSet } from '../UPage/UBlockSet/UBlockSet'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'

// tests have an intermediate state: waiting for feedback if there are some manually assessable questions ->
// student is transferred to a page where teacher can leave feedback
// exercises & tests can be redone when feedback was provided, all feedback errors are automatically turned into cards and placed in individual decks
export interface UForm extends UBlockContent {
  handleUFormEvent: (uformId: str, e: UPageUFormEvent) => void
}

export function UForm({ data: d, setData, readonly, id, handleUFormEvent }: UForm) {
  const data = d as UFormData
  const [lastClickedOn, setLastClickedOn] = useState<'top' | 'bottom'>('bottom')

  const { name, ublocks, $state: state, $score: score } = data
  const error = deriveUFromError(ublocks)
  const editing = state === 'editing'
  const submitted = score !== undefined && score > -1 ? true : false

  const showTopChip = lastClickedOn === 'top' && error
  const showBottomChip = lastClickedOn === 'bottom' && !!error

  const isSM = useIsSM()

  return (
    <TopStack>
      <RStack justifyContent="space-between">
        <EditableText
          text={name}
          setText={(name) => setData(id, { name })}
          tag="h3"
          focusIfEmpty={true}
          placeholder="Untitled"
        />
        <RStack spacing={1}>
          {showTopChip && <Chip size="small" color="error" label={error} />}
          {!readonly && (
            <IBtn
              icon={editing ? RemoveRedEyeRoundedIcon : CreateRoundedIcon}
              onClick={() => {
                handleUFormEvent(id, 'toggle-edit')
                setLastClickedOn('top')
              }}
              color={!error ? 'default' : 'error'}
              data-cy={editing ? 'view' : 'edit'}
            />
          )}
        </RStack>
      </RStack>
      <Hr sx={{ marginTop: isSM ? '0.5rem' : 0, marginBottom: '1rem' }} />
      <UBlocksSet
        id={id}
        blocks={ublocks}
        readonly={readonly || !editing}
        factoryPlaceholder="Type /checks or /input etc."
      />
      <Bottom
        isEditing={editing}
        showError={showBottomChip}
        wasSubmitted={submitted}
        validationError={error}
        score={score}
        save={() => {
          handleUFormEvent(id, 'toggle-edit')
          setLastClickedOn('bottom')
        }}
        retry={() => handleUFormEvent(id, 'retry')}
        submit={() => {
          handleUFormEvent(id, 'submit')
          setLastClickedOn('bottom')
        }}
      />
    </TopStack>
  )
}

const TopStack = styled(Stack, { label: 'UForm' })({})

interface Bottom_ {
  isEditing: bool
  showError: bool
  wasSubmitted: bool
  score?: num
  validationError: str
  retry: Fn
  submit: Fn
  save: Fn
}

function Bottom({ isEditing, showError, score, validationError, wasSubmitted, retry, submit, save }: Bottom_) {
  const color = validationError ? 'error' : undefined
  const gridSx = (validationError && showError) || wasSubmitted ? { gridTemplateColumns: '1fr auto 1fr' } : {}
  const isSM = useIsSM()
  const size = isSM ? 'large' : 'medium'
  return (
    <>
      {isEditing && (
        <BottomGrid sx={gridSx}>
          {showError && <CenteredChip size="small" color="error" label={validationError} />}
          <SubmitBtn size={size} color={color} endIcon={<SaveRoundedIcon />} onClick={save} data-cy="save">
            Save
          </SubmitBtn>
        </BottomGrid>
      )}
      {!isEditing && (
        <>
          <Hr sx={{ marginBottom: '0.5rem' }} />
          <BottomGrid sx={gridSx}>
            {!wasSubmitted && (
              <>
                {showError && <CenteredChip size="small" color="error" label={validationError} />}
                <SubmitBtn size={size} color={color} endIcon={<SendRoundedIcon />} onClick={submit} data-cy="submit">
                  Submit
                </SubmitBtn>
              </>
            )}
            {wasSubmitted && (
              <>
                <CenteredChip
                  color="info"
                  variant="filled"
                  label={`Score: ${score}%`}
                  sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                />
                <RetryBtn size={size} endIcon={<ReplayRoundedIcon />} onClick={retry} data-cy="retry">
                  Retry
                </RetryBtn>
              </>
            )}
          </BottomGrid>
        </>
      )}
    </>
  )
}

const SubmitBtn = styled(Button)({
  marginLeft: 'auto',
  '.MuiButton-endIcon': {
    transform: 'translateY(-1px)',
  },
})

const CenteredChip = styled(Chip)({
  gridColumnStart: 2,
  placeSelf: 'center',
})

const BottomGrid = styled(Box)({
  display: 'grid',
  justifyContent: 'right',
})

const RetryBtn = styled(Button)({
  marginLeft: 'auto',
  '.MuiButton-endIcon': {
    transform: 'translateX(-3px)',
  },
})
