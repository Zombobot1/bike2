import { useMount } from '../../../utils/hooks/hooks'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import { useUImageFile } from '../useUFile'
import { alpha, IconButton, styled } from '@mui/material'
import { str } from '../../../../utils/types'
import { useState } from 'react'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { Drop1zone } from '../../../utils/Dropzone/Drop1zone'
import { ResizableWidth } from '../../../utils/ResizableWidth/ResizableWidth'
import { UBlockIdAttribute, UMediaFileData } from '../../UPage/ublockTypes'
import { fileUploader } from '../FileUploader'
import { UFile } from '../types'

export function UImageFile({ id, data: d, setData, readonly, upageId }: UFile) {
  const data = d as UMediaFileData
  console.log({ data })
  const [tmpSrc, setTmpSrc] = useState('')

  const onUpload = (src: str) => {
    // do not replace tmp src to avoid flickering (even with server)
    // setTmpSrc('') // in test mode without server image flickers on insertion because tmpSrc is replaced by real immediately
    setData(id, { src })
  }

  const ps = useUImageFile(
    id,
    (src) => setData(id, { src }),
    (tmpFile) => {
      setTmpSrc(fileUploader.uploadBlob(id, tmpFile, onUpload)) // will unsubscribe on unmount
    },
  )

  useMount(() => {
    if (!data.src && fileUploader.hasImage(id)) setTmpSrc(fileUploader.startUpload(id, onUpload))
    return () => fileUploader.unsubscribe(id, upageId)
  })

  if (!tmpSrc && !data.src) return <Drop1zone {...ps} label="image" icon={<ImageRoundedIcon />} />

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
      <Img src={tmpSrc || data.src} data-cy="img" />
      {!readonly && (
        <Delete
          size="small"
          onClick={() => {
            setData(id, { src: '' })
            setTmpSrc('')
            ps.deleteFile(id, upageId)
          }}
        >
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
