import { useMount, useReactive } from '../../../utils/hooks/hooks'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import { useUImageFile } from '../useUFile'
import { alpha, Box, IconButton, styled, CircularProgress } from '@mui/material'
import { circularProgressClasses } from '@mui/material/CircularProgress'
import { str } from '../../../../utils/types'
import { useState } from 'react'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { Drop1zone } from '../../../utils/Dropzone/Drop1zone'
import { ResizableWidth } from '../../../utils/ResizableWidth/ResizableWidth'
import { UBlockIdAttribute, UMediaFileData } from '../../UPage/ublockTypes'
import { fileUploader } from '../FileUploader'
import { UFile } from '../types'
import { imageFromSrc, srcfy } from '../../../../utils/filesManipulation'

export function UImageFile({ id, data: d, setData, readonly, upageId }: UFile) {
  const data = d as UMediaFileData

  const onUpload = (src: str) => {
    // setTmpSrc('') // in test mode without server image flickers on insertion because tmpSrc is replaced by real immediately
    // do not replace tmp src to avoid flickering (even with server)
    // unset it when image is deleted (otherwise reactivity is broken)
    setData(id, { src })
  }

  const ps = useUImageFile(id, upageId, onUpload, (tmpFile) => setData(id, { $tmpSrc: srcfy(tmpFile) }))

  useMount(() => {
    if (!data.src && data.$tmpSrc) imageFromSrc(data.$tmpSrc).then((f) => ps.uploadFile(f))
  })

  if (!data.$tmpSrc && !data.src) return <Drop1zone {...ps} label="image" icon={<ImageRoundedIcon />} />

  // undefined on first render
  const parent = document.querySelector(`[${UBlockIdAttribute}="${id}"]`)?.parentElement as HTMLDivElement | undefined
  const maxWidth = parent?.offsetWidth || 900

  return (
    <ResizableWidth
      readonly={readonly}
      width={data.width}
      updateWidth={(width) => setData(id, { width })}
      maxWidth={maxWidth}
    >
      <Img src={data.$tmpSrc || data.src} data-cy="img" />
      {!readonly && (
        <Delete
          size="small"
          onClick={() => {
            setData(id, { src: '', $tmpSrc: '' })
            ps.deleteFile([{ blockId: id, src: data.src }], upageId)
          }}
        >
          <DeleteRoundedIcon />
        </Delete>
      )}
      {ps.isUploading && (
        <ProgressWrapper data-cy="img-preloader">
          <CircularProgress
            variant="indeterminate"
            sx={{
              color: (theme) => theme.palette.primary.main,
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round',
              },
            }}
            size={20}
            thickness={4}
          />
        </ProgressWrapper>
      )}
    </ResizableWidth>
  )
}
const ProgressWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '-0.75rem',
  bottom: '-0.75rem',
  width: '2rem',
  height: '2rem',
  borderRadius: '50%',
  padding: '6px',
  // display: 'flex', // strange anomaly occurs, had to use padding 6px
  backgroundColor: theme.palette.background.paper,
}))

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
