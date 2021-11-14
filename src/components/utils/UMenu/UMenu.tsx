import {
  styled,
  MenuList,
  MenuListProps,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuItem,
  MenuItemProps,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { FC, RefObject, useRef, useState } from 'react'
import { bool, fn, Fn, num, nums, OptionIconP, str } from '../../../utils/types'
import { all as call } from '../../../utils/utils'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { _apm } from '../../application/theming/theme'
import { useHover } from '../hooks/useHover'
import { filterProps } from '../../../utils/utils'

export interface MenuB extends MenuListProps {
  btnRef: RefObject<HTMLButtonElement | HTMLLIElement>
  isOpen: bool
  close: Fn
  elevation?: num
  minWidth?: str
}
const propsFormHook = ['open', 'toggleOpen']
export const menuFilterProps = [...propsFormHook, 'btnRef', 'close', 'isOpen', 'elevation', 'minWidth']

export interface UMenu extends MenuB {
  containerRef?: RefObject<HTMLButtonElement | HTMLLIElement>
  hasNested?: bool
  isNested?: bool
  offset?: nums
  placement?: 'bottom-start' | 'right'
}

const uMenuFilter = [...menuFilterProps, 'hasNested', 'isNested', 'offset']

export function UMenu(props: UMenu) {
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') props.close()
  }

  return (
    <Popper
      open={props.isOpen}
      anchorEl={props.btnRef.current}
      container={props.containerRef?.current}
      placement={props.placement || 'bottom-start'}
      transition
      disablePortal={!!props.containerRef}
      style={{ zIndex: 20 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: props.offset,
          },
        },
      ]}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
          }}
        >
          <Paper elevation={props.elevation || 1} sx={{ minWidth: props.minWidth ? props.minWidth : 'default' }}>
            {/* ClickAwayListener is inside paper due to Grow */}
            <ClickAwayListener onClickAway={props.close}>
              <MenuList
                {...filterProps(props, uMenuFilter)}
                onClick={props.hasNested ? fn : props.close}
                onKeyDown={handleListKeyDown}
              />
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

export function useMenu(onOpen = fn, onClose = fn) {
  const btnRef = useRef(null)
  const [isOpen, setOpen] = useState(false)
  const open = call(onOpen, () => setOpen(true))
  const close = call(onClose, () => setOpen(false))
  const toggleOpen = isOpen ? close : open
  return { isOpen, open, close, toggleOpen, btnRef }
}

export interface UOption extends MenuItemProps {
  icon: FC<OptionIconP>
  text: str
  shortcut?: str
  close?: Fn
}
const filterOption = ['icon', 'text', 'shortcut', 'close']
export function UOption(props: UOption) {
  if (props.children) return <NestedOption {...props} />
  return <PlainOption {...props} />
}

function PlainOption(props: UOption) {
  return (
    <MenuItem
      {...filterProps(props, filterOption)}
      onClick={props.close ? call(props.onClick, props.close) : props.onClick}
    >
      <ListItemIcon>
        <props.icon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{props.text}</ListItemText>
      {props.shortcut && (
        <Shortcut variant="body2" color="text.secondary">
          {props.shortcut}
        </Shortcut>
      )}
    </MenuItem>
  )
}

function NestedOption(props: UOption) {
  const { ref, hovered } = useHover<HTMLLIElement>()
  return (
    <MenuItem {...filterProps(props, filterOption)} ref={ref}>
      <ListItemIcon>
        <props.icon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{props.text}</ListItemText>
      <Shortcut variant="body2" color="text.secondary">
        <RightI />
      </Shortcut>
      <UMenu
        containerRef={ref}
        isOpen={hovered}
        btnRef={ref}
        close={close}
        placement="right"
        elevation={16}
        minWidth="15rem"
        isNested={true}
      >
        {props.children}
      </UMenu>
    </MenuItem>
  )
}

const RightI = styled(ArrowRightRoundedIcon)(({ theme }) => ({
  color: _apm(theme, 'secondary'),
  transform: 'scale(1.5) translateY(2px)',
}))

const Shortcut = styled(Typography)({
  marginLeft: '1.5rem',
})
