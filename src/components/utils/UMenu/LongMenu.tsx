import { Popper, Grow, Paper, ClickAwayListener, MenuList, useTheme, Box, MenuItem, ListItemText } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { fn, Fn, num, SetStr, str, strs } from '../../../utils/types'
import { filterProps, mod } from '../../../utils/utils'
import { useReactive } from '../hooks/hooks'
import { useOnScreen } from '../hooks/useOnScreen'
import { TextInput } from '../MuiUtils'
import { MenuB, menuFilterProps, useMenu } from './UMenu'

export interface LongMenu extends MenuB {
  options: strs
  selectedOption: str
  select: SetStr
  placeholder: str
}

const uOptionedMenu = [...menuFilterProps, 'options', 'selectedOption', 'select', 'placeholder']
export function LongMenu(props: LongMenu) {
  return (
    <Popper
      open={props.isOpen}
      anchorEl={props.btnRef.current}
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
            <OptionedMenu_ {...props} />
          </div>
        </Grow>
      )}
    </Popper>
  )
}

export function useLongMenu(options: strs, selected: str, onSelect: SetStr, onOpen = fn, onClose = fn) {
  const props = useMenu(onOpen, onClose)
  const [selectedOption, setSelectedOption] = useState(selected)
  const select = (new_: str) => {
    onSelect(new_)
    setSelectedOption(new_)
  }
  return { ...props, options, selectedOption, select }
}

function OptionedMenu_(props: LongMenu) {
  const { selectedOption, select, close, minWidth } = props
  const initialOptions = props.options
  const [options, setOptions] = useState(initialOptions)
  const [selectedIndex, setSelectedIndex] = useReactive(options.indexOf(selectedOption))
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
      select(options[selectedIndex])
      close()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  return (
    <ClickAwayListener onClickAway={close}>
      <Paper elevation={props.elevation} sx={{ minWidth: minWidth || 'default' }}>
        <TextInput
          autoFocus
          onKeyDown={handleKeyDown}
          onChange={(e) =>
            setOptions(initialOptions.filter((o) => o.toLowerCase().includes(e.target.value.toLowerCase())))
          }
          inputRef={ref}
          variant="standard"
          placeholder={`Search for a ${props.placeholder}`}
          sx={{ padding: '1rem' }}
        />
        <MenuList {...filterProps(props, uOptionedMenu)} onClick={close} sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          {options.map((o, i) => (
            <Item key={i} selectedIndex={selectedIndex} text={o} i={i} onClick={() => select(o)} />
          ))}
        </MenuList>
      </Paper>
    </ClickAwayListener>
  )
}

interface Item_ {
  selectedIndex: num
  i: num
  text: str
  onClick: Fn
}

function Item({ selectedIndex, i, text, onClick }: Item_) {
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
      <MenuItem selected={selectedIndex === i} ref={ref} onClick={onClick}>
        <ListItemText>{text}</ListItemText>
      </MenuItem>
    </Box>
  )
}
