import { useIsSM } from '../hooks/hooks'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { bool, Fn, fn, num, SetStr, str } from '../../../utils/types'
import { WidthStr, Left, Handler, Right } from './ResizableWidth'
import { styled } from '@mui/material'

export interface ResizableFluidWidth {
  width: str
  maxWidth?: str
  updateWidth: SetStr
  onWidthChange?: SetStr
  children: ReactNode
  readonly?: bool
  stretch?: bool
  onResizeStart?: Fn
  rightOnly?: bool
  hideHandlers?: bool
}

export function ResizableFluidWidth({
  width: initialWidth,
  updateWidth,
  children,
  readonly,
  maxWidth = '100%',
  onWidthChange = fn,
  stretch,
  onResizeStart = fn,
  rightOnly,
  hideHandlers,
}: ResizableFluidWidth) {
  const ref = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState({ ...new WidthStr(), width: min(initialWidth, maxWidth) })

  useEffect(() => {
    if (isResizing) return
    setWidth({ ...new WidthStr(), width: min(initialWidth, maxWidth) })
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
      const scaledNewWidth = getNewWidth(width.widthBeforeResizeStr, width.widthBeforeResize, newWidth)
      const newWidthStr = min(scaledNewWidth, maxWidth)
      onWidthChange(newWidthStr)
      setWidth((old) => ({
        ...old,
        width: newWidthStr,
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

      setWidth((old) => ({
        ...old,
        widthBeforeResize: ref.current?.offsetWidth || 0,
        widthBeforeResizeStr: initialWidth,
        needResize: 0,
      }))

      onResizeStart()
    }

  const rootSx = !hideHandlers
    ? {
        ':hover span': { opacity: 1 },
      }
    : {}

  const widthSX = isSM
    ? { minWidth: stretch ? undefined : width.width, maxWidth: width.width, width: width.width }
    : { width: '100%' }

  return (
    <ResizableFluidWidth_
      ref={ref}
      sx={{
        ...widthSX,
        flexGrow: stretch ? 1 : undefined,
        cursor: isResizing ? 'col-resize' : 'default',
        ...rootSx,
      }}
    >
      {isSM && !readonly && (
        <>
          {!rightOnly && (
            <Left onMouseDown={onMouseDown(true)}>
              <Handler />
            </Left>
          )}
          <Right onMouseDown={onMouseDown()}>
            <Handler />
          </Right>
        </>
      )}
      {children}
    </ResizableFluidWidth_>
  )
}

export function min(a: str, b: str): str {
  return Math.min(+a.replace('%', ''), +b.replace('%', '')) + '%'
}

export function getNewWidth(currentWidth: str, widthBeforeResize: num, newWidth: num): str {
  const currentWidthNum = +currentWidth.replace('%', '')
  const delta = (newWidth - widthBeforeResize) / widthBeforeResize
  return currentWidthNum * (1 + delta) + '%'
}

export const ResizableFluidWidth_ = styled('div', { label: 'ResizableFluidWidth' })({
  position: 'relative',
  height: '100%',

  'span:hover': {
    opacity: 1,
  },
})
