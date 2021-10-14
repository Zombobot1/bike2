import { useIsSM, useReactiveObject } from '../hooks/hooks'
import { ReactNode, useEffect, useState } from 'react'
import { bool, num, SetNum } from '../../../utils/types'
import { alpha, styled } from '@mui/material'

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
      setWidth((old) => ({
        ...old,
        width: old.widthBeforeResize + old.needResize * 2,
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

  return (
    <ResizableWidth_ sx={{ width: width.width || '100%', cursor: isResizing ? 'col-resize' : 'default' }}>
      {isSM && !readonly && (
        <>
          <Right onMouseDown={onMouseDown()}>
            <Handler />
          </Right>
          <Left onMouseDown={onMouseDown(true)}>
            <Handler />
          </Left>
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
