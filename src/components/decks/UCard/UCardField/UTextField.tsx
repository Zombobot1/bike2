import { styled, TextField, Typography } from '@material-ui/core'
import { useState, KeyboardEvent } from 'react'
import { useEffectedState } from '../../../../utils/hooks-utils'
import { fileToStr, PassiveData } from './types'

export function UTextField({ data, canBeEdited, name, setNewValue, newValue, error }: PassiveData) {
  const [text, setText] = useEffectedState(data || fileToStr(newValue))
  const [newData, setNewData] = useState(data || '')
  const [isEditing, setIsEditing] = useState(false)

  const finishEditing = () => {
    if (text !== newData) setNewValue(newData)
    setText(newData)
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Escape') finishEditing()
  }

  if (text && (!canBeEdited || !isEditing))
    return (
      <UText sx={{ textAlign: text.length < 90 ? 'center' : 'left' }} onClick={() => setIsEditing(true)}>
        {text}
      </UText>
    )

  return (
    <TextField
      variant="standard"
      placeholder={`Add ${name}`}
      multiline
      autoFocus={Boolean(text)}
      defaultValue={text}
      onChange={(e) => setNewData(e.target.value)}
      onBlur={finishEditing}
      onKeyDown={handleKeyDown}
      fullWidth
      helperText={error}
      error={Boolean(error)}
    />
  )
}

const UText = styled(Typography)(({ theme }) => ({
  fontSize: 26,
  overflowY: 'hidden',
  overflowX: 'hidden',
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
  marginBottom: 0,
  lineHeight: 1.12,
  flex: '0 0 auto',

  [`${theme.breakpoints.up('sm')}`]: {
    fontSize: 32,
  },
}))
