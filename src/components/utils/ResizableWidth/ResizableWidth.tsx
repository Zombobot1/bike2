import { useIsSM } from '../hooks/hooks'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { bool, f, num, SetNum, str } from '../../../utils/types'
import { alpha, styled } from '@mui/material'

export interface ResizableWidth {
  updateWidth: SetNum
  width?: num
  maxWidth: num
  minWidth?: num
  children: ReactNode
  readonly?: bool
  rightOnly?: bool
  hiddenHandler?: bool
  stretch?: bool
  stretchHandler?: bool
  onWidthChange?: SetNum
}

export function ResizableWidth({
  width: initialWidth = 0,
  minWidth = 200,
  updateWidth,
  children,
  readonly,
  maxWidth,
  rightOnly,
  hiddenHandler,
  stretch,
  stretchHandler,
  onWidthChange = f,
}: ResizableWidth) {
  const ref = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState({ ...new Width(), width: Math.min(initialWidth, maxWidth), minWidth })

  useEffect(() => {
    if (isResizing) return
    setWidth({ ...new Width(), width: Math.min(initialWidth, maxWidth), minWidth }) // wtf??
  }, [initialWidth, maxWidth])

  const [needUpdate, setNeedUpdate] = useState(false)

  useEffect(() => {
    if (!needUpdate) return
    updateWidth(width.width) // set new width whe resize is over
    setNeedUpdate(false)
  }, [needUpdate])

  useEffect(() => {
    const scaleBy = rightOnly ? 1 : 2
    const newWidth = width.widthBeforeResize + width.needResize * scaleBy

    if (Math.abs(width.needResize - width.previousResize) > 1 && newWidth >= width.minWidth) {
      onWidthChange(Math.min(newWidth, maxWidth)) // update current width during resize
      setWidth((old) => ({
        ...old,
        width: Math.min(old.widthBeforeResize + old.needResize * scaleBy, maxWidth),
        previousResize: old.needResize,
      }))
    }
  }, [width.needResize])

  const isSM = useIsSM()

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

      setWidth((old) => {
        const curWidth = ref.current?.offsetWidth || 9999
        const width = old.width ? Math.min(curWidth, old.width) : curWidth
        return { ...old, width, widthBeforeResize: width, needResize: 0 }
      })
    }

  const sx = stretchHandler ? { height: '70%' } : {}

  let w: str | num = 'auto'
  if ((!isResizing && stretch) || !isSM) w = '100%'
  else if (width.width) w = width.width

  return (
    <ResizableWidth_
      sx={{
        width: w,
        cursor: isResizing ? 'col-resize' : 'default',
      }}
      ref={ref}
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

export const Left = styled(HandlerContainer)({
  left: 0,
})

export const Right = styled(HandlerContainer)({
  right: 0,
})

export const Handler = styled('span')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  width: '50%',
  height: '30%',
  opacity: 0,
  transition: 'opacity 0.1s ease-in-out',
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.8)}`,
  borderRadius: '10px',
  backgroundColor: alpha(theme.palette.primary.main, 0.6),
  userSelect: 'none',
  zIndex: 2, // for UGrid
}))

class Width {
  widthBeforeResize = 0
  width = 100
  needResize = 0
  previousResize = 0
  minWidth = 200
}

export class WidthStr {
  widthBeforeResize = 0
  widthBeforeResizeStr = ''
  width = 100
  needResize = 0
  previousResize = 0
  minWidth = 50
}
