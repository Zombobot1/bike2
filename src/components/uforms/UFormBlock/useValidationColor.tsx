import { useTheme } from '@mui/material'
import { _apm } from '../../application/theming/theme'
import { Validity } from '../types'

export function useValidationColor(validity: Validity): string {
  const theme = useTheme()
  const validColor = theme.palette.success.main
  const invalidColor = theme.palette.error.main

  let color = _apm(theme, 'secondary')
  if (validity === 'valid') color = validColor
  else if (validity === 'invalid') color = invalidColor
  return color
}
