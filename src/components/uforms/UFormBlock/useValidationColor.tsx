import { useTheme } from '@mui/material'
import { _apm } from '../../application/theming/theme'
import { Correctness } from '../types'

export function useValidationColor(validity: Correctness): string {
  const theme = useTheme()
  const validColor = theme.palette.success.main
  const invalidColor = theme.palette.error.main

  let color = _apm(theme, 'secondary')
  if (validity === 'correct') color = validColor
  else if (validity === 'incorrect') color = invalidColor
  return color
}
