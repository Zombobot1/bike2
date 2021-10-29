import { Fab, styled, Zoom } from '@mui/material'
import Brightness2RoundedIcon from '@mui/icons-material/Brightness2Rounded'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import { COLORS, useUTheme } from './theme'

export function ThemeBtn() {
  const { themeType, toggleTheme, theme } = useUTheme()
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }

  return (
    <>
      <Zoom
        in={themeType === 'light'}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${themeType === 'light' ? transitionDuration.exit : 0}ms`,
        }}
        unmountOnExit
      >
        <FabLight onClick={toggleTheme} data-cy="theme-btn-l">
          <Brightness2RoundedIcon />
        </FabLight>
      </Zoom>
      <Zoom
        in={themeType === 'dark'}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${themeType === 'dark' ? transitionDuration.exit : 0}ms`,
        }}
        unmountOnExit
      >
        <FabDark onClick={toggleTheme} data-cy="theme-btn-d">
          <WbSunnyRoundedIcon />
        </FabDark>
      </Zoom>
    </>
  )
}

const ThemeFab = styled(Fab)({
  position: 'absolute',
  bottom: 16,
  right: 16,
})

const FabLight = styled(ThemeFab)({
  backgroundColor: COLORS.white,
  '&:hover': {
    backgroundColor: COLORS.light,
  },
})

const FabDark = styled(ThemeFab)({
  color: COLORS.secondary,
  backgroundColor: COLORS.primaryLight5,
  '&:hover': {
    backgroundColor: COLORS.primaryLightM5,
  },
  boxShadow: 'unset',
})
