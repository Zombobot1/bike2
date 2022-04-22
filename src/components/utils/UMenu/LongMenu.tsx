import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  useTheme,
  Box,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Fade,
} from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'
import { bool, f, Fn, num, OptionIconP, str, strs, UIcon } from '../../../utils/types'
import { filterProps, isStr, mod } from '../../../utils/utils'
import { useReactive } from '../hooks/hooks'
import { useOnScreen } from '../hooks/useOnScreen'
import { TextInput } from '../MuiUtils'
import { MenuB, menuFilterProps, UMenuControlsB, useMenu } from './UMenu'

type Option = { text: str; icon: UIcon }
type Options = Option[]
type LongMenuOption = str | Option
type LongMenuOptions = LongMenuOption[]
type OnSelect = (text: str, i: num) => void

export interface LongMenu extends MenuB {
  options: LongMenuOptions
  selectedOption: str
  select: OnSelect
  placeholder: str
  disablePortal?: bool
}

const uOptionedMenu = [...menuFilterProps, 'options', 'selectedOption', 'select', 'placeholder', 'disablePortal']
export function LongMenu(ps: LongMenu) {
  const theme = useTheme()

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }

  return (
    <>
      {ps.btnRef?.current && (
        <Popper
          disablePortal={ps.disablePortal}
          open={ps.isOpen}
          anchorEl={ps.btnRef?.current}
          placement={'bottom-start'}
          transition
          style={{ zIndex: 20 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <div>
                <OptionedMenu_ {...ps} />
              </div>
            </Grow>
          )}
        </Popper>
      )}
      {!ps.btnRef?.current && (
        <Fade in={ps.isOpen} timeout={transitionDuration} mountOnEnter unmountOnExit>
          <div>
            <OptionedMenu_ {...ps} />
          </div>
        </Fade>
      )}
    </>
  )
}

export function useLongMenu(options: LongMenuOptions, selected: str, onSelect: OnSelect, onOpen = f, onClose = f) {
  const props = useMenu(onOpen, onClose)
  const [selectedOption, setSelectedOption] = useState(selected)
  const select = (new_: str, i: num) => {
    onSelect(new_, i)
    setSelectedOption(new_)
  }
  return { ...props, options, selectedOption, select }
}

export function useControlledLongMenu(
  controls: UMenuControlsB,
  options: LongMenuOptions,
  selected: str,
  onSelect: OnSelect,
  { doNotMemorizeSelection = false } = {},
) {
  const [selectedOption, setSelectedOption] = useState(selected)
  const select = (new_: str, i: num) => {
    onSelect(new_, i)
    if (!doNotMemorizeSelection) setSelectedOption(new_)
  }
  return { ...controls, options, selectedOption, select }
}

function OptionedMenu_(ps: LongMenu) {
  const { selectedOption, select, close } = ps
  const initialOptions = ps.options
  const [options, setOptions] = useState(initialOptions)
  const [selectedIndex, setSelectedIndex] = useReactive(getOptionIndexWithText(options, selectedOption))
  const ref = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((o) => (o + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((o) => mod(o - 1, options.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(getOptionTextAt(options, selectedIndex), selectedIndex)
      close('enter')
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close('esc')
    }
  }

  return (
    <ClickAwayListener onClickAway={() => close('esc')}>
      <Paper elevation={ps.elevation} sx={{ minWidth: ps.minWidth ? ps.minWidth : undefined }}>
        <TextInput
          autoFocus
          onKeyDown={handleKeyDown}
          onChange={(e) => setOptions(filterOptions(initialOptions, e.target.value.toLowerCase()))}
          inputRef={ref}
          variant="standard"
          placeholder={`Search for a ${ps.placeholder}`}
          sx={{ padding: '1rem' }}
          inputProps={{ 'data-cy': 'long-menu-search' }}
          fullWidth
        />
        <MenuList
          {...filterProps(ps, uOptionedMenu)}
          onClick={() => close('enter')}
          sx={{ ...(ps.sx || {}), maxHeight: '300px', overflowY: 'auto' }}
        >
          {options.map((o, i) => (
            <Item
              key={i}
              selectedIndex={selectedIndex}
              text={optionText(o)}
              icon={optionIcon(o)}
              i={i}
              onClick={() => select(optionText(o), i)}
            />
          ))}
        </MenuList>
      </Paper>
    </ClickAwayListener>
  )
}

function getOptionTextAt(options: LongMenuOptions, i: num): str {
  if (isStr(options[i])) return options[i] as str
  const r = options[i] as Option
  return r.text
}

function getOptionIndexWithText(options: LongMenuOptions, text: str): num {
  if (isStr(options[0])) return (options as strs).indexOf(text)
  const r = options as Options
  return r.findIndex((o) => o.text === text)
}

function filterOptions(options: LongMenuOptions, filterText: str): LongMenuOptions {
  if (isStr(options[0])) return (options as strs).filter((o) => o.toLowerCase().includes(filterText))
  const r = options as Options
  return r.filter((o) => o.text.toLowerCase().includes(filterText))
}

const optionText = (option: LongMenuOption): str => (isStr(option) ? (option as str) : (option as Option).text)
const optionIcon = (option: LongMenuOption): UIcon | undefined => (isStr(option) ? undefined : (option as Option).icon)

interface Item_ {
  selectedIndex: num
  i: num
  text: str
  icon?: FC<OptionIconP>
  onClick: Fn
}

function Item({ selectedIndex, i, text, icon: Icon, onClick }: Item_) {
  const t = useTheme()
  const ref = useRef<HTMLLIElement>(null)
  const isOnScreen = useOnScreen(ref)

  useEffect(() => {
    if (selectedIndex === i && !isOnScreen) {
      ref.current?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
      })
    }
  }, [selectedIndex])

  return (
    <Box sx={{ backgroundColor: selectedIndex === i ? t.apm('400') : undefined }}>
      <MenuItem
        selected={selectedIndex === i}
        ref={ref}
        onClick={onClick}
        data-cy={text.replace(' ', '-').toLowerCase()}
      >
        {Icon && (
          <ListItemIcon sx={{ marginRight: '1rem' }}>
            <Icon fontSize="large" />
          </ListItemIcon>
        )}
        <ListItemText>{text}</ListItemText>
      </MenuItem>
    </Box>
  )
}
