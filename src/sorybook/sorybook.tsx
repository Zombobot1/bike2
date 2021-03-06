import { all, safe } from '../utils/utils'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { ThemeType, useUTheme } from '../components/application/theming/theme'
import { useIsSM, useMount } from '../components/utils/hooks/hooks'
import { bool, f, Fn, JSObjects, str, strs } from '../utils/types'
import { TreeItem, TreeView } from '@mui/lab'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import {
  Alert,
  alpha,
  Box,
  Button,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Snackbar,
  Stack,
  styled,
  SwipeableDrawer,
  Typography,
  useTheme,
} from '@mui/material'
import useCaseSVG from './icons/useCase.svg'
import componentSVG from './icons/component.svg'
import storySVG from './icons/story.svg'
import { ReactComponent as LogoSVG } from './icons/logo.svg'
import { ReactComponent as DBOnI } from './icons/dbOn.svg'
import { ReactComponent as DBOffI } from './icons/dbOff.svg'
import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded'
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded'
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded'
import { storify } from './utils'
import { ErrorBoundary } from 'react-error-boundary'
import { FetchingState } from '../components/utils/Fetch/FetchingState/FetchingState'
import { FSProvider } from '../fb/firestore'
import { useLocalStorage } from '../components/utils/hooks/useLocalStorage'
import { Provider } from 'jotai'
import useUpdateEffect from '../components/utils/hooks/useUpdateEffect'
import { mockBackend, useFirestoreData } from '../fb/useData'
import { _getMockFB, _setMockFB } from '../fb/utils'

const SORY: FC = () => {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>Story not found</Typography>
      <Button onClick={triggerOpenFirstStory} variant="outlined">
        Go to first story
      </Button>
    </Stack>
  )
}

export interface SoryTree {
  id: str
  name: str
  children?: SoryTree[]
}
export type SoryTrees = SoryTree[]

function SoryTree({ id, name, children }: SoryTree) {
  const { navigate } = useCutNavigate()
  const depth = id.split('--').length
  let sx = useCaseSX
  if (depth === 2) sx = componentSX
  else if (depth === 3) sx = storySX

  if (!children) return <TreeItem sx={sx} nodeId={id} label={name} onClick={() => navigate(id)} />
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
  pinNav: bool
  togglePinNav: Fn
  themeType: ThemeType
  toggleTheme: Fn
  toggleFullscreen: Fn
  toggleOutline: Fn
  rerenderStory: Fn
  goNext: Fn
  goPrev: Fn
  navRef: React.MutableRefObject<HTMLElement | undefined>
}

function Menu(ps: Menu_) {
  const { themeType, toggleTheme, navRef, pinNav } = ps
  const { toggleFullscreen, toggleOutline, rerenderStory, goNext, goPrev, togglePinNav } = ps
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [delayResponses, setDelayResponses] = useLocalStorage('sorybook-delayResponses', false)

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

  const mockFB = _getMockFB()

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle}>
        <MoreHorizRoundedIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} container={navRef.current} placement="top-end" transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top',
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
                  <MenuItem
                    onClick={all(
                      () => _setMockFB(!mockFB),
                      () => location.reload(),
                    )}
                  >
                    <ListItemIcon>{mockFB ? <DBOn /> : <DBOff />}</ListItemIcon>
                    <ListItemText>{mockFB ? 'Connect to FB' : 'Disconnect from FB'}</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={all(() => setDelayResponses((o) => !o), handleClose)}>
                    <ListItemIcon>
                      <MoreTimeRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{delayResponses ? 'Do not delay responses' : 'Delay responses'}</ListItemText>
                  </MenuItem>
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
                      ?????? T
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(toggleOutline, handleClose)}>
                    <ListItemIcon>
                      <AutoFixHighRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Outline</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      ?????? O
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(toggleFullscreen, handleClose)}>
                    <ListItemIcon>
                      <FullscreenRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Fullscreen story</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      ?????? F
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(rerenderStory, handleClose)}>
                    <ListItemIcon>
                      <AutorenewRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rerender story</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      ?????? R
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(rerenderStory, goNext)}>
                    <ListItemIcon>
                      <KeyboardArrowDownRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Next story</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      ?????? ???
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(rerenderStory, goPrev)}>
                    <ListItemIcon>
                      <KeyboardArrowUpRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Prev story</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      ?????? ???
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={all(rerenderStory, togglePinNav)}>
                    <ListItemIcon>
                      <PushPinRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{pinNav ? 'Unpin nav' : 'Pin nav'}</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      ?????? U
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

const DBOn = () => <DBOnI style={{ width: '24px' }} />
const DBOff = () => <DBOffI style={{ width: '24px' }} />

const Shortcut = styled(Typography)({
  marginLeft: '0.75rem',
})

interface Nav_ {
  trees: SoryTrees
  toggleOutline: Fn
  rerenderStory: Fn
  isFullscreen: bool
  toggleFullscreen: Fn
  pinNav: bool
  togglePinNav: Fn
  goNext: Fn
  goPrev: Fn
  soryId: str
}

function Nav(ps: Nav_) {
  const { trees, isFullscreen, soryId } = ps
  const ref = useRef<HTMLElement>()

  const pathIds = soryId.split('--')
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

  if (isFullscreen) return null

  return (
    <NavBox ref={ref}>
      <Heading alignItems="center" justifyContent="center" direction="row" spacing={1}>
        <Logo />
        <SoryText>Sorybook</SoryText>
        <Menu {...ps} themeType={themeType} toggleTheme={toggleTheme} navRef={ref} />
      </Heading>
      <Tree
        aria-label="controlled"
        defaultCollapseIcon={<Down />}
        defaultExpandIcon={<Right />}
        expanded={expanded}
        selected={selected}
        // disableSelection={true} anomaly: doesn't work. replace whole tree by your own
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

const NavBox = styled(Box, { label: 'NavBox' })(({ theme }) => ({
  height: '100%',
  minWidth: '15rem',
  maxWidth: '15rem',
  paddingLeft: '0.25rem',
  zIndex: 1000,
  overflowY: 'auto',
  backgroundColor: theme.palette.background.default,
  borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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

interface NavBar_ {
  trees: SoryTrees
  pinNav: bool
  togglePinNav: Fn
  toggleOutline: Fn
  rerenderStory: Fn
  goNext: Fn
  goPrev: Fn
  soryId: str
}

function NavBar(ps: NavBar_) {
  const isDesktop = useIsSM()
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useLocalStorage('sorybook-full-screen', false)

  const toggleFullscreen = () => setIsFullscreen((old) => !old)
  const { toggleTheme } = useUTheme()
  const navPs = { ...ps, isFullscreen, toggleFullscreen }

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

  function handleKeyDown(e: KeyboardEvent) {
    if ((!e.ctrlKey && !e.metaKey) || !e.altKey) return
    if ('t???'.includes(e.key)) toggleTheme()
    else if ('f??'.includes(e.key)) {
      e.preventDefault()
      toggleFullscreen()
    } else if ('o??'.includes(e.key)) ps.toggleOutline()
    else if ('r??'.includes(e.key)) ps.rerenderStory()
  }

  useMount(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  if (isDesktop) return <Nav {...navPs} />

  return (
    <SwipeableDrawer anchor="right" open={isOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Nav {...navPs} />
    </SwipeableDrawer>
  )
}

type SoryRendered = { Sory: FC }
function SoryRendered({ Sory }: SoryRendered) {
  const backend = useFirestoreData()
  mockBackend(backend) // not on mount, otherwise suspense will crash
  return <Sory />
}

interface Pane {
  Sory: FC
  soryId: str
  outline: bool
}

const Pane = memo(_Pane, (prev, next) => prev.soryId === next.soryId && prev.outline === next.outline)
// provider is used to suppress warning when switching e.g. from upage to fetch with initial data (upage will be updated because it is not unmounted yet?!)
function _Pane({ Sory, outline, soryId }: Pane) {
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
      <ErrorBoundary fallbackRender={({ error }) => <FetchingState error={error} />}>
        <Provider key={soryId}>
          <FSProvider>
            <SoryRendered Sory={Sory} />
          </FSProvider>
        </Provider>
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
  const [pinNav, setPinNav] = useLocalStorage('sorybook-pinNav', true)
  const [lastUsedStory, setLastUsedStory] = useLocalStorage('sorybook-last-used-story', '')
  const toggleOutline = () => {
    setIsOutlined((o) => !o)
  }
  const togglePinNav = () => setPinNav((o) => !o)
  const { location, navigate } = useCutRouter()

  const soryId = location.slice(1)

  const ids = treesToChildrenIds(trees)
  const [openSnack, setOpenSnack] = useState(false)

  const [openFirstStoryTrigger, setOpenFirstStoryTrigger] = useState(0)

  triggerOpenFirstStory = () => setOpenFirstStoryTrigger((o) => o + 1)

  useEffect(() => {
    if (!openFirstStoryTrigger) return

    if (lastUsedStory) return navigate(lastUsedStory)
    const firstStoryId = trees[0].children?.at(0)?.children?.at(0)?.id || ''
    if (firstStoryId) navigate(firstStoryId)
  }, [openFirstStoryTrigger])

  useUpdateEffect(() => setOpenSnack(true), [counter])

  useEffect(() => {
    if (!soryId) return
    if (sories.has(soryId)) setLastUsedStory(soryId)
  }, [soryId])

  const goNext = () => navigate(getNextStory(soryId, ids))
  const goPrev = () => navigate(getPrevStory(soryId, ids))

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((!e.ctrlKey && !e.metaKey) || !e.altKey) return

      let activated = true // Dead prevents default chrome action CA+U
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) goNext()
      else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) goPrev()
      else if (['u', '??', 'Dead'].includes(e.key)) togglePinNav()
      else activated = false

      if (activated) e.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [JSON.stringify(ids), soryId])

  useMount(() => {
    if (!soryId) triggerOpenFirstStory()
  })

  const ps = { toggleOutline, rerenderStory, goNext, goPrev, pinNav, togglePinNav, trees, soryId }

  const [showNav, setShowNav] = useState(false)

  useMount(() => {
    const onMove = (e: MouseEvent) => {
      const show = window.innerWidth - e.clientX < 40
      setShowNav((old) => {
        if (old && !show) return false
        if (!old && show) return true
        return old
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  })

  const sx = showNav ? { transform: 'translateX(0)' } : {}

  return (
    <>
      {!pinNav && (
        <Box sx={{ height: '100%', width: '100%', position: 'relative', overflowX: 'hidden' }}>
          <Pane key={counter} Sory={sories.get(soryId) || SORY} outline={isOutlined} soryId={soryId} />
          <NavMover sx={sx}>
            <NavBar {...ps} />
          </NavMover>
        </Box>
      )}
      {pinNav && (
        <Stack sx={{ height: '100%' }} direction="row">
          <Pane key={counter} Sory={sories.get(soryId) || SORY} outline={isOutlined} soryId={soryId} />
          <NavBar {...ps} />
        </Stack>
      )}
      <Snackbar open={openSnack} autoHideDuration={1000} onClose={() => setOpenSnack(false)}>
        <Alert severity="info" sx={{ width: '100%' }}>
          Rerendered!
        </Alert>
      </Snackbar>
    </>
  )
}

const NavMover = styled(Box)(({ theme }) => ({
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  transform: 'translateX(100%)',
  transition: theme.tra('transform', '.1'),
  ':hover': {
    transform: 'translateX(0)',
  },
  zIndex: 999,
}))

interface SoryBook {
  sories: JSObjects
  sections: strs
}
export function SoryBook({ sories, sections }: SoryBook) {
  return <SoryBook_ {...storify(sories, sections)} />
}

function bfs(node: SoryTree): strs {
  const queue = [...(node.children ? node.children : [])]
  const r: strs = [node.id]

  while (queue.length) {
    const node = safe(queue.shift())
    if (node?.children) queue.push(...node.children)
    r.push(node.id)
  }

  return r
}

function treesToChildrenIds(nodes: SoryTrees): strs {
  return nodes
    .map(bfs)
    .flat()
    .filter((id) => id.match(/--/gm)?.length === 2)
}

function getNextStory(id: str, ids: strs): str {
  const i = ids.indexOf(id)
  if (i === ids.length || i === -1) return id
  return ids[i + 1]
}

function getPrevStory(id: str, ids: strs): str {
  const i = ids.indexOf(id)
  if (i < 1) return id
  return ids[i - 1]
}

function useCutLocation() {
  const [cutLocation, setCutLocation] = useState(location.pathname)

  useMount(() => {
    const onChange = () => setCutLocation(location.pathname)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  })

  return { location: cutLocation }
}

function useCutNavigate() {
  return {
    navigate: (url: str) => {
      const r = location.protocol + url
      history.replaceState(null, '', r)
      dispatchEvent(new PopStateEvent('popstate', { state: null }))
    },
  }
}

function useCutRouter() {
  return { ...useCutLocation(), ...useCutNavigate() }
}

let triggerOpenFirstStory = f
