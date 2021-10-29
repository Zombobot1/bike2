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
} from '@mui/material'
import { entries } from 'lodash'
import { FC, RefObject, useRef, useState } from 'react'
import { bool, fn, Fn, JSObject, str, strs } from '../../utils/types'
import { all } from '../../utils/utils'
import { _apm } from '../application/theming/theme'
import { useToggle } from './hooks/hooks'

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

export function IBtn(props: IBtn) {
  return (
    <IconButton {...filter(props, ['icon'])}>
      <props.icon />
    </IconButton>
  )
}

export function Hr(props: DividerProps) {
  return <ThemedDivider {...props} />
}

const ThemedDivider = styled(Divider)(({ theme }) => ({
  borderColor: _apm(theme, '200'),
}))

export function TextInput(props: TextFieldProps) {
  return <Text {...props} />
}

// <TextFieldProps> - https://github.com/mui-org/material-ui/issues/28844
const Text = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '.MuiInput-root:before, .MuiFilledInput-root:before': {
    borderBottom: `1px solid ${_apm(theme, '400')}`,
  },
  fieldset: {
    borderColor: _apm(theme, '400'),
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

const filter = (props: JSObject, excessive: strs) =>
  Object.fromEntries(Object.entries(props).filter(([k]) => !excessive.includes(k)))
