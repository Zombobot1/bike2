import {
  Stack,
  IconButton,
  styled,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ListItemText,
} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { Fragment, useRef, useState } from 'react'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded'
import { atom, useAtom } from 'jotai'
import { _apm } from '../../theming/theme'
import { bool, Fn, num, SetStr, str } from '../../../../utils/types'
import { useIsSM } from '../../../utils/hooks/hooks'
import { useRouter } from '../../../utils/hooks/useRouter'
import { safeSplit } from '../../../../utils/algorithms'
import { all, cut } from '../../../../utils/utils'
import { AcceptRemovalDialog } from '../../../utils/AcceptRemovalDialog'
import { UMenu, UOption, useMenu } from '../../../utils/UMenu/UMenu'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useUPageTriggers } from '../../../editing/UPage/useUPageInfo'
import { WorkspacePath } from '../../Workspace/types'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { useNavigate } from 'react-router'

interface Workspace {
  path: (id: str) => WorkspacePath
  isFavorite: (id: str) => bool
  triggerFavorite: (id: str) => void
  removeCurrent: (id: str, sgt: SetStr) => void
}

export interface AppBar {
  workspace: Workspace
  openNavBar: Fn
  openTOC?: Fn
}

export function AppBar({ workspace, openNavBar }: AppBar) {
  const isSM = useIsSM()
  const [showAppBar] = useAtom(showAppBarA)
  const { location } = useRouter()
  const showUPageOptions =
    !location.pathname.includes('/study') &&
    !location.pathname.includes('/stats') &&
    !location.pathname.includes('/teach') &&
    !location.pathname.includes('/settings')
  const { triggerOpenTOC, triggerTurnOffTOC, triggerFullWidth } = useUPageTriggers()
  return (
    <AppBar_ direction="row" alignItems="center" sx={showAppBar ? { opacity: '1 !important' } : {}}>
      {!isSM && (
        <IconButton color="primary" onClick={openNavBar}>
          <MenuRoundedIcon />
        </IconButton>
      )}
      <Crumbs workspace={workspace} />
      {showUPageOptions && (
        <UPageOptions
          path={location.pathname}
          workspace={workspace}
          openTOC={triggerOpenTOC}
          toggleFullWidth={triggerFullWidth}
          toggleTOC={triggerTurnOffTOC}
        />
      )}
    </AppBar_>
  )
}

const AppBar_ = styled(Stack, { label: 'AppBar' })(({ theme }) => ({
  position: 'sticky',
  top: 0,
  borderBottom: `solid 1px ${_apm(theme, 'border')}`,
  zIndex: 1000,
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

const showAppBarA = atom(false)
export function useShowAppBar() {
  const [_, setShowAppBar] = useAtom(showAppBarA)
  return { showAppBar: () => setShowAppBar(true), hideAppBar: () => setShowAppBar(false) }
}

const Btn = styled(Button)({
  textTransform: 'none',
})

const Separator = styled('span')(({ theme }) => ({
  color: _apm(theme, 'secondary'),
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

function crumbs(path: str, workspace: Workspace): WorkspacePath {
  const pathParts = safeSplit(path, '/')
  if (pathParts[0] === 'study') return [{ id: '/study', name: 'Study' }] // TODO: replace AppBar for study
  if (pathParts[0] === 'teach') return [{ id: '/teach', name: 'Teach' }]
  if (pathParts[0] === 'settings') return [{ id: '/settings', name: 'Settings' }]
  if (pathParts[0] === 'stats') return [{ id: '/stats', name: 'Stats' }]

  return workspace.path(pathParts[0])
}

function cutAt(path: WorkspacePath, isLast: bool, isSM: bool): num {
  if (path.length > 2 && !isSM) return isLast ? 12 : 7
  if (path.length > 1 && !isSM) return isLast ? 18 : 9
  return 20
}

export function Crumbs({ workspace }: { workspace: Workspace }) {
  const isSM = useIsSM()
  const { location, navigate } = useRouter()

  const path = crumbs(location.pathname, workspace)
  const overflow = !isSM && path.length > 2
  const crop = (name: str, i: num) => cut(name, cutAt(path, i === path.length - 1, isSM))
  return (
    <CrumbsContainer direction="row" alignItems="center" spacing={1}>
      {!overflow &&
        path.map((node, i) => (
          <Fragment key={node.id}>
            <Btn onClick={() => navigate('/' + node.id)} size="small" data-cy="ab-btn">
              {crop(node.name || 'Untitled', i)}
            </Btn>
            {i < path.length - 1 && <Separator>/</Separator>}
          </Fragment>
        ))}
      {overflow && (
        <>
          <Btn onClick={() => navigate('/' + path[0].id)} size="small" data-cy="ab-btn">
            {crop(path[0].name || 'Untitled', 0)}
          </Btn>
          <Separator>/</Separator>
          <CollapsedLinks path={path} />
          <Separator>/</Separator>
          <Btn onClick={() => navigate('/' + path.slice(-1)[0].id)} size="small" data-cy="ab-btn">
            {crop(path.slice(-1)[0].name || 'Untitled', path.length - 1)}
          </Btn>
        </>
      )}
    </CrumbsContainer>
  )
}

function CollapsedLinks({ path }: { path: WorkspacePath }) {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') setOpen(false)
  }
  const anchorRef = useRef<HTMLButtonElement>(null)
  const handleToggle = () => setOpen((prevOpen) => !prevOpen)
  const navigate = useNavigate()

  return (
    <>
      <Btn size="small" ref={anchorRef} onClick={handleToggle} sx={{ minWidth: '2rem' }} data-cy="...-btn">
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
                    <MenuItem key={n.id} onClick={all(() => navigate('/' + n.id), handleClose)} data-cy="...-page-btn">
                      <ListItemText>{n.name || 'Untitled'}</ListItemText>
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

interface UPageOptions_ {
  workspace: Workspace
  path: str
  toggleFullWidth: Fn
  toggleTOC: Fn
  openTOC?: Fn
}

function UPageOptions({ workspace, path, openTOC, toggleFullWidth, toggleTOC }: UPageOptions_) {
  const id = safeSplit(path, '/')[0]
  const navigate = useNavigate()
  const [goTo, setGoTo] = useState('')
  useUpdateEffect(() => navigate('/' + goTo), [goTo])

  const menuPs = useMenu()
  const isAlertOpenS = useState(false)

  const isSM = useIsSM()

  return (
    <Stack direction="row" sx={{ marginLeft: 'auto !important' }}>
      <AcceptRemovalDialog
        text="Do you want to remove page?"
        isOpenS={isAlertOpenS}
        onAccept={() => workspace.removeCurrent(id, setGoTo)}
      />
      {isSM && (
        <IconButton onClick={() => workspace.triggerFavorite(id)}>
          {workspace.isFavorite(id) ? <StarRoundedIcon color="primary" /> : <StarOutlineRoundedIcon color="primary" />}
        </IconButton>
      )}
      <IconButton ref={menuPs.btnRef} onClick={menuPs.toggleOpen}>
        <MoreHorizRoundedIcon color="primary" />
      </IconButton>
      <UMenu {...menuPs} disablePortal={true}>
        <UOption icon={DeleteRoundedIcon} text="Delete page" onClick={() => isAlertOpenS[1](true)} />
        {isSM && <UOption icon={SwapHorizIcon} text="Toggle full width" onClick={toggleFullWidth} />}
        {!isSM && (
          <UOption
            icon={workspace.isFavorite(id) ? StarRoundedIcon : StarOutlineRoundedIcon}
            text={workspace.isFavorite(id) ? 'Remove from favorite' : 'Make favorite'}
            onClick={() => workspace.triggerFavorite(id)}
          />
        )}
        {!isSM && openTOC && (
          <UOption icon={FormatAlignRightRoundedIcon} text="Show Table Of Contents" onClick={openTOC} />
        )}
        <UOption icon={FormatAlignRightRoundedIcon} text="Toggle Table Of Contents on / off" onClick={toggleTOC} />
      </UMenu>
    </Stack>
  )
}
