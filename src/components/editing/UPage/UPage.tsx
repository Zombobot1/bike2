import { Box, Button, Stack, styled } from '@mui/material'
import { useC, useIsSM, useMount, useReactive } from '../../utils/hooks/hooks'
import { useRouter } from '../../utils/hooks/useRouter'
import { useShowAppBar } from '../../application/navigation/AppBar/AppBar'
import { UBlockDTO } from '../types'
import { UBlocksSet } from '../UBlockSet/UBlockSet'
import { ReactComponent as WaveSVG } from './wave.svg'
import { WS } from '../../application/navigation/workspace'
import { useEffect, useRef, useState } from 'react'
import { TableOfContents } from './TableOfContents/TableOfContents'
import { safe } from '../../../utils/utils'
import { setUPageScroll, useUPageSelection } from './hooks/useUpageSelection'
import { useDeleteUPage } from './hooks/useDeleteUPage'
import { bool, Children, DivRef, fn, str, strs } from '../../../utils/types'
import { useNewUPage } from './hooks/useNewUPage'
import { useUPageInfo } from './hooks/useUPageInfo'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { useData } from '../../../fb/useData'
import { deletePagesIn, findUpage, setRoot } from './blockIdAndInfo'
import { useNestedUBlockData } from '../UBlockSet/useNestedUBlockData'
import { setActions } from './hooks/useUpageActions'

export class UPageDTO {
  color = 'black'
  name = ''
  ids = [] as strs
  fullWidth?: bool
  turnOffTOC?: bool
}

export interface UPage {
  workspace: WS
}

export function UPage({ workspace }: UPage) {
  const { location } = useRouter()
  const id = location.pathname.replace('/', '')
  useEffect(() => setRoot(id), [id])

  const [ublock, setUBlock] = useData<UBlockDTO>('ublocks', id)

  const setDataAsStr = useC((d: str) => setUBlock({ data: d }))
  const [data, setData, addedBlocksS] = useNestedUBlockData(ublock.data, setDataAsStr, new UPageDTO())

  const [color, setColor] = useReactive(data.color)
  const [name] = useReactive(data.name)
  const setIds = useC((f: (old: strs) => strs) => setData((old) => ({ ...old, ids: f(old.ids) })))
  const rename = useC((name: str) => setData((old) => ({ ...old, name })))
  useCreateAndDeletePages(workspace, id, color)
  useUpdateEffect(() => workspace.rename(id, name), [name])

  const { upageRef, onMouseDown, pageRef, selectionRef, setIsSelectionActive } = useSelectablePage()

  const { showAppBar, hideAppBar } = useShowAppBar()
  const isTOCOpenS = useState(false)

  const { fullWidthTrigger, openTOCTrigger, turnOffTOCTrigger } = useUPageInfo()

  useUpdateEffect(() => {
    if (data.turnOffTOC) return
    if (openTOCTrigger) isTOCOpenS[1](true)
  }, [openTOCTrigger])

  useUpdateEffect(() => {
    if (fullWidthTrigger) setData((old) => ({ ...old, fullWidth: !old.fullWidth }))
  }, [fullWidthTrigger])

  useUpdateEffect(() => {
    if (turnOffTOCTrigger) setData((old) => ({ ...old, turnOffTOC: !data.turnOffTOC }))
  }, [turnOffTOCTrigger])

  return (
    <UPage_ ref={upageRef} onMouseUp={() => setIsSelectionActive(false)}>
      <ColoredBox sx={{ path: { fill: color } }} onMouseEnter={showAppBar} onMouseLeave={hideAppBar}>
        <WaveSVG />
        <ColorPicker variant="contained" size="small">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            onBlur={(e) => setData((old) => ({ ...old, color: e.target.value }))}
          />
          Set color
        </ColorPicker>
      </ColoredBox>
      <PageWrapper onMouseDown={onMouseDown} pageRef={pageRef} fullWidth={data.fullWidth}>
        <UBlocksSet
          id={id}
          ids={data.ids}
          setIds={setIds}
          addedBlocks={addedBlocksS[0]}
          setAddedBlocks={addedBlocksS[1]}
          title={name}
          setTitle={rename}
        />
      </PageWrapper>
      <SelectionBox
        ref={selectionRef}
        sx={{ top: selectionBox.y, left: selectionBox.x, width: selectionBox.width, height: selectionBox.height }}
      />
      <TableOfContents isOpenS={isTOCOpenS} />
    </UPage_>
  )
}

interface PageWrapper_ {
  pageRef: DivRef
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  fullWidth?: bool
  children: Children
}

function PageWrapper({ onMouseDown, pageRef, fullWidth, children }: PageWrapper_) {
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

function useCreateAndDeletePages(workspace: WS, id: str, color: str) {
  const deleteUPage = useDeleteUPage(workspace, { skipRootDeletion: true })
  const [pagesToDelete, setPagesToDelete] = useState<strs>([])
  useUpdateEffect(() => {
    if (pagesToDelete.length) {
      deletePagesIn(pagesToDelete, deleteUPage)
      setPagesToDelete([])
    }
  }, [pagesToDelete])
  const addNewUPage = useNewUPage(workspace)
  const [pageToCreate, setPageToCreate] = useState('')
  useUpdateEffect(() => {
    if (pageToCreate) {
      addNewUPage(pageToCreate, id, findUpage(pageToCreate), color)
      setPageToCreate('')
    }
  }, [pageToCreate]) // to current get id and color

  useMount(() => {
    setActions({ deletePages: setPagesToDelete, createPage: setPageToCreate })
  })
}

function useSelectablePage() {
  const { selectionD } = useUPageSelection()
  const ref = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<HTMLDivElement>(null)
  const [isSelectionActive, setIsSelectionActive] = useState(false)

  useEffect(() => {
    if (isSelectionActive) {
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

        selectionBox = { ...old, x, y, width, height, pageX: e.pageX, pageY }
        const style = safe(selectionRef.current).style
        style.height = height + 'px'
        style.width = width + 'px'
        style.left = x + 'px'
        style.top = y + 'px'
      }

      window.addEventListener('mousemove', onMove)
      selectionBox.cleanUp = () => {
        safe(selectionRef.current).style.height = '0'
        selectionBox = new Selection()
        window.removeEventListener('mousemove', onMove)
      }
    } else {
      selectionD({ a: 'mouse-up' })
      selectionBox.cleanUp()
    }
  }, [isSelectionActive])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const scrollTop = safe(ref.current).scrollTop
    selectionD({ a: 'mouse-down' })
    selectionBox = {
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

  return {
    upageRef: ref,
    pageRef: ref2,
    onMouseDown,
    setIsSelectionActive,
    isSelectionActive,
    selectionRef,
  }
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

let selectionBox = new Selection()

const UPage_ = styled(Box, { label: 'UPage' })({
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
