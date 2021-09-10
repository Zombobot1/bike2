import { useIsSM, useReactive, useReactiveObject } from '../../../utils/hooks/hooks'
import ImageRoundedIcon from '@material-ui/icons/ImageRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import { UBlockComponent } from '../../types'
import { Dropzone1 } from '../../../utils/Dropzone'
import { useUImageFile } from '../useUFile'
import { alpha, Box, IconButton, Stack, styled } from '@material-ui/core'
import { bool, num, SetNum, SetStr, str } from '../../../../utils/types'
import { cast } from '../../../../utils/utils'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import { Rec } from '../../../utils/Rec'
import fluffy from '../../../../content/fluffy.jpg'

export class UImageFileDTO {
  src = ''
  width = 900
}

export function UImageFile({ data, setData, readonly }: UBlockComponent) {
  const [imageData, setImageData] = useReactiveObject(cast(data, new UImageFileDTO()))
  const props = useUImageFile(
    (src) => setData(JSON.stringify({ ...imageData, src })),
    (f) => setImageData(() => ({ width: 900, src: srcfy(f) })),
  )

  if (!imageData.src) return <Dropzone1 {...props} label="image" icon={<ImageRoundedIcon />} />

  return (
    <Stack direction="row" justifyContent="center">
      <ResizableWidth
        readonly={readonly}
        width={imageData.width}
        updateWidth={(w) => setData(JSON.stringify({ ...imageData, width: w }))}
      >
        <Img src={imageData.src} />
        {!readonly && (
          <Delete size="small" onClick={props.deleteFile}>
            <DeleteRoundedIcon />
          </Delete>
        )}
      </ResizableWidth>
    </Stack>
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

const ResizableWidth_ = styled('div', { label: 'ResizableWidth' })({
  position: 'relative',

  ':hover span': {
    opacity: 1,
  },

  ':hover .MuiIconButton-root': {
    opacity: 1,
  },
})

const ResizeHandle = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  cursor: 'col-resize',
  width: '1rem',
  userSelect: 'none',
})

const Left = styled(ResizeHandle)({
  left: 0,
})

const Right = styled(ResizeHandle)({
  right: 0,
})

const HandleContainer = styled('span')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  width: '50%',
  height: '4rem',
  opacity: 0,
  transition: 'opacity 0.1s ease-in-out',
  border: `1px solid ${alpha(theme.palette.common.white, 0.8)}`,
  borderRadius: '10px',
  backgroundColor: alpha(theme.palette.grey[800], 0.6),
  userSelect: 'none',
}))

interface ResizableWidth {
  updateWidth: SetNum
  width: num
  children: ReactNode
  readonly?: bool
}

export function ResizableWidth({ width: initialWidth, updateWidth, children, readonly }: ResizableWidth) {
  const [width, setWidth] = useReactiveObject({ ...new Width(), width: initialWidth })
  const [isResizing, setIsResizing] = useState(false)
  const [needUpdate, setNeedUpdate] = useState(false)
  const isSM = useIsSM()

  useEffect(() => {
    if (!needUpdate) return
    updateWidth(width.width)
    setNeedUpdate(false)
  }, [needUpdate])

  useEffect(() => {
    if (
      Math.abs(width.needResize - width.previousResize) > 1 &&
      width.widthBeforeResize + width.needResize * 2 >= width.minWidth
    ) {
      setWidth((old) => ({ ...old, width: old.widthBeforeResize + old.needResize * 2, previousResize: old.needResize }))
    }
  }, [width.needResize])

  const onMouseDown =
    (reverse = false) =>
    () => {
      const onMouseMove = (e: MouseEvent) =>
        setWidth((old) => {
          return { ...old, needResize: reverse ? old.needResize - e.movementX : old.needResize + e.movementX }
        })

      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
        setIsResizing(false)
        setNeedUpdate(true)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      setIsResizing(true)
      setWidth((old) => ({ ...old, widthBeforeResize: old.width, needResize: 0 }))
    }

  return (
    <ResizableWidth_ sx={{ width: width.width || '100%', cursor: isResizing ? 'col-resize' : 'default' }}>
      {isSM && !readonly && (
        <>
          <Right onMouseDown={onMouseDown()}>
            <HandleContainer />
          </Right>
          <Left onMouseDown={onMouseDown(true)}>
            <HandleContainer />
          </Left>
        </>
      )}
      {children}
    </ResizableWidth_>
  )
}

class Width {
  widthBeforeResize = 0
  width = 100
  needResize = 0
  previousResize = 0
  minWidth = 50
}
