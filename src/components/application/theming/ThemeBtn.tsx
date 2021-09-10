import { Fab, styled, Zoom } from '@material-ui/core'
import Brightness2RoundedIcon from '@material-ui/icons/Brightness2Rounded'
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded'
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
        in={themeType === 'LIGHT'}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${themeType === 'LIGHT' ? transitionDuration.exit : 0}ms`,
        }}
        unmountOnExit
      >
        <FabLight onClick={toggleTheme} data-cy="theme-btn-l">
          <Brightness2RoundedIcon />
        </FabLight>
      </Zoom>
      <Zoom
        in={themeType === 'DARK'}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${themeType === 'DARK' ? transitionDuration.exit : 0}ms`,
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
