import { Button, Stack, styled } from '@mui/material'
import randomColor from 'randomcolor'
import { bool, Fn, str, strs } from '../../../utils/types'
import { useIsSM, useReactive } from '../../utils/hooks/hooks'
import { useRouter } from '../../utils/hooks/useRouter'
import { useShowAppBar } from '../../application/navigation/AppBar/AppBar'
import { isIndexableBLock, UBlockDTO, UBlockType } from '../types'
import { UBlocksSet, useUBlocks } from './UBlocksSet/UBlocksSet'
import { ReactComponent as WaveSVG } from './wave.svg'
import { uuid } from '../../../utils/uuid'
import { WS } from '../../application/navigation/workspace'
import { useSetData } from '../../../fb/useData'
import { useEffect, useState } from 'react'
import { TOCItems } from './TableOfContents/types'
import { TableOfContents } from './TableOfContents/TableOfContents'
import { useMap } from '../../utils/hooks/useMap'
import { safe } from '../../../utils/utils'

export interface UPageDataDTO {
  color: str
  name: str
  ids: strs
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
}
// readOnly fullWidth showToC (default true)
export function UPage({ workspace, setOpenTOC }: UPage) {
  const { location } = useRouter()
  const id = location.pathname.replace('/', '')
  const { ids, ublock, setUBlockData } = useUBlocks<UPageDTO, UPageDataDTO>(id)
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
    <PageWrapper alignItems="center">
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
      <Page>
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
      <TableOfContents data={tocMap.get(id) || []} isOpenS={isTOCOpenS} />
    </PageWrapper>
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

const PageWrapper = styled(Stack, { label: 'UPage' })({
  width: '100%',
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
})

const Page = styled('div')(({ theme }) => ({
  width: '85%',
  borderRadius: '2rem',

  [`${theme.breakpoints.up('sm')}`]: {
    width: '70%',
  },
}))

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
