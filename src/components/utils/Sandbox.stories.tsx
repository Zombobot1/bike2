import { Box, Stack, styled } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { fn } from '../../utils/types'
import { safe } from '../../utils/utils'
import { useSelection } from '../editing/UBlock/useSelection'

export function T() {
  const ref = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const { dispatch } = useSelection()
  const [selection, setSelection] = useState(new Selection())

  useEffect(() => {
    if (selection.active) {
      const onMove = (e: MouseEvent) => {
        setSelection((old) => {
          let x = old.x
          let width = old.width
          const xMove = old.pageX - e.pageX

          if (e.pageX <= old.x) {
            x = e.pageX
            width = old.width + Math.abs(xMove)
          } else if (e.pageX < old.initialX) {
            x = e.pageX
            width = old.width - Math.abs(xMove)
          } else {
            width = e.pageX - old.x
          }

          let y = old.y
          let height = old.height
          const pageY = e.pageY + safe(ref.current).scrollTop
          const yMove = old.pageY - pageY
          const pageHeight = safe(ref2.current).offsetHeight || 0

          let scrolledDown = 0
          if (window.innerHeight - e.clientY < 50 && pageHeight - pageY > 50) scrolledDown = 10
          let scrolledUp = 0
          if (e.pageY < 50 && safe(ref.current).scrollTop) scrolledUp = 10

          if (pageY <= old.y) {
            y = pageY
            height = old.height + Math.abs(yMove)
          } else if (pageY < old.initialY) {
            y = pageY
            height = old.height - Math.abs(yMove) + scrolledUp
          } else {
            height = pageY - old.y + scrolledDown
          }

          if (scrolledDown) safe(ref.current).scrollBy(0, scrolledDown)
          if (scrolledUp) safe(ref.current).scrollBy(0, -scrolledUp)

          return { ...old, x, y, width, height, pageX: e.pageX, pageY }
        })
      }

      window.addEventListener('mousemove', onMove)
      setSelection((old) => ({
        ...old,
        cleanUp: () => window.removeEventListener('mousemove', onMove),
      }))
    } else selection.cleanUp()
  }, [selection.active])

  const fullWidth = false

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const scrollTop = safe(ref.current).scrollTop
    dispatch({ a: 'mouse-down' })
    setSelection({
      ...new Selection(),
      active: true,
      x: e.pageX,
      y: e.pageY + scrollTop,
      initialX: e.pageX,
      initialY: e.pageY + scrollTop,
      pageX: e.pageX,
      pageY: e.pageY + scrollTop,
    })
  }

  return (
    <UPage_ ref={ref} onMouseUp={() => setSelection((old) => ({ ...old, active: false }))}>
      <Stack direction="row" alignItems="stretch" sx={{ minHeight: '100%' }}>
        <Side onMouseDown={onMouseDown} className="upage--side" />
        <Page ref={ref2} sx={!fullWidth ? { maxWidth: 900 } : {}} className="upage--page">
          <Box sx={{ width: '100%', height: 600, backgroundColor: 'yellow' }} />
          <Box sx={{ width: '100%', height: 600, backgroundColor: 'yellow', marginTop: '2rem' }} />
        </Page>
        <Side onMouseDown={onMouseDown} className="upage--side" />
      </Stack>

      {selection.active && selection.width > 2 && selection.height > 2 && (
        <SelectionBox sx={{ top: selection.y, left: selection.x, width: selection.width, height: selection.height }} />
      )}
    </UPage_>
  )
}

const SelectionBox = styled(Box)({
  position: 'absolute',
  backgroundColor: 'black',
})

class Selection {
  x = -1
  y = -1
  width = 0
  height = 0
  initialX = -1
  initialY = -1
  pageX = -1
  pageY = -1
  cleanUp = fn
  active = false
}

const UPage_ = styled(Box, { label: 'UPage' })(({ theme }) => ({
  overflow: 'auto',
  position: 'relative',
  width: '100%',
  minHeight: '100%',
  backgroundColor: 'red', // REMOVE

  '.upage--page': {
    backgroundColor: 'lightgreen',
    flexGrow: 90,
  },

  '.upage--side': {
    backgroundColor: 'blue',
    userSelect: 'none',
    flexGrow: 5,
  },

  [`${theme.breakpoints.up('sm')}`]: {
    '.upage--page': {
      flexGrow: 80,
    },

    '.upage--side': {
      flexGrow: 10,
    },
  },
}))

const Side = Box
const Page = Box

export default {
  title: 'Sandbox/Sandbox',
}
