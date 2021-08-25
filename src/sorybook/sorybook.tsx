import { combine } from '../utils/utils'
import { FC, useEffect, useRef, useState } from 'react'
import { useRouter } from '../components/utils/hooks/useRouter'
import { ThemeType, useUTheme } from '../theme'
import { useIsSM, useMount, useToggle } from '../components/utils/hooks/hooks'
import { bool, Fn, JSObjects, str, strs } from '../utils/types'
import { TreeItem, TreeView } from '@material-ui/lab'
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded'
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded'
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded'
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
} from '@material-ui/core'
import useCaseSVG from './useCase.svg'
import componentSVG from './component.svg'
import storySVG from './story.svg'
import { ReactComponent as LogoSVG } from './logo.svg'
import ModeNightRoundedIcon from '@material-ui/icons/ModeNightRounded'
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded'
import AutoFixHighRoundedIcon from '@material-ui/icons/AutoFixHighRounded'
import FullscreenRoundedIcon from '@material-ui/icons/FullscreenRounded'
import { storify } from './utils'

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
  toggleHighlight: Fn
}

function Menu({ themeType, toggleTheme, toggleFullscreen, toggleHighlight }: Menu_) {
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
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition>
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
                  <MenuItem onClick={combine(toggleTheme, handleClose)}>
                    <ListItemIcon>
                      {themeType === 'LIGHT' ? (
                        <ModeNightRoundedIcon fontSize="small" />
                      ) : (
                        <WbSunnyRoundedIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText>Set {themeType === 'LIGHT' ? 'Dark theme' : 'Light theme'}</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      CA+T
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={combine(toggleHighlight, handleClose)}>
                    <ListItemIcon>
                      <AutoFixHighRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Highlight</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      CA+H
                    </Shortcut>
                  </MenuItem>
                  <MenuItem onClick={combine(toggleFullscreen, handleClose)}>
                    <ListItemIcon>
                      <FullscreenRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Fullscreen story</ListItemText>
                    <Shortcut variant="body2" color="text.secondary">
                      CA+F
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
  toggleHighlight: Fn
}

function Nav({ trees, toggleHighlight }: Nav_) {
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
    if (event.key === 't') toggleTheme()
    else if (event.key === 'f') toggleFullscreen()
    else if (event.key === 'h') toggleHighlight()
  }

  useMount(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  if (isFullscreen) return null

  return (
    <NavBox>
      <Heading alignItems="center" justifyContent="center" direction="row" spacing={1}>
        <Logo />
        <SoryText>Sorybook</SoryText>
        <Menu
          themeType={themeType}
          toggleTheme={toggleTheme}
          toggleFullscreen={toggleFullscreen}
          toggleHighlight={toggleHighlight}
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
  fontWeight: 'bold',
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
  highlight: bool
}

function Pane({ Sory, highlight }: Pane_) {
  return (
    <ComponentWrapper alignItems="center" justifyContent="center">
      {highlight && (
        <Box sx={{ backgroundColor: 'lightgreen' }}>
          <Sory />
        </Box>
      )}
      {!highlight && <Sory />}
    </ComponentWrapper>
  )
}

const ComponentWrapper = styled(Stack)({
  width: '100%',
  height: '100%',
})

export type IdAndSory = Map<str, FC>

export interface SoryBook_ {
  trees: SoryTrees
  sories: IdAndSory
}

function SoryBook_({ trees, sories }: SoryBook_) {
  const [isHighlighted, toggleHighlight] = useToggle(false)
  const { location, history } = useRouter()
  const activeId = location.pathname.replace(_SORYBOOK + '/', '')

  useMount(() => {
    if (activeId !== '/_') return
    const firstStoryId = trees[0].children?.at(0)?.children?.at(0)?.id || ''
    history.push(_SORYBOOK + '/' + firstStoryId)
  })

  return (
    <Stack sx={{ height: '100%' }} direction="row">
      <NavBar trees={trees} toggleHighlight={toggleHighlight} />
      <Pane Sory={sories.get(activeId) || SORY} highlight={isHighlighted} />
    </Stack>
  )
}

interface SoryBook {
  sories: JSObjects
}
export function SoryBook({ sories }: SoryBook) {
  return <SoryBook_ {...storify(sories)} />
}
