import { Avatar, Box, Drawer, Fab, IconButton, Paper, Stack, styled, Typography, useTheme } from '@mui/material'

import { str, BoolState, SetStr } from '../../../../utils/types'
import { useIsSM } from '../../../utils/hooks/hooks'
import { NavLink, NavTree } from './NavTree'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded'
import SettingsIcon from '@mui/icons-material/Settings'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'

import { useShowAppBar } from '../AppBar/AppBar'
import { _apm } from '../../theming/theme'
import { useIsSignedIn, UserDTO } from '../../../../fb/auth'
import { WorkspaceNav } from '../../Workspace/WorkspaceState'
import { uuid } from '../../../../utils/wrappers/uuid'
import { UMenu, UMenuControls, UOption, useMenu } from '../../../utils/UMenu/UMenu'
import { useRouter } from '../../../utils/hooks/useRouter'
import { TUNE } from '../../App/pages'
import { useRef } from 'react'

interface Workspace {
  triggerOpen: SetStr
  triggerFavoriteOpen: SetStr
  addNew: SetStr
}

export interface NavBar {
  user: UserDTO
  navigation: WorkspaceNav
  workspace: Workspace
  isNavBarOpenS: BoolState
}

export function NavBar(props: NavBar) {
  const isSM = useIsSM()
  const theme = useTheme()
  const [isNavBarOpen, setIsNavBarOpen] = props.isNavBarOpenS
  const { showAppBar, hideAppBar } = useShowAppBar()
  const menu = useMenu()
  const sx = menu.isOpen ? { transform: 'translateX(-0.5rem) !important' } : {}
  return (
    <>
      {isSM && (
        <NavBarWrapper justifyContent="center">
          <Paper
            sx={{ ...sx, position: 'relative' }}
            elevation={theme.palette.mode === 'dark' ? 1 : 6}
            onMouseEnter={showAppBar}
            onMouseLeave={hideAppBar}
          >
            <NavBar_ {...props} menu={menu} />
          </Paper>
        </NavBarWrapper>
      )}
      {!isSM && (
        <Drawer
          sx={{ '.MuiPaper-root': { overflow: 'hidden !important' } }}
          anchor="left"
          open={isNavBarOpen}
          onClose={() => setIsNavBarOpen(false)}
        >
          <Box sx={{ padding: '1rem' }}>
            <NavBar_ {...props} menu={menu} />
          </Box>
        </Drawer>
      )}
    </>
  )
}

const NavBarWrapper = styled(Stack, { label: 'NavBar' })({
  height: '100%',
  width: '2.5rem',
  zIndex: 2,
  position: 'fixed',

  ':hover .MuiPaper-root': {
    transform: 'translateX(-0.5rem)',
  },

  '.MuiPaper-root': {
    height: '80vh',
    width: '20rem',
    padding: '1rem',
    paddingLeft: '1.8rem',
    paddingRight: '0',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(-20rem)',
    // transform: 'translateX(-0.5rem)',
    overflow: 'hidden',
  },
})

interface NavBar_ extends NavBar {
  menu: UMenuControls
}

function NavBar_({ user, workspace, navigation, menu }: NavBar_) {
  const { navigate } = useRouter()
  const { signOut } = useIsSignedIn()
  const theme = useTheme()

  const displayName = user.displayName || `Zombobot ${strShortHash(user.email || '')}`
  const sx = { color: _apm(theme, 'secondary') }
  const ref = useRef()
  return (
    <NavBox ref={ref}>
      <Stack spacing={3}>
        <Stack sx={{ paddingRight: '1rem' }} direction="row" alignItems="center">
          <IconButton ref={menu.btnRef} onClick={menu.toggleOpen} sx={{ transform: 'translateX(-0.5rem)' }}>
            <Avatar {...stringAvatar(displayName)} />
          </IconButton>
          <Typography sx={{ fontWeight: 600 }}>{displayName}</Typography>
        </Stack>
        <Stack spacing={1} sx={{ paddingRight: '1rem' }}>
          <NavLink name="Study" icon={<SchoolRoundedIcon sx={sx} />} />
          <NavLink name="Teach" icon={<BusinessCenterRoundedIcon sx={sx} />} />
          <NavLink name="Stats" icon={<InsertChartRoundedIcon sx={sx} />} />
        </Stack>
        <NavTrees workspace={workspace} navigation={navigation} />
      </Stack>
      <FAB onClick={() => workspace.addNew(uuid())} color="primary" sx={{ zIndex: 100 }}>
        <AddRoundedIcon />
      </FAB>
      <UMenu {...menu}>
        <UOption text="Settings" icon={SettingsIcon} onClick={() => navigate(TUNE)} />
        <UOption text="Log out" icon={ExitToAppRoundedIcon} onClick={signOut} />
      </UMenu>
    </NavBox>
  )
}

const NavBox = styled(Box)({
  '.MuiAvatar-root': {
    fontSize: '1.25rem', // if set inline it unsets color as well
  },
})

const FAB = styled(Fab)({
  position: 'absolute',
  bottom: '-0.5rem',
  right: '-0.5rem',
  boxShadow: 'unset',
})

function NavTrees({ workspace, navigation }: { navigation: WorkspaceNav; workspace: Workspace }) {
  return (
    <TreesBox>
      <main style={{ paddingRight: '1rem' }}>
        {navigation.favorite.length && (
          <Box sx={{ marginBottom: '1.5rem' }}>
            <Section color="text.secondary">Favorite</Section>
            <NavTree nodes={navigation.favorite} onOpen={(id) => workspace.triggerFavoriteOpen(id)} />
          </Box>
        )}
        {navigation.personal.length && (
          <div>
            <Section color="text.secondary">Workspace</Section>
            <NavTree nodes={navigation.personal} onOpen={(id) => workspace.triggerOpen(id)} />
          </div>
        )}
      </main>
    </TreesBox>
  )
}

const TreesBox = styled(Stack)(({ theme }) => ({
  overflowY: 'auto',
  maxHeight: '66vh',
  transition: 'background-color 0.3s ease-in-out',

  [`${theme.breakpoints.up('sm')}`]: {
    maxHeight: '56vh',

    '::-webkit-scrollbar': {
      width: '10px',
    },

    '::-webkit-scrollbar-thumb': {
      borderRadius: '7.5px',
      backgroundColor: _apm(theme, 0.15),
    },
  },
}))

const Section = styled(Typography)({
  textTransform: 'uppercase',
  fontWeight: 900,
  fontSize: '0.85rem',
  letterSpacing: '0.1rem',
})

const strHash = (s: str) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
const strShortHash = (s: str) => `${Math.abs(strHash(s))}`.slice(0, 6)

function strColor(string: str) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let r = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    r += `00${value.toString(16)}`.substr(-2)
  }

  return r
}

function stringAvatar(name: str) {
  return {
    sx: {
      bgcolor: strColor(name.slice(1)),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  }
}
