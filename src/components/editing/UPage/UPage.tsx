import { Box, Button, Stack, styled, Typography } from '@material-ui/core'
import randomColor from 'randomcolor'
import { useRef, useState, KeyboardEvent } from 'react'
import ContentEditable from 'react-contenteditable'
import { bool, str, strs } from '../../../utils/types'
import { useReactive } from '../../utils/hooks/hooks'
import { setData } from '../../utils/hooks/useData'
import { useRefCallback } from '../../utils/hooks/useRefCallback'
import { useRouter } from '../../utils/hooks/useRouter'
import { useShowAppBar } from '../../application/navigation/Crumbs/AppBar'
import { apm } from '../../application/theming/theme'
import { UBlockB, UComponentType } from '../types'
import { UBlocksSet, useUBlocks } from './UBlocksSet/UBlocksSet'
import { ReactComponent as WaveSVG } from './wave.svg'

const PageWrapper = styled(Stack, { label: 'UPage' })({
  width: '100%',
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
})

const Page = styled('div')(({ theme }) => ({
  width: '85%',
  borderRadius: '2rem',
  backgroundColor: apm(theme),

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
  // height: '20%',

  ':hover .MuiButton-root': {
    opacity: 1,
  },
}))

export interface UPageDataDTO {
  color: str
  name: str
  ids: strs
}

export interface UPageDTO {
  data: UPageDataDTO
  isDeleted?: bool
  readonly?: bool
}

export function UPage() {
  // const c = randomColor({ luminosity: 'bright' })
  const { location } = useRouter()
  const id = location.pathname.replace('/', '')
  const { idsS, ublock, setUBlockData } = useUBlocks<UPageDTO, UPageDataDTO>(id)

  const [color, setColor] = useReactive(ublock.data.color)
  const [name, setName] = useReactive(ublock.data.name)
  const ref = useRef<HTMLDivElement>(null)
  const { showAppBar, hideAppBar } = useShowAppBar()

  const onChange = useRefCallback((e) => setName(e.target.value))
  const onBlur = useRefCallback(() => {
    setUBlockData({ ...ublock.data, name })
  }, [name])

  const onKeyDown = useRefCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        ref.current?.blur()
      }
    },
    [ref],
  )

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
        <Editable
          innerRef={ref}
          html={name}
          tagName="h1"
          onBlur={onBlur}
          onChange={onChange}
          role="textbox"
          onKeyDown={onKeyDown}
          data-cy="page-name"
        />
        <UBlocksSet idsS={idsS} readonly={false} />
      </Page>
    </PageWrapper>
  )
}

const Editable = styled(ContentEditable, { label: 'ContentEditable ' })(({ theme }) => ({
  outline: 'none',
  margin: 0,
  marginBottom: '1rem',
  fontSize: '1.75rem',
  fontFamily: theme.typography.fontFamily,
  overflowWrap: 'break-word',
  whiteSpace: 'pre-line',
  fontWeight: 900,

  [`${theme.breakpoints.up('sm')}`]: {
    marginBottom: '2rem',
    fontSize: '3.5rem',
  },
}))
