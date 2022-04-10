import { Box, Stack, styled } from '@mui/material'
import { useC, useIsSM, useReactive } from '../../utils/hooks/hooks'
import { useShowAppBar } from '../../application/navigation/AppBar/AppBar'
import { ReactComponent as WaveSVG } from './wave.svg'
import { useRef, useState } from 'react'
import { TableOfContents } from './TableOfContents/TableOfContents'
import { safe } from '../../../utils/utils'
import { bool, Children, DivRef, f, Fn, Fns, num, str, strs } from '../../../utils/types'
import { useUPageTriggers } from './useUPageInfo'
import { UBlockIdAttribute } from './ublockTypes'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { useUPageState } from './UPageState/UPageState'
import { UPageManagement } from '../../application/Workspace/WorkspaceState'
import { useUserKeyDownForSelection } from './UBlockSet/useUserKeyDownForSelection'
import { WindowedBlockSet } from './UBlockSet/WindowedBlockSet/WindowedBlockSet'
import { Fetch } from '../../utils/Fetch/Fetch'

export interface UPage {
  id: str // remount for new id
  workspace: UPageManagement
}

function UPage_({ id, workspace }: UPage) {
  const { data, changer } = useUPageState(id, workspace)

  useUserKeyDownForSelection(changer)

  const [color] = useReactive(workspace.color(id))
  const [name] = useReactive(workspace.name(id))
  const rename = useC((name: str) => workspace.rename(id, name))
  // const setColor = useC((color: str) => workspace.setColor(id, color))

  const { upageRef, onMouseDown, pageRef, selectionRef, onMouseUp } = useSelectablePage(
    changer.select,
    changer.unselect,
  )

  const { showAppBar, hideAppBar } = useShowAppBar()
  const isTOCOpenS = useState(false)

  const { fullWidthTrigger, openTOCTrigger, turnOffTOCTrigger } = useUPageTriggers()

  useUpdateEffect(() => {
    if (data.turnOffTOC) return
    if (openTOCTrigger) isTOCOpenS[1](true)
  }, [openTOCTrigger])

  useUpdateEffect(() => {
    if (fullWidthTrigger) changer.triggerFullWidth()
  }, [fullWidthTrigger])

  useUpdateEffect(() => {
    if (turnOffTOCTrigger) changer.triggerTurnOffTOC()
  }, [turnOffTOCTrigger])

  return (
    <>
      <UPage__ ref={upageRef} onMouseUp={onMouseUp}>
        <ColoredBox sx={{ path: { fill: color } }} onMouseEnter={showAppBar} onMouseLeave={hideAppBar}>
          <WaveSVG />
          {/* <ColorPicker variant="contained" size="small">
          <input
            type="color"
            value={color}
            // onChange={(e) => setColor(e.target.value)} // TODO: manage colors
            onBlur={(e) => setColor(e.target.value)}
          />
          Set color
        </ColorPicker> */}
        </ColoredBox>
        <UBlocksSetWrapper onMouseDown={onMouseDown} pageRef={pageRef} fullWidth={data.fullWidth}>
          <WindowedBlockSet id={'r'} blocks={data.ublocks} title={name} setTitle={rename} />
        </UBlocksSetWrapper>
        <SelectionBox
          ref={selectionRef}
          sx={{ top: selectionBox.y, left: selectionBox.x, width: selectionBox.width, height: selectionBox.height }}
        />
        <TableOfContents isOpenS={isTOCOpenS} getTOC={changer.deriveTOC} />
      </UPage__>
    </>
  )
}

export function UPage(ps: UPage) {
  return (
    <Fetch>
      <UPage_ {...ps} />
    </Fetch>
  )
}

interface UBlocksSetWrapper {
  pageRef: DivRef
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  fullWidth?: bool
  children: Children
}

function UBlocksSetWrapper({ onMouseDown, pageRef, fullWidth, children }: UBlocksSetWrapper) {
  const isSM = useIsSM()
  return (
    <>
      {isSM && (
        <Stack direction="row" alignItems="stretch" sx={{ minHeight: '100%' }}>
          <Side onMouseDown={onMouseDown} className="upage--side" />
          <Page ref={pageRef} sx={!fullWidth ? { maxWidth: 900 } : { maxWidth: '80%' }} className="upage--page">
            {children}
          </Page>
          <Side onMouseDown={onMouseDown} className="upage--side" />
        </Stack>
      )}
      {!isSM && <Box sx={{ paddingLeft: '1rem', paddingRight: '1rem' }}>{children}</Box>}
    </>
  )
}

function useSelectablePage(select: (...ids: strs) => void, unselect: Fn) {
  const upageRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<HTMLDivElement>(null)

  const onMouseDown = useC((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const scrollTop = safe(upageRef.current).scrollTop

    unselect()

    selectionBox = {
      ...new Selection(),
      x: e.pageX,
      y: e.pageY + scrollTop,
      initialX: e.pageX,
      initialY: e.pageY + scrollTop,
      pageX: e.pageX,
      pageY: e.pageY + scrollTop,
    }

    const onMove = (e: MouseEvent) => {
      const old = selectionBox

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
      const pageY = e.pageY + safe(upageRef.current).scrollTop
      const yMove = old.pageY - pageY
      const pageHeight = safe(pageRef.current).offsetHeight || 0

      let scrolledDown = 0
      if (window.innerHeight - e.clientY < 100 && pageHeight - pageY > 10) scrolledDown = 10
      let scrolledUp = 0
      if (e.pageY < 50 && safe(upageRef.current).scrollTop) scrolledUp = 10

      if (pageY <= old.y) {
        y = pageY
        height = old.height + Math.abs(yMove)
      } else if (pageY < old.initialY) {
        y = pageY
        height = old.height - Math.abs(yMove) + scrolledUp
      } else {
        height = pageY - old.y + scrolledDown
      }

      if (scrolledDown) {
        safe(upageRef.current).scrollBy(0, scrolledDown)
        // setUPageScroll(safe(upageRef.current).scrollTop)
      }
      if (scrolledUp) {
        safe(upageRef.current).scrollBy(0, -scrolledUp)
        // setUPageScroll(safe(upageRef.current).scrollTop)
      }

      selectionBox = { ...old, x, y, width, height, pageX: e.pageX, pageY }
      const style = safe(selectionRef.current).style
      style.height = height + 'px'
      style.width = width + 'px'
      style.left = x + 'px'
      style.top = y + 'px'
    }

    window.addEventListener('mousemove', onMove)

    document.querySelectorAll(`[${UBlockIdAttribute}]`).forEach((block) => {
      const id = safe(block.getAttribute(UBlockIdAttribute))

      const onEnter = (ev: Event) => {
        const e = ev as MouseEvent
        idAndEnteredAtY.set(id, e.clientY)
        block.classList.add('selected')
      }
      block.addEventListener('mouseenter', onEnter)
      cleanUps.push(() => block.removeEventListener('mouseenter', onEnter))

      const onLeave = (ev: Event) => {
        const e = ev as MouseEvent
        // if (a.atY + upageScroll <= (old.enteredAtY.get(a.id) || 0 + upageScroll) + 10) // + upageScroll ???
        if (safe(idAndEnteredAtY.get(id)) > e.clientY) block.classList.remove('selected')
      }
      block.addEventListener('mouseleave', onLeave)
      cleanUps.push(() => block.removeEventListener('mouseleave', onLeave))
    })

    selectionBox.cleanUp = () => {
      safe(selectionRef.current).style.height = '0'
      selectionBox = new Selection()
      window.removeEventListener('mousemove', onMove)
    }
  })

  const onMouseUp = useC(() => {
    selectionBox.cleanUp()

    select(
      ...Array.from(document.querySelectorAll('.selected')).map((block) => safe(block.getAttribute(UBlockIdAttribute))),
    )
    idAndEnteredAtY.clear()
    cleanUps.forEach((f) => f())
    cleanUps.splice(0, cleanUps.length)
    // upageScroll = 0
  })

  return {
    upageRef,
    pageRef,
    selectionRef,
    onMouseDown,
    onMouseUp,
  }
}

const cleanUps = [] as Fns
const idAndEnteredAtY = new Map<str, num>()

const SelectionBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.apm('info'),
}))

class Selection {
  x = -1
  y = -1
  width = 0
  height = 0
  initialX = -1
  initialY = -1
  pageX = -1
  pageY = -1
  cleanUp = f
}

let selectionBox = new Selection()

const UPage__ = styled(Box, { label: 'UPage' })(({ theme }) => ({
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  minHeight: '100%',
  width: '100%',

  '.upage--page': {
    flexGrow: 80,
  },

  '.upage--side': {
    userSelect: 'none',
    flexGrow: 10,
  },

  [`${theme.breakpoints.up('sm')}`]: {
    transform: 'translateY(-3.75rem)',
  },
}))

const Side = Box
const Page = Box

// height is dynamic -> cannot be positioned absolute
const ColoredBox = styled('div')({
  position: 'relative',
  width: '100%',

  ':hover .MuiButton-root': {
    opacity: 1,
  },

  svg: {
    display: 'block',
  },
})
