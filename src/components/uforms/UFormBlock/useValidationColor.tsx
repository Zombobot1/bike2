import { alpha, useTheme } from '@mui/material'
import { apm } from '../../application/theming/theme'

export function useValidationColor(validity: string): string {
  const theme = useTheme()
  const validColor = alpha(theme.palette.success.main, 0.6)
  const invalidColor = alpha(theme.palette.error.main, 0.6)

  let color = apm(theme, 'SECONDARY')
  if (validity === 'VALID') color = validColor
  else if (validity === 'INVALID') color = invalidColor
  return color
}
