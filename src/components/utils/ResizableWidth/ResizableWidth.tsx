import { useIsSM } from '../hooks/hooks'
import { ReactNode, useEffect, useState } from 'react'
import { bool, num, SetNum } from '../../../utils/types'
import { alpha, styled } from '@mui/material'

interface ResizableWidth {
  updateWidth: SetNum
  width: num
  maxWidth: num
  children: ReactNode
  readonly?: bool
  rightOnly?: bool
  hiddenHandler?: bool
  stretch?: bool
  stretchHandler?: bool
  // onWidthChange: SetNum // - too heavy for a table
}

export function ResizableWidth({
  width: initialWidth,
  updateWidth,
  children,
  readonly,
  maxWidth,
  rightOnly,
  hiddenHandler,
  stretch,
  stretchHandler,
}: ResizableWidth) {
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState({ ...new Width(), width: Math.min(initialWidth, maxWidth) })
  useEffect(() => {
    if (isResizing) return
    setWidth({ ...new Width(), width: Math.min(initialWidth, maxWidth) })
  }, [initialWidth, maxWidth])

  const [needUpdate, setNeedUpdate] = useState(false)
  const isSM = useIsSM()

  useEffect(() => {
    if (!needUpdate) return
    updateWidth(width.width)
    setNeedUpdate(false)
  }, [needUpdate])

  useEffect(() => {
    const scaleBy = rightOnly ? 1 : 2
    const newWidth = width.widthBeforeResize + width.needResize * scaleBy
    if (Math.abs(width.needResize - width.previousResize) > 1 && newWidth >= width.minWidth) {
      setWidth((old) => ({
        ...old,
        width: Math.min(old.widthBeforeResize + old.needResize * scaleBy, maxWidth),
        previousResize: old.needResize,
      }))
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

  const sx = stretchHandler ? { height: '70%' } : {}

  return (
    <ResizableWidth_
      sx={{
        width: !isResizing && stretch ? '100%' : width.width,
        cursor: isResizing ? 'col-resize' : 'default',
      }}
    >
      {isSM && !readonly && (
        <>
          {!rightOnly && <Left onMouseDown={onMouseDown(true)}>{!hiddenHandler && <Handler />}</Left>}
          <Right onMouseDown={onMouseDown()}>{(!hiddenHandler || isResizing) && <Handler sx={sx} />}</Right>
        </>
      )}
      {children}
    </ResizableWidth_>
  )
}

const ResizableWidth_ = styled('div', { label: 'ResizableWidth' })({
  position: 'relative',
  height: '100%',

  ':hover span': {
    opacity: 1,
  },

  ':hover .MuiIconButton-root': {
    opacity: 1,
  },
})

const HandlerContainer = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  cursor: 'col-resize',
  width: '1rem',
  userSelect: 'none',
})

const Left = styled(HandlerContainer)({
  left: 0,
})

const Right = styled(HandlerContainer)({
  right: 0,
})

const Handler = styled('span')(({ theme }) => ({
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

class Width {
  widthBeforeResize = 0
  width = 100
  needResize = 0
  previousResize = 0
  minWidth = 50
}
