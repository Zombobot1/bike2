import { alpha, useTheme } from '@material-ui/core';

export function useValidationColor(validity: string): string {
  const theme = useTheme();
  const validColor = alpha(theme.palette.success.main, 0.6);
  const invalidColor = alpha(theme.palette.error.main, 0.6);

  let color = alpha(theme.palette.primary.main, 0.6);
  if (validity === 'VALID') color = validColor;
  else if (validity === 'INVALID') color = invalidColor;
  return color;
}
