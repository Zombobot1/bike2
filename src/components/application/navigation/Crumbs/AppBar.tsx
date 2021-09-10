import {
  Stack,
  IconButton,
  styled,
  Button,
  alpha,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'
import { WS } from '../workspace'
import { NavNodeDTOs } from '../NavBar/NavTree'
import { Fragment, useRef, useState } from 'react'
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded'
import StarRoundedIcon from '@material-ui/icons/StarRounded'
import { atom, useAtom } from 'jotai'
import { apm } from '../../theming/theme'
import { bool, Fn, num, SetStr, str } from '../../../../utils/types'
import { useIsSM } from '../../../utils/hooks/hooks'
import { useRouter } from '../../../utils/hooks/useRouter'
import { safeSplit } from '../../../../utils/algorithms'
import { combine, cut } from '../../../../utils/utils'
import { AcceptRemovalDialog } from '../../../utils/AcceptRemovalDialog'

export interface AppBar {
  workspace: WS
  openNavBar: Fn
}

const AppBar_ = styled(Stack, { label: 'AppBar' })(({ theme }) => ({
  position: 'sticky',
  top: 0,
  borderBottom: `solid 1px ${apm(theme, 'BORDER')}`,
  zIndex: 2,
  backgroundColor: theme.palette.background.paper,
  transition: 'opacity 0.3s ease-in-out',

  [`${theme.breakpoints.up('sm')}`]: {
    border: 'unset',
    padding: '0.5rem 1rem',
    opacity: 0,
    ':hover': {
      opacity: 1,
    },
  },
}))

export function AppBar({ workspace, openNavBar }: AppBar) {
  const isSM = useIsSM()
  const [showAppBar] = useAtom(showAppBarA)
  const { location, history } = useRouter()
  const showUPageOptions = !location.pathname.includes('/study')

  return (
    <AppBar_ direction="row" alignItems="center" sx={showAppBar ? { opacity: '1 !important' } : {}}>
      {!isSM && (
        <IconButton color="primary" onClick={openNavBar}>
          <MenuRoundedIcon />
        </IconButton>
      )}
      <Crumbs workspace={workspace} />
      {showUPageOptions && <UPageOptions history={history} path={location.pathname} workspace={workspace} />}
    </AppBar_>
  )
}

const showAppBarA = atom(false)
export function useShowAppBar() {
  const [_, setShowAppBar] = useAtom(showAppBarA)
  return { showAppBar: () => setShowAppBar(true), hideAppBar: () => setShowAppBar(false) }
}

const Btn = styled(Button)({
  textTransform: 'none',
})

const Separator = styled('span')(({ theme }) => ({
  color: apm(theme, 'SECONDARY'),
  fontSize: '1.3rem',
  [`${theme.breakpoints.up('sm')}`]: {
    fontSize: '1.5rem',
  },
}))

const CrumbsContainer = styled(Stack)(({ theme }) => ({
  width: '100%',

  '.MuiButton-root': {
    fontSize: '1.1rem',

    [`${theme.breakpoints.up('sm')}`]: {
      fontSize: '1.2rem',
    },
  },
}))

function crumbs(path: str, workspace: WS): NavNodeDTOs {
  const pathParts = safeSplit(path, '/')
  if (pathParts[0] === 'study') {
    const r = [{ id: '/study', name: 'Study' }]
    if (pathParts[1]) r.push(workspace.find(pathParts[1]))
    return r
  }
  if (pathParts[0] === 'teach') return [{ id: '/teach', name: 'Teach' }]
  if (pathParts[0] === 'tune') return [{ id: '/tune', name: 'Tune' }]

  return workspace.path(pathParts[0])
}

function cutAt(path: NavNodeDTOs, isLast: bool, isSM: bool): num {
  if (path.length > 2 && !isSM) return isLast ? 12 : 7
  if (path.length > 1 && !isSM) return isLast ? 18 : 9
  return 20
}

export function Crumbs({ workspace }: { workspace: WS }) {
  const isSM = useIsSM()
  const { location, history } = useRouter()

  const path = crumbs(location.pathname, workspace)
  const overflow = !isSM && path.length > 2
  const crop = (name: str, i: num) => cut(name, cutAt(path, i === path.length - 1, isSM))
  return (
    <CrumbsContainer direction="row" alignItems="center" spacing={1}>
      {!overflow &&
        path.map((node, i) => (
          <Fragment key={node.id}>
            <Btn onClick={() => history.push(node.id)} size="small">
              {crop(node.name, i)}
            </Btn>
            {i < path.length - 1 && <Separator>/</Separator>}
          </Fragment>
        ))}
      {overflow && (
        <>
          <Btn onClick={() => history.push(path[0].id)} size="small">
            {crop(path[0].name, 0)}
          </Btn>
          <Separator>/</Separator>
          <CollapsedLinks path={path} />
          <Separator>/</Separator>
          <Btn onClick={() => history.push(path.slice(-1)[0].id)} size="small">
            {crop(path.slice(-1)[0].name, path.length - 1)}
          </Btn>
        </>
      )}
    </CrumbsContainer>
  )
}

function CollapsedLinks({ path }: { path: NavNodeDTOs }) {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') setOpen(false)
  }
  const anchorRef = useRef<HTMLButtonElement>(null)
  const handleToggle = () => setOpen((prevOpen) => !prevOpen)
  const { history } = useRouter()

  return (
    <>
      <Btn size="small" ref={anchorRef} onClick={handleToggle} sx={{ minWidth: '2rem' }}>
        ...
      </Btn>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom" transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  {path.slice(1, -1).map((n) => (
                    <MenuItem key={n.id} onClick={combine(() => history.push('/' + n.id), handleClose)}>
                      <ListItemText>{n.name}</ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

function UPageOptions({ workspace, path, history }: { workspace: WS; path: str; history: { push: SetStr } }) {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') setOpen(false)
  }
  const anchorRef = useRef<HTMLButtonElement>(null)
  const handleToggle = () => setOpen((prevOpen) => !prevOpen)

  const isAlertOpenS = useState(false)
  const id = safeSplit(path, '/')[0]
  const isSM = useIsSM()

  return (
    <Stack direction="row" sx={{ marginLeft: 'auto !important' }}>
      <AcceptRemovalDialog
        text="Do you want to remove page?"
        isOpenS={isAlertOpenS}
        onAccept={() => history.push(workspace.delete(id))}
      />
      {isSM && (
        <IconButton onClick={workspace.triggerFavorite(id)}>
          {workspace.isFavorite(id) ? <StarRoundedIcon color="primary" /> : <StarOutlineRoundedIcon color="primary" />}
        </IconButton>
      )}
      <IconButton ref={anchorRef} onClick={handleToggle}>
        <MoreHorizRoundedIcon color="primary" />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={combine(() => isAlertOpenS[1](true), handleClose)}>
                    <ListItemIcon>
                      <DeleteRoundedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ color: 'error' }}>Delete page</ListItemText>
                  </MenuItem>
                  {!isSM && (
                    <MenuItem onClick={combine(workspace.triggerFavorite(id), handleClose)}>
                      <ListItemIcon>
                        {workspace.isFavorite(id) ? <StarRoundedIcon /> : <StarOutlineRoundedIcon />}
                      </ListItemIcon>
                      <ListItemText>{workspace.isFavorite(id) ? 'Remove from favorite' : 'Make favorite'}</ListItemText>
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  )
}
