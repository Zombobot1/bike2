import { alpha, Box, Button, Stack, styled } from '@mui/material'
import randomColor from 'randomcolor'
import { bool, fn, Fn, str, strs } from '../../../utils/types'
import { useIsSM, useReactive } from '../../utils/hooks/hooks'
import { useRouter } from '../../utils/hooks/useRouter'
import { useShowAppBar } from '../../application/navigation/AppBar/AppBar'
import { isIndexableBLock, UBlockDTO, UBlockType } from '../types'
import { UBlocksSet, useUBlocks } from './UBlocksSet/UBlocksSet'
import { ReactComponent as WaveSVG } from './wave.svg'
import { uuid } from '../../../utils/uuid'
import { WS } from '../../application/navigation/workspace'
import { useSetData } from '../../../fb/useData'
import { useEffect, useRef, useState } from 'react'
import { TOCItems } from './TableOfContents/types'
import { TableOfContents } from './TableOfContents/TableOfContents'
import { useMap } from '../../utils/hooks/useMap'
import { safe } from '../../../utils/utils'
import { setUPageScroll, useSelection } from '../UBlock/useSelection'

export interface UPageDataDTO {
  color: str
  name: str
  ids: strs
}

export interface UPageDTO {
  type: UBlockType
  data: UPageDataDTO
  fullWidth?: bool
  isDeleted?: bool
  readonly?: bool
}

export interface UPage {
  workspace: WS
  setOpenTOC: (f?: Fn) => void
}
// readOnly fullWidth showToC (default true)
export function UPage({ workspace, setOpenTOC }: UPage) {
  const { location } = useRouter()
  const id = location.pathname.replace('/', '')
  const { ids, ublock, setUBlockData } = useUBlocks<UPageDTO, UPageDataDTO>(id)
  const { upageRef, onMouseDown, pageRef, selectionRef, setIsSelectionActive } = useSelectablePage()
  const addNewUPage = useNewUPage(workspace)

  const [color, setColor] = useReactive(ublock.data.color)
  const [name] = useReactive(ublock.data.name)
  const { showAppBar, hideAppBar } = useShowAppBar()
  const tocMap = useMap<str, TOCItems>()
  const isSM = useIsSM()
  const isTOCOpenS = useState(false)

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
      <Stack direction="row" alignItems="stretch" sx={{ minHeight: '100%' }}>
        <Side onMouseDown={onMouseDown} className="upage--side" />
        <Page ref={pageRef} sx={!ublock.fullWidth ? { maxWidth: 900 } : {}} className="upage--page">
          <UBlocksSet
            ids={ids}
            setIds={setIds}
            readonly={false}
            addNewUPage={(underId) => addNewUPage(id, underId, color)}
            title={name}
            setTitle={rename}
            updateTOC={(toc) => tocMap.set(id, toc)}
          />
        </Page>
        <Side onMouseDown={onMouseDown} className="upage--side" />
      </Stack>
      <TableOfContents data={tocMap.get(id) || []} isOpenS={isTOCOpenS} />
      <SelectionBox
        ref={selectionRef}
        sx={{ top: selection.y, left: selection.x, width: selection.width, height: selection.height }}
      />
    </UPage_>
  )
}

export function useNewUPage(workspace: WS) {
  const { history } = useRouter()
  const { addData } = useSetData()
  function addNewUPage(parentId?: str, underId?: str, parentColor?: str) {
    const id = uuid.v4()
    const newPage: UPageDataDTO = { color: parentColor || randomColor({ luminosity: 'bright' }), ids: [], name: '' }
    addData<UBlockDTO>('ublocks', id, { type: 'page', data: JSON.stringify(newPage) })
    history.push('/' + id)
    workspace.insert(id, parentId, underId)
  }
  return addNewUPage
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
  backgroundColor: alpha(theme.palette.info.main, 0.25),
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

const UPage_ = styled(Box, { label: 'UPage' })(({ theme }) => ({
  overflow: 'auto',
  position: 'relative',
  minHeight: '100%',
  width: '100%',

  '.upage--page': {
    flexGrow: 90,
  },

  '.upage--side': {
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
