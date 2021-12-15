import { Box, Button, Stack, styled } from '@mui/material'
import { useIsSM, useReactive } from '../../utils/hooks/hooks'
import { useRouter } from '../../utils/hooks/useRouter'
import { useShowAppBar } from '../../application/navigation/AppBar/AppBar'
import { isIndexableBLock, UBlockType } from '../types'
import { UBlocksSet, useUBlocks } from './UBlockSet/UBlockSet'
import { ReactComponent as WaveSVG } from './wave.svg'
import { WS } from '../../application/navigation/workspace'
import { useEffect, useRef, useState } from 'react'
import { TOCItems } from './TableOfContents/types'
import { TableOfContents } from './TableOfContents/TableOfContents'
import { useMap } from '../../utils/hooks/useMap'
import { safe } from '../../../utils/utils'
import { setUPageScroll, useSelection } from '../UBlock/useSelection'
import { useDeleteUPage } from './useDeleteUPage'
import { bool, fn, Fn, str, strs } from '../../../utils/types'
import { useNewUPage } from './useNewUPage'

export interface UPageDataDTO {
  color: str
  name: str
  ids: strs
  fullWidth?: bool
}

export interface UPageDTO {
  type: UBlockType
  data: UPageDataDTO
  isDeleted?: bool
  readonly?: bool
}

export interface UPage {
  workspace: WS
  setOpenTOC: (f?: Fn) => void
  setToggleFullWidth: (f: Fn) => void
}
// readOnly fullWidth showToC (default true)
export function UPage({ workspace, setOpenTOC, setToggleFullWidth }: UPage) {
  const { location } = useRouter()
  const id = location.pathname.replace('/', '')
  const { ids, ublock, setUBlockData } = useUBlocks<UPageDTO, UPageDataDTO>(id)
  const { upageRef, onMouseDown, pageRef, selectionRef, setIsSelectionActive } = useSelectablePage()
  const addNewUPage = useNewUPage(workspace)
  const deleteUPage = useDeleteUPage(workspace, { skipRootDeletion: true })

  const [color, setColor] = useReactive(ublock.data.color)
  const [name] = useReactive(ublock.data.name)
  const { showAppBar, hideAppBar } = useShowAppBar()
  const tocMap = useMap<str, TOCItems>()
  const isSM = useIsSM()
  const isTOCOpenS = useState(false)

  useEffect(() => {
    setToggleFullWidth(() => () => setUBlockData({ ...ublock.data, fullWidth: !ublock.data.fullWidth }))
  }, [JSON.stringify(ublock.data)])

  useEffect(() => {
    if (!isSM && tocMap.has(id) && safe(tocMap.get(id)).find((t) => isIndexableBLock(t.type))) {
      setOpenTOC(() => () => isTOCOpenS[1](true))
    } else {
      setOpenTOC(undefined)
    }
  }, [tocMap.get(id), isSM])

  const rename = (name: str) => {
    setUBlockData({ ...ublock.data, name })
    workspace.rename(id, name)
  }
  const setIds = (ids: strs) => setUBlockData({ ...ublock.data, ids })
  const blockSetProps = {
    ids: ids,
    setIds: setIds,
    readonly: false,
    addNewUPage: (newId: str, underId?: str) => addNewUPage(newId, id, underId, color),
    title: name,
    setTitle: rename,
    updateTOC: (toc: TOCItems) => tocMap.set(id, toc),
    deleteUPage,
  }
  return (
    <UPage_ ref={upageRef} onMouseUp={() => setIsSelectionActive(false)}>
      <ColoredBox sx={{ path: { fill: color } }} onMouseEnter={showAppBar} onMouseLeave={hideAppBar}>
        <WaveSVG />
        <ColorPicker variant="contained" size="small">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            onBlur={(e) => setUBlockData({ ...ublock.data, color: e.target.value })}
          />
          Set color
        </ColorPicker>
      </ColoredBox>
      {isSM && (
        <Stack direction="row" alignItems="stretch" sx={{ minHeight: '100%' }}>
          <Side onMouseDown={onMouseDown} className="upage--side" />
          <Page
            ref={pageRef}
            sx={!ublock.data.fullWidth ? { maxWidth: 900 } : { maxWidth: '80%' }}
            className="upage--page"
          >
            <UBlocksSet {...blockSetProps} />
          </Page>
          <Side onMouseDown={onMouseDown} className="upage--side" />
        </Stack>
      )}
      {!isSM && (
        <Box sx={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          <UBlocksSet {...blockSetProps} />
        </Box>
      )}
      <SelectionBox
        ref={selectionRef}
        sx={{ top: selection.y, left: selection.x, width: selection.width, height: selection.height }}
      />
      <TableOfContents data={tocMap.get(id) || []} isOpenS={isTOCOpenS} />
    </UPage_>
  )
}

function useSelectablePage() {
  const ref = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<HTMLDivElement>(null)
  const { dispatch } = useSelection()
  const [isSelectionActive, setIsSelectionActive] = useState(false)

  useEffect(() => {
    if (isSelectionActive) {
      const onMove = (e: MouseEvent) => {
        const old = selection

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
        if (window.innerHeight - e.clientY < 100 && pageHeight - pageY > 10) scrolledDown = 10
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

        if (scrolledDown) {
          safe(ref.current).scrollBy(0, scrolledDown)
          setUPageScroll(safe(ref.current).scrollTop)
        }
        if (scrolledUp) {
          safe(ref.current).scrollBy(0, -scrolledUp)
          setUPageScroll(safe(ref.current).scrollTop)
        }

        selection = { ...old, x, y, width, height, pageX: e.pageX, pageY }
        const style = safe(selectionRef.current).style
        style.height = height + 'px'
        style.width = width + 'px'
        style.left = x + 'px'
        style.top = y + 'px'
      }

      window.addEventListener('mousemove', onMove)
      selection.cleanUp = () => {
        safe(selectionRef.current).style.height = '0'
        selection = new Selection()
        window.removeEventListener('mousemove', onMove)
      }
    } else {
      dispatch({ a: 'mouse-up' })
      selection.cleanUp()
    }
  }, [isSelectionActive])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const scrollTop = safe(ref.current).scrollTop
    dispatch({ a: 'mouse-down' })
    selection = {
      ...new Selection(),
      x: e.pageX,
      y: e.pageY + scrollTop,
      initialX: e.pageX,
      initialY: e.pageY + scrollTop,
      pageX: e.pageX,
      pageY: e.pageY + scrollTop,
    }
    setIsSelectionActive(true)
  }

  return { upageRef: ref, pageRef: ref2, onMouseDown, selection, setIsSelectionActive, isSelectionActive, selectionRef }
}

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
  cleanUp = fn
}

let selection = new Selection()

const UPage_ = styled(Box, { label: 'UPage' })({
  overflow: 'auto',
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
})

const Side = Box
const Page = Box

const ColorPicker = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: '1.5rem',
  top: '5rem',
  display: 'none !important',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',

  input: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },

  [`${theme.breakpoints.up('sm')}`]: {
    display: 'inline-flex  !important',
  },
}))

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
