import { Button, Chip, Stack, styled } from '@mui/material'
import { str, strs } from '../../utils/types'
import { cast } from '../../utils/utils'
import { UBlockComponent } from '../editing/types'
import { UBlocksSet } from '../editing/UPage/UBlocksSet/UBlocksSet'
import { EditableText } from '../utils/EditableText/EditableText'
import { useReactive, useToggle } from '../utils/hooks/hooks'
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
export function UForm({ data, setData, readonly }: UBlockComponent) {
  const { ids, name } = cast<UFormDataDTO>(data, { ids: [], name: '' })
  const rename = (name: str) => setData(JSON.stringify({ ids, name }))
  const setIds = (ids: strs) => setData(JSON.stringify({ name, ids }))

  const [score, setScore] = useState(0)
  const [isEditing, toggleIsEditing, setIsEditing] = useToggle(name.length === 0)
  const { submit, retry, wasSubmitted, validateNew, error: formError } = useUForm(isEditing)
  const [error, setError] = useReactive(formError)

  const onPenClick = () => {
    const error = validateNew()
    if (isEditing) setIsEditing(!!error)
    else toggleIsEditing()
    setError(error)
  }

  return (
    <Stack>
      <RStack justifyContent="space-between">
        <EditableText text={name} setText={rename} tag="h4" focusIfEmpty={true} placeholder="Untitled" />
        <RStack spacing={1}>
          {error && <Chip size="small" color="error" label={error} />}
          {!readonly && (
            <IBtn
              icon={isEditing ? RemoveRedEyeRoundedIcon : CreateRoundedIcon}
              onClick={onPenClick}
              color={!error ? 'default' : 'error'}
              data-cy={isEditing ? 'view' : 'edit'}
            />
          )}
        </RStack>
      </RStack>
      <Hr sx={{ marginTop: '0.5rem', marginBottom: '1rem' }} />
      <UBlocksSet ids={ids} setIds={setIds} factoryPlaceholder="Type /checks or /input etc." readonly={!isEditing} />
      {!isEditing && (
        <>
          {!error && <Hr sx={{ marginBottom: '0.5rem' }} />}
          {!error && !wasSubmitted && (
            <Btn size="large" endIcon={<SendRoundedIcon />} onClick={() => submit(setScore)} data-cy="submit">
              Submit
            </Btn>
          )}
          {wasSubmitted && (
            <RStack justifyContent="space-between">
              <Btn2 size="large" endIcon={<ReplayRoundedIcon />} sx={{ opacity: 0 }}>
                Retry
              </Btn2>
              <Chip
                color="info"
                variant="filled"
                label={`Score: ${score}%`}
                sx={{ fontWeight: 'bold', fontSize: '1rem' }}
              />
              <Btn2 size="large" endIcon={<ReplayRoundedIcon />} onClick={retry} data-cy="retry">
                Retry
              </Btn2>
            </RStack>
          )}
        </>
      )}
    </Stack>
  )
}

const Btn = styled(Button)({
  alignSelf: 'flex-end',
  '.MuiButton-endIcon': {
    transform: 'translateY(-1px)',
  },
})

const Btn2 = styled(Button)({
  '.MuiButton-endIcon': {
    transform: 'translateX(-3px)',
  },
})
