import {
  Stack,
  StackProps,
  IconButton,
  IconButtonProps,
  TextField,
  TextFieldProps,
  styled,
  Divider,
  DividerProps,
  Radio,
  RadioProps,
  Checkbox,
  CheckboxProps,
  useTheme,
  Select,
  SelectProps,
} from '@mui/material'
import { FC } from 'react'
import { JSObject, num, OptionIconP, str, strs, SVGIcon } from '../../utils/types'

export function RStack(props: StackProps) {
  return (
    <Stack direction="row" justifyContent="center" alignItems="center" {...props}>
      {props.children}
    </Stack>
  )
}

export interface IBtn extends IconButtonProps {
  icon: FC
}

// when placed in ButtonGroup these props appear: 'fullWidth', 'disableElevation'
export function IBtn(props: IBtn) {
  return (
    <IconButton {...filter(props, ['icon', 'fullWidth', 'disableElevation'])}>
      <props.icon />
    </IconButton>
  )
}

export function Hr(props: DividerProps) {
  return <ThemedDivider {...props} />
}

const ThemedDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.apm('200'),
}))

export function TextInput(props: TextFieldProps) {
  return <Text {...props} />
}

// <TextFieldProps> - https://github.com/mui-org/material-ui/issues/28844
const Text = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '.MuiInput-root:before, .MuiFilledInput-root:before': {
    borderBottom: `1px solid ${theme.apm('400')}`,
  },
  fieldset: {
    borderColor: theme.apm('400'),
  },

  '.Mui-disabled': {
    color: `${theme.apm('400')}`,
    WebkitTextFillColor: 'unset !important',
    'fieldset.MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.apm('200')}`,
    },
  },
}))

export function USelect(ps: SelectProps) {
  return <USelect_ {...ps} />
}

const USelect_ = styled(Select)(({ theme }) => ({
  'fieldset.MuiOutlinedInput-notchedOutline': {
    borderColor: `${theme.apm('200')}`,
  },

  '.Mui-disabled': {
    color: `${theme.apm('400')} !important`,
    WebkitTextFillColor: 'unset !important',
  },

  '&.Mui-disabled': {
    'fieldset.MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.apm('200')} !important`,
    },
  },
}))

export interface RTick extends RadioProps {
  cy?: str
}

export function RTick(props: RTick) {
  return (
    <Radio
      {...props}
      inputProps={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/mui-org/material-ui/issues/20160
        'data-cy': props.cy || `rtick`,
      }}
    />
  )
}

export interface CTick extends CheckboxProps {
  cy?: str
}

export function CTick(props: CTick) {
  return (
    <Checkbox
      {...props}
      inputProps={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/mui-org/material-ui/issues/20160
        'data-cy': props.cy || `ctick`,
      }}
    />
  )
}

export function SVGI(Component: SVGIcon, { scale = 0 } = {}) {
  return ({ fontSize }: OptionIconP) => {
    let style = useIconStyle(scale)
    if (fontSize === 'large') style = { ...style, width: 40, height: 40 }
    return <Component style={style} />
  }
}

export function SVGIC(Component: SVGIcon, { scale = 0, width = 0, color = '', colorDark = '' } = {}) {
  return ({ fontSize }: OptionIconP) => {
    let style = useIconStyle(scale, color, colorDark, width)
    if (fontSize === 'large') style = { ...style, width: 40, height: 40 }
    return <Component style={style} />
  }
}

function useIconStyle(scale: num, color = '', colorDark = '', width = 0) {
  const theme = useTheme()
  let style: JSObject = { fill: 'inherit', opacity: 0.55, width: 24, height: 24 } // https://github.com/mui-org/material-ui/issues/26267#issuecomment-879453793
  if (color && colorDark) style = { fill: theme.isDark() ? colorDark : color, width: 24, height: 24 }
  else if (theme.isDark()) style = { fill: theme.palette.primary.main, width: 24, height: 24 }

  if (scale) style = { ...style, transform: `scale(${scale})` }
  else if (width) style = { ...style, width, height: width }

  return style
}

const filter = (props: JSObject, excessive: strs) =>
  Object.fromEntries(Object.entries(props).filter(([k]) => !excessive.includes(k)))
