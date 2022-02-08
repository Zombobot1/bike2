import { Box, Button, Chip, Stack, styled } from '@mui/material'
import { bool, Fn, num, str, strs } from '../../utils/types'
import { UBlockImplementation } from '../editing/types'
import { UBlocksSet } from '../editing/UBlockSet/UBlockSet'
import { EditableText } from '../utils/EditableText/EditableText'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { Hr, IBtn, RStack } from '../utils/MuiUtils'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { useUForm } from './useUForm'
import { useState } from 'react'
import { useC, useIsSM } from '../utils/hooks/hooks'
import { useNestedUBlockData } from '../editing/UBlockSet/useNestedUBlockData'

// tests have an intermediate state: waiting for feedback if there are some manually assessable questions ->
// student is transferred to a page where teacher can leave feedback
// exercises & tests can be redone when feedback was provided, all feedback errors are automatically turned into cards and placed in individual decks
export function UForm({ data, setData, readonly, id }: UBlockImplementation) {
  const [uform, setUForm, addedBlocksS] = useNestedUBlockData(data, setData, new UFormDTO())
  const { name, ids } = uform
  const [lastClickedOn, setLastClickedOn] = useState<'top' | 'bottom'>('bottom')

  const rename = useC((name: str) => setUForm((old) => ({ ...old, name })))
  const setIds = useC((f: (old: strs) => strs) => setUForm((old) => ({ ...old, ids: f(old.ids) })))

  const uformPs = useUForm({ isEditing: ids.length === 0 && !readonly, id })
  const { d, score, isEditing, validationError, wasSubmitted } = uformPs

  const showTopChip = lastClickedOn === 'top' && validationError
  const showBottomChip = lastClickedOn === 'bottom' && !!validationError
  const isSM = useIsSM()
  return (
    <Stack>
      <RStack justifyContent="space-between">
        <EditableText text={name} setText={rename} tag="h3" focusIfEmpty={true} placeholder="Untitled" />
        <RStack spacing={1}>
          {showTopChip && <Chip size="small" color="error" label={validationError} />}
          {!readonly && (
            <IBtn
              icon={isEditing ? RemoveRedEyeRoundedIcon : CreateRoundedIcon}
              onClick={() => {
                d({ a: 'toggle-edit' })
                setLastClickedOn('top')
              }}
              color={!validationError ? 'default' : 'error'}
              data-cy={isEditing ? 'view' : 'edit'}
            />
          )}
        </RStack>
      </RStack>
      <Hr sx={{ marginTop: isSM ? '0.5rem' : 0, marginBottom: '1rem' }} />
      <UBlocksSet
        id={id}
        ids={ids}
        setIds={setIds}
        addedBlocks={addedBlocksS[0]}
        setAddedBlocks={addedBlocksS[1]}
        factoryPlaceholder="Type /checks or /input etc."
        uformPs={uformPs}
        readonly={!isEditing || readonly}
      />
      <Bottom
        isEditing={isEditing}
        showError={showBottomChip}
        wasSubmitted={wasSubmitted}
        validationError={validationError}
        score={score}
        save={() => {
          d({ a: 'toggle-edit' })
          setLastClickedOn('bottom')
        }}
        retry={() => d({ a: 'retry' })}
        submit={() => {
          d({ a: 'submit' })
          setLastClickedOn('bottom')
        }}
      />
    </Stack>
  )
}

interface Bottom_ {
  isEditing: bool
  showError: bool
  wasSubmitted: bool
  score: num
  validationError: str
  retry: Fn
  submit: Fn
  save: Fn
}

function Bottom({ isEditing, showError, score, validationError, wasSubmitted, retry, submit, save }: Bottom_) {
  const color = validationError ? 'error' : undefined
  const gridSx = validationError || wasSubmitted ? { gridTemplateColumns: '1fr auto 1fr' } : {}
  const isSM = useIsSM()
  const size = isSM ? 'large' : 'medium'
  return (
    <>
      {isEditing && (
        <BottomGrid sx={gridSx}>
          {showError && <CenteredChip size="small" color="error" label={validationError} />}
          <SubmitBtn size="large" color={color} onClick={save} data-cy="save">
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
