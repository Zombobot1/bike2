import { useReactiveObject } from '../../../utils/hooks/hooks'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import { imageFromSrc, srcfy } from '../../../../utils/filesManipulation'
import { UBlockImplementation } from '../../types'
import { useUImageFile } from '../useUFile'
import { alpha, IconButton, styled } from '@mui/material'
import { bool } from '../../../../utils/types'
import { ucast } from '../../../../utils/utils'
import { useEffect, useState } from 'react'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { Drop1zone } from '../../../utils/Dropzone/Drop1zone'
import { ResizableWidth } from '../../../utils/ResizableWidth/ResizableWidth'

export function UImageFile({ data, setData, readonly }: UBlockImplementation) {
  const [imageData, setImageData] = useReactiveObject(ucast(data, new UMediaFileDTO()))
  const [newSrc, setNewSrc] = useState('') // user can change width before image is uploaded
  const props = useUImageFile(setNewSrc, (f) => {
    setImageData(() => ({ width: 900, src: srcfy(f) }))
  })

  useEffect(() => {
    if (imageData.isNew) imageFromSrc(imageData.src).then((i) => props.uploadFile(i))
  }, [imageData.isNew]) // image can be created inside UText

  useEffect(() => {
    if (newSrc && newSrc !== imageData.src) {
      setData(JSON.stringify({ width: imageData.width, src: newSrc }))
      setNewSrc('')
    }
  }, [newSrc])

  if (!imageData.src) return <Drop1zone {...props} label="image" icon={<ImageRoundedIcon />} />

  return (
    <ResizableWidth
      readonly={readonly}
      width={imageData.width}
      updateWidth={(w) => setData(JSON.stringify({ ...imageData, width: w }))}
      maxWidth={900}
    >
      <Img src={imageData.src} data-cy="img" />
      {!readonly && (
        <Delete size="small" onClick={props.deleteFile}>
          <DeleteRoundedIcon />
        </Delete>
      )}
    </ResizableWidth>
  )
}

const Img = styled('img')(({ theme }) => ({
  display: 'block',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
}))

const Delete = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: '1rem',
  top: '1rem',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  backgroundColor: alpha(theme.palette.grey[800], 0.6),
  color: theme.palette.grey[400],

  ':hover': {
    color: 'white',
    backgroundColor: alpha(theme.palette.grey[800], 0.6),
  },
}))

export class UMediaFileDTO {
  src = ''
  width = 900
  isNew?: bool
}
