import { alpha, ClickAwayListener, styled } from '@material-ui/core'
import { useState, KeyboardEvent, useEffect } from 'react'
import { useEventListener } from '../../../utils/hooks/use-event-listener'
import { srcfy, useImageFromClipboard } from '../../../../utils/filesManipulation'
import ImageRoundedIcon from '@material-ui/icons/ImageRounded'
import { fileToStr, PassiveData } from './types'
import { blue } from '@material-ui/core/colors'
import { Dropzone1, use1Drop } from '../../../utils/Dropzone'
import { useEffectedState } from '../../../../utils/hooks-utils'

export function UImageField({ data, canBeEdited, name, setNewValue, newValue }: PassiveData) {
  const { clipBoardImageSrc, clipBoardImage, retrieveImage } = useImageFromClipboard(name)

  const [src, setSrc] = useEffectedState(data || newValue)

  const fileS = use1Drop((f) => {
    setSrc(srcfy(f))
    setNewValue(f)
  })

  const [isEditing, setIsEditing] = useState(false)
  const awaitsData = canBeEdited && isEditing

  const handlePasteImage = () => navigator.clipboard.read().then(retrieveImage).catch(console.error)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Escape') finishEditing()
    else if (e.ctrlKey && e.key === 'v' && awaitsData) handlePasteImage()
    else if (e.key === 'Delete' && awaitsData) {
      setSrc('')
      setNewValue('')
    }
  }

  const ref = useEventListener('keydown', handleKeyDown, awaitsData)

  const startEditing = () => setIsEditing(true)
  const finishEditing = () => setIsEditing(false)

  useEffect(() => {
    if (clipBoardImageSrc) setSrc(clipBoardImageSrc)
    if (clipBoardImage) setNewValue(clipBoardImage)
  }, [clipBoardImageSrc, clipBoardImage])

  if (src)
    return (
      <ClickAwayListener onClickAway={finishEditing}>
        <UImage ref={ref} tabIndex={3000} onClick={startEditing}>
          <img src={fileToStr(src)} />
          {awaitsData && <Selection />}
        </UImage>
      </ClickAwayListener>
    )

  return <Dropzone1 fileS={fileS} label={name} icon={<ImageRoundedIcon />} onPaste={handlePasteImage} />
}

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
