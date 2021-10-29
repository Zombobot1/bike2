import { all } from '../utils/utils'
import { FC, useEffect, useRef, useState } from 'react'
import { useRouter } from '../components/utils/hooks/useRouter'
import { ThemeType, useUTheme } from '../components/application/theming/theme'
import { useIsSM, useMount, useToggle } from '../components/utils/hooks/hooks'
import { bool, Fn, JSObjects, str, strs } from '../utils/types'
import { TreeItem, TreeView } from '@mui/lab'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import {
  alpha,
  Box,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  styled,
  SwipeableDrawer,
  Typography,
  useTheme,
} from '@mui/material'
import useCaseSVG from './useCase.svg'
import componentSVG from './component.svg'
import storySVG from './story.svg'
import { ReactComponent as LogoSVG } from './logo.svg'
import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import { storify } from './utils'
import { ErrorBoundary } from 'react-error-boundary'
import { FetchingState } from '../components/utils/Fetch/FetchingState/FetchingState'
import { FSProvider } from '../fb/fs'
import { useLocalStorage } from '../components/utils/hooks/useLocalStorage'

export const _SORYBOOK = '/_stories'
const SORY: FC = () => null

export interface SoryTree {
  id: str
  name: str
  children?: SoryTree[]
}
export type SoryTrees = SoryTree[]

function SoryTree({ id, name, children }: SoryTree) {
  const { history } = useRouter()
  const depth = id.split('--').length
  let sx = useCaseSX
  if (depth === 2) sx = componentSX
  else if (depth === 3) sx = storySX

  if (!children) return <TreeItem sx={sx} nodeId={id} label={name} onClick={() => history.push(_SORYBOOK + '/' + id)} />
  return (
    <TreeItem sx={sx} nodeId={id} label={name}>
      {children.map((c) => (
        <SoryTree key={c.id} {...c} />
      ))}
    </TreeItem>
  )
}

function svgSX(width: str, icon: str) {
  return {
    '& > .MuiTreeItem-content': {
      '.MuiTreeItem-label:before': {
        content: `url(${icon})`,
        display: 'inline-block',
        marginRight: '6px',
        width,
        height: width,
      },
    },
  }
}

const useCaseSX = svgSX('12px', useCaseSVG)
const componentSX = svgSX('10px', componentSVG)
const storySX = svgSX('7px', storySVG)

interface Menu_ {
  themeType: ThemeType
  toggleTheme: Fn
  toggleFullscreen: Fn
  toggleOutline: Fn
  rerenderStory: Fn
  navRef: React.MutableRefObject<HTMLElement | undefined>
}

function Menu({ themeType, toggleTheme, toggleFullscreen, toggleOutline, rerenderStory, navRef }: Menu_) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle}>
        <MoreHorizRoundedIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} container={navRef.current} placement="bottom-start" transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={all(toggleTheme, handleClose)}>
                    <ListItemIcon>
                      {themeType === 'light' ? (
                        <ModeNightRoundedIcon fontSize="small" />
                      ) : (
                        <WbSunnyRoundedIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText>Set {themeType === 'light' ? 'Dark theme' : 'Light theme'}</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      CA+T
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(toggleOutline, handleClose)}>
                    <ListItemIcon>
                      <AutoFixHighRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Outline</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      CA+O
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(toggleFullscreen, handleClose)}>
                    <ListItemIcon>
                      <FullscreenRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Fullscreen story</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      CA+F
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(rerenderStory, handleClose)}>
                    <ListItemIcon>
                      <AutorenewRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rerender story</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      CA+R
                    </Shortcut>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

const Shortcut = styled(Typography)({
  marginLeft: '0.75rem',
})

interface Nav_ {
  trees: SoryTrees
  toggleOutline: Fn
  rerenderStory: Fn
}

function Nav({ trees, toggleOutline, rerenderStory }: Nav_) {
  const ref = useRef<HTMLElement>()
  const [isFullscreen, toggleFullscreen] = useToggle(false)
  const { location } = useRouter()
  const pathIds = location.pathname.replace('/_stories/', '').split('--')
  const ids = pathIds[0]
    ? [`${pathIds[0]}`, `${pathIds[0]}--${pathIds[1]}`, `${pathIds[0]}--${pathIds[1]}--${pathIds[2]}`]
    : []

  const [expanded, setExpanded] = useState<strs>([])
  const [selected, setSelected] = useState<strs>([])

  useEffect(() => {
    if (!ids.length) return
    setExpanded((old) => [...old, ...ids])
    setSelected([ids[2]])
  }, [JSON.stringify(ids)])

  const { toggleTheme, themeType } = useUTheme()

  function handleKeyDown(event: KeyboardEvent) {
    if (!event.ctrlKey || !event.altKey) return
    if ('t†'.includes(event.key)) toggleTheme()
    else if ('fƒ'.includes(event.key)) toggleFullscreen()
    else if ('oø'.includes(event.key)) toggleOutline()
    else if ('r®'.includes(event.key)) rerenderStory()
  }

  useMount(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  if (isFullscreen) return null

  return (
    <NavBox ref={ref}>
      <Heading alignItems="center" justifyContent="center" direction="row" spacing={1}>
        <Logo />
        <SoryText>Sorybook</SoryText>
        <Menu
          themeType={themeType}
          toggleTheme={toggleTheme}
          toggleFullscreen={toggleFullscreen}
          toggleOutline={toggleOutline}
          rerenderStory={rerenderStory}
          navRef={ref}
        />
      </Heading>
      <Tree
        aria-label="controlled"
        defaultCollapseIcon={<Down />}
        defaultExpandIcon={<Right />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={(_, nodeIds) => setExpanded(nodeIds)}
      >
        {trees.map((t) => (
          <SoryTree key={t.id} {...t} />
        ))}
      </Tree>
    </NavBox>
  )
}

const Tree = styled(TreeView)({
  '.MuiTreeItem-label': {
    fontSize: '0.9rem !important',
    paddingTop: '0.2rem',
    paddingBottom: '0.2rem',
  },
  '.MuiTreeItem-iconContainer': {
    width: '0 !important',
  },
})

const NavBox = styled(Box)(({ theme }) => ({
  minWidth: '15rem',
  maxWidth: '15rem',
  paddingLeft: '0.25rem',
  zIndex: 1000,
  backgroundColor: theme.palette.background.default,
  borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}))

const Down = styled(ArrowDropDownRoundedIcon)(({ theme }) => ({
  color: alpha(theme.palette.primary.main, 0.5),
  marginRight: '0.2rem',
  marginBottom: '0.12rem',
}))

const Right = styled(ArrowRightRoundedIcon)(({ theme }) => ({
  color: alpha(theme.palette.primary.main, 0.5),
  marginRight: '0.2rem',
  marginBottom: '0.12rem',
}))

const SoryText = styled(Typography)({
  fontWeight: 600,
  fontSize: '1.5rem',
})

const Logo = styled(LogoSVG)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  '.s': {
    fill: theme.palette.secondary.main,
  },
  '.bg': {
    fill: theme.palette.primary.main,
  },
}))

const Heading = styled(Stack)({
  padding: '1rem',
})

function NavBar(props: Nav_) {
  const isDesktop = useIsSM()
  const [isOpen, setIsOpen] = useState(false)
  if (isDesktop) return <Nav {...props} />

  const toggleDrawer = (open: bool) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setIsOpen(open)
  }

  return (
    <SwipeableDrawer anchor="right" open={isOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Nav {...props} />
    </SwipeableDrawer>
  )
}

interface Pane_ {
  Sory: FC
  soryId: str
  outline: bool
}

// provider is used to suppress warning when switching e.g. from upage to fetch with initial data (upage will be updated because it is not unmounted yet?!)
function Pane({ Sory, outline, soryId }: Pane_) {
  const theme = useTheme()
  return (
    <ComponentWrapper
      alignItems="center"
      sx={
        outline
          ? { '*': { outline: `1px solid ${theme.palette.mode === 'dark' ? 'rgb(90 48 11)' : 'rgb(221 223 230)'}` } }
          : {}
      }
    >
      <ErrorBoundary fallbackRender={({ error }) => <FetchingState message={error.message} />}>
        <FSProvider key={soryId}>
          <Sory />
        </FSProvider>
      </ErrorBoundary>
    </ComponentWrapper>
  )
}

const ComponentWrapper = styled(Stack, { label: 'Pane' })({
  width: '100%',
  height: '100%',
  overflowY: 'auto',

  ':after': {
    content: '""',
    margin: 'auto',
  },

  ':before': {
    content: '""',
    margin: 'auto',
  },
})

export type IdAndSory = Map<str, FC>

export interface SoryBook_ {
  trees: SoryTrees
  sories: IdAndSory
}

function SoryBook_({ trees, sories }: SoryBook_) {
  const [counter, setCounter] = useState(0)
  const rerenderStory = () => setCounter((old) => old + 1)
  const [isOutlined, setIsOutlined] = useLocalStorage('sorybook-outlined', false)
  const toggleOutline = () => setIsOutlined((o) => !o)
  const { location, history } = useRouter()
  const activeId = location.pathname.replace(_SORYBOOK + '/', '')

  useMount(() => {
    if (activeId !== '/') return
    const firstStoryId = trees[0].children?.at(0)?.children?.at(0)?.id || ''
    history.push(_SORYBOOK + '/' + firstStoryId)
  })

  return (
    <Stack sx={{ height: '100%' }} direction="row">
      <NavBar trees={trees} toggleOutline={toggleOutline} rerenderStory={rerenderStory} />
      <Pane key={counter} Sory={sories.get(activeId) || SORY} outline={isOutlined} soryId={activeId} />
    </Stack>
  )
}

interface SoryBook {
  sories: JSObjects
}
export function SoryBook({ sories }: SoryBook) {
  return <SoryBook_ {...storify(sories)} />
}
