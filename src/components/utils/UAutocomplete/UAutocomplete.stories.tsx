import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
  useTheme,
} from '@mui/material'
import { range } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { fn, SetStr, str, strs } from '../../../utils/types'
import { useMenu } from '../UMenu/UMenu'
import { LongMenu, useLongMenu } from '../UMenu/LongMenu'
import { UAutocomplete } from './UAutocomplete'

const T = () => {
  return (
    <Box sx={{ width: 500 }}>
      <UAutocomplete placeholder="Complete me" value="Option 1" options={range(30).map((_, i) => `Option ${i}`)} />
    </Box>
  )
}

export const ArrowNavigation = T

export default {
  title: 'Utils/UAutocomplete',
}
