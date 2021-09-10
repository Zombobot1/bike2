import { alpha, Avatar, Box, Drawer, Fab, Paper, Stack, styled, Typography, useTheme } from '@material-ui/core'

import { str, BoolState } from '../../../../utils/types'
import { useIsSM } from '../../../utils/hooks/hooks'
import { NavLink, NavTree } from './NavTree'
import { User } from 'firebase/auth'
import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded'
import BusinessCenterRoundedIcon from '@material-ui/icons/BusinessCenterRounded'
import SettingsIcon from '@material-ui/icons/Settings'
import AddRoundedIcon from '@material-ui/icons/AddRounded'

import { WS } from '../workspace'
import { useShowAppBar } from '../Crumbs/AppBar'
import { apm } from '../../theming/theme'

export interface NavBar {
  user: User
  workspace: WS
  isNavBarOpenS: BoolState
}

export function NavBar(props: NavBar) {
  const isSM = useIsSM()
  const theme = useTheme()
  const [isNavBarOpen, setIsNavBarOpen] = props.isNavBarOpenS
  const { showAppBar, hideAppBar } = useShowAppBar()
  return (
    <>
      {isSM && (
        <NavBarWrapper justifyContent="center">
          <Paper
            sx={{ position: 'relative' }}
            elevation={theme.palette.mode === 'dark' ? 1 : 3}
            onMouseEnter={showAppBar}
            onMouseLeave={hideAppBar}
          >
            <NavBar_ {...props} />
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
            <NavBar_ {...props} />
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
    overflow: 'hidden',
  },
})

function NavBar_({ user, workspace }: NavBar) {
  const displayName = user.displayName || `Zombobot ${strShortHash(user.email || '')}`
  const theme = useTheme()
  const sx = { color: apm(theme, 'SECONDARY') }
  return (
    <NavBox>
      <Stack spacing={3}>
        <Stack spacing={1} sx={{ paddingRight: '1rem' }} direction="row" alignItems="center">
          <Avatar {...stringAvatar(displayName)} />
          <Typography sx={{ fontWeight: 600 }}>{displayName}</Typography>
        </Stack>
        <Stack spacing={1} sx={{ paddingRight: '1rem' }}>
          <NavLink name="Study" icon={<SchoolRoundedIcon sx={sx} />} />
          <NavLink name="Teach" icon={<BusinessCenterRoundedIcon sx={sx} />} />
          <NavLink name="Tune" icon={<SettingsIcon sx={sx} />} />
        </Stack>
        <NavTrees workspace={workspace} />
      </Stack>
      <FAB color="primary" sx={{ zIndex: 100 }}>
        <AddRoundedIcon />
      </FAB>
    </NavBox>
  )
}

const NavBox = styled(Box)(({ theme }) => ({
  '.MuiAvatar-root': {
    fontSize: 'unset', // if set inline it unsets color as well
  },
}))

const FAB = styled(Fab)({
  position: 'absolute',
  bottom: '-0.5rem',
  right: '-0.5rem',
  boxShadow: 'unset',
})

function NavTrees({ workspace }: { workspace: WS }) {
  return (
    <TreesBox>
      <main style={{ paddingRight: '1rem' }}>
        {workspace.favorite.length && (
          <Box sx={{ marginBottom: '1.5rem' }}>
            <Section color="text.secondary">Favorite</Section>
            <NavTree nodes={workspace.favorite} onOpen={workspace.triggerOpen('FAVORITE')} />
          </Box>
        )}
        {workspace.personal.length && (
          <div>
            <Section color="text.secondary">Workspace</Section>
            <NavTree nodes={workspace.personal} onOpen={workspace.triggerOpen('PERSONAL')} />
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
      backgroundColor: apm(theme, 0.2, 0.1),
    },

    '::-webkit-scrollbar-thumb': {
      borderRadius: '7.5px',
      backgroundColor: apm(theme, 0.3, 0.15),
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
      bgcolor: strColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  }
}
