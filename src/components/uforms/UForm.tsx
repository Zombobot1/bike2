import { Box, Button, Chip, Stack, styled } from '@mui/material'
import { str, strs } from '../../utils/types'
import { ucast } from '../../utils/utils'
import { UBlockImplementation } from '../editing/types'
import { UBlocksSet } from '../editing/UPage/UBlockSet/UBlockSet'
import { EditableText } from '../utils/EditableText/EditableText'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { Hr, IBtn, RStack } from '../utils/MuiUtils'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { useUForm } from './useUForm'
import { useState } from 'react'

export interface UFormDataDTO {
  name: str
  ids: strs
}

export interface UFormDTO {
  data: UFormDataDTO
}

// tests have an intermediate state: waiting for feedback if there are some manually assessable questions -> student is transferred to a page where teacher can leave feedback
// exercises & tests can be redone when feedback was provided, all feedback errors are automatically turned into cards and placed in individual decks
export function UForm({ data, setData, readonly, id }: UBlockImplementation) {
  const { ids, name } = ucast<UFormDataDTO>(data, { ids: [], name: '' })
  const [lastClickedOn, setLastClickedOn] = useState<'top' | 'bottom'>('bottom')
  const rename = (name: str) => setData(JSON.stringify({ ids, name }))
  const setIds = (ids: strs) => setData(JSON.stringify({ name, ids }))

  const uformPs = useUForm({ isEditing: ids.length === 0 && !readonly, ids })
  const { d, score, isEditing, validationError, wasSubmitted } = uformPs

  return (
    <Stack>
      <RStack justifyContent="space-between">
        <EditableText text={name} setText={rename} tag="h4" focusIfEmpty={true} placeholder="Untitled" />
        <RStack spacing={1}>
          {lastClickedOn === 'top' && validationError && <Chip size="small" color="error" label={validationError} />}
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
      <Hr sx={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
      <UBlocksSet
        id={id}
        ids={ids}
        setIds={setIds}
        factoryPlaceholder="Type /checks or /input etc."
        readonly={!isEditing}
        uformPs={uformPs}
      />
      {isEditing && (
        <Box sx={{ position: 'relative' }}>
          {lastClickedOn === 'bottom' && validationError && (
            <CenteredChip size="small" color="error" label={validationError} />
          )}
          <SubmitBtn
            size="large"
            color={validationError ? 'error' : undefined}
            onClick={() => {
              d({ a: 'toggle-edit' })
              setLastClickedOn('bottom')
            }}
            data-cy="save"
          >
            Save
          </SubmitBtn>
        </Box>
      )}
      {!isEditing && (
        <>
          <Hr sx={{ marginBottom: '0.5rem' }} />
          <Box sx={{ position: 'relative' }}>
            {!wasSubmitted && (
              <>
                {lastClickedOn === 'bottom' && validationError && (
                  <CenteredChip size="small" color="error" label={validationError} />
                )}
                <SubmitBtn
                  size="large"
                  color={validationError ? 'error' : undefined}
                  endIcon={<SendRoundedIcon />}
                  onClick={() => {
                    d({ a: 'submit' })
                    setLastClickedOn('bottom')
                  }}
                  data-cy="submit"
                >
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
                <RetryBtn
                  size="large"
                  endIcon={<ReplayRoundedIcon />}
                  onClick={() => d({ a: 'retry' })}
                  data-cy="retry"
                >
                  Retry
                </RetryBtn>
              </>
            )}
          </Box>
        </>
      )}
    </Stack>
  )
}

const SubmitBtn = styled(Button)({
  position: 'absolute',
  right: 0,
  top: 0,
  '.MuiButton-endIcon': {
    transform: 'translateY(-1px)',
  },
})

const RetryBtn = styled(Button)({
  position: 'absolute',
  right: 0,
  top: 0,
  '.MuiButton-endIcon': {
    transform: 'translateX(-3px)',
  },
})

const CenteredChip = styled(Chip)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, 35%)',
})
