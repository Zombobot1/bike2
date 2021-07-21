import { FieldDTO, FieldType } from '../../../study/training/types'
import { UInput } from '../../../uform/ufields/uinput'
import { useInteractiveSubmit } from '../../../study/training/hooks'
import { alpha, Button, ClickAwayListener, Stack, styled, TextField, Typography } from '@material-ui/core'
import { UChecks } from '../../../uform/ufields/uchecks'
import { Player as UAudioField } from './Player'
import { useState, KeyboardEvent, useEffect } from 'react'
import { blue } from '@material-ui/core/colors'
import { useEventListener } from '../../../utils/hooks/use-event-listener'
import { useImageFromClipboard } from '../../../../utils/filesManipulation'
import ImageRoundedIcon from '@material-ui/icons/ImageRounded'
import { PassiveData } from './types'

export interface UCardField extends Omit<FieldDTO, 'status'> {
  isMediaActive: boolean
  isCurrent: boolean // if we render all interactive fields it would be impossible to submit one card
  canBeEdited: boolean
}

export const UCardField = ({
  _id,
  name,
  passiveData,
  interactiveData,
  type,
  isMediaActive,
  isCurrent,
  canBeEdited,
}: UCardField) => {
  const { interactiveSubmit } = useInteractiveSubmit()

  if (passiveData || canBeEdited)
    return (
      <PassiveField
        name={name}
        type={type}
        data={passiveData}
        canBeEdited={canBeEdited}
        isMediaActive={isMediaActive}
      />
    )

  if (interactiveData && isCurrent) {
    return (
      <>
        {type === 'RADIO' && <UChecks _id={_id} {...interactiveData} onAnswer={interactiveSubmit} />}
        {type === 'INPUT' && <UInput _id={_id} {...interactiveData} onAnswer={interactiveSubmit} />}
      </>
    )
  }
  return null
}

interface PassiveField extends PassiveData {
  type: FieldType
  isMediaActive: boolean
}

function PassiveField({ type, name, canBeEdited, data, isMediaActive }: PassiveField) {
  return (
    <>
      {type === 'PRE' && <UTextField canBeEdited={canBeEdited} data={data} name={name} />}
      {type === 'IMG' && <UImageField canBeEdited={canBeEdited} data={data} name={name} />}
      {type === 'AUDIO' && <UAudioField canBeEdited={canBeEdited} data={data} name={name} autoplay={isMediaActive} />}
    </>
  )
}

function UTextField({ data, canBeEdited, name }: PassiveData) {
  const [text, setText] = useState(data)
  const [newData, setNewData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)

  const finishEditing = () => {
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
      autoFocus
      defaultValue={text}
      onChange={(e) => setNewData(e.target.value)}
      onBlur={finishEditing}
      onKeyDown={handleKeyDown}
      fullWidth
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

function UImageField({ data, canBeEdited, name }: PassiveData) {
  const { clipBoardImageSrc, retrieveImage } = useImageFromClipboard()

  const [src, setSrc] = useState(data)
  const [isEditing, setIsEditing] = useState(false)
  const awaitsData = canBeEdited && isEditing

  const handlePasteImage = () => navigator.clipboard.read().then(retrieveImage).catch(console.error)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Escape') finishEditing()
    else if (e.ctrlKey && e.key === 'v' && awaitsData) handlePasteImage()
    else if (e.key === 'Delete' && awaitsData) setSrc('')
  }

  const ref = useEventListener('keydown', handleKeyDown, awaitsData)

  const startEditing = () => setIsEditing(true)
  const finishEditing = () => setIsEditing(false)

  useEffect(() => {
    if (clipBoardImageSrc) setSrc(clipBoardImageSrc)
  }, [clipBoardImageSrc])

  if (src)
    return (
      <ClickAwayListener onClickAway={finishEditing}>
        <UImage ref={ref} tabIndex={3000} onClick={startEditing}>
          <img src={src} />
          {awaitsData && <Selection />}
        </UImage>
      </ClickAwayListener>
    )

  return (
    <EmptyUImage justifyContent="center" alignItems="center" ref={ref}>
      <Button startIcon={<ImageRoundedIcon />} onClick={handlePasteImage}>{`Paste ${name}`}</Button>
    </EmptyUImage>
  )
}

const EmptyUImage = styled(Stack)(({ theme }) => ({
  height: '230px',
  borderRadius: 5,

  border: `0.5px solid ${theme.palette.grey['200']}`,

  '& .MuiButton-root': {
    color: theme.palette.grey['500'],
  },

  [`${theme.breakpoints.up('sm')}`]: {
    height: '275px',
  },
}))

const Selection = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: `${alpha(blue[400], 0.4)}`,
})

const UImage = styled('div')(({ theme }) => ({
  height: '230px',
  borderRadius: 5,
  position: 'relative',
  overflow: 'hidden',

  '& img': {
    position: 'absolute',
    width: '100%',
    top: '50%',
    left: '50%',
    transform: 'translate( -50%, -50%)',
  },

  [`${theme.breakpoints.up('sm')}`]: {
    height: '275px',
  },
}))
