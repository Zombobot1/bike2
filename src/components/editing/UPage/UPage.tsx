import { Box, Button, Stack, styled, Typography } from '@mui/material'
import randomColor from 'randomcolor'
import { useRef, useState, KeyboardEvent } from 'react'
import ContentEditable from 'react-contenteditable'
import { bool, JSObjectStr, str, strs } from '../../../utils/types'
import { useMount, useReactive } from '../../utils/hooks/hooks'
import { useRefCallback } from '../../utils/hooks/useRefCallback'
import { useRouter } from '../../utils/hooks/useRouter'
import { useShowAppBar } from '../../application/navigation/AppBar/AppBar'
import { _apm } from '../../application/theming/theme'
import { UBlockB, UBlockDTO, UComponentType } from '../types'
import { UBlocksSet, useDeleteUPage, useUBlocks } from './UBlocksSet/UBlocksSet'
import { ReactComponent as WaveSVG } from './wave.svg'
import { uuid } from '../../../utils/uuid'
import { WS } from '../../application/navigation/workspace'
import { useSetData } from '../../../fb/useData'

export interface UPageDataDTO {
  color: str
  name: str
  ids: strs
}

export interface UPageDTO {
  type: UComponentType
  data: UPageDataDTO
  isDeleted?: bool
  readonly?: bool
}

export interface UPage {
  workspace: WS
}

export function UPage({ workspace }: UPage) {
  const { location } = useRouter()
  const id = location.pathname.replace('/', '')
  const { ids, ublock, setUBlockData } = useUBlocks<UPageDTO, UPageDataDTO>(id)
  const addNewUPage = useNewUPage(workspace)

  const [color, setColor] = useReactive(ublock.data.color)
  const [name] = useReactive(ublock.data.name)
  const { showAppBar, hideAppBar } = useShowAppBar()

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
        />
      </Page>
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
  backgroundColor: _apm(theme),

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

const ColoredBox = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',

  ':hover .MuiButton-root': {
    opacity: 1,
  },

  svg: {
    display: 'block',
  },
}))
