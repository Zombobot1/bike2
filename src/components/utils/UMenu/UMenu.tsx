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
  Fade,
} from '@mui/material'
import { FC, RefObject, useRef, useState } from 'react'
import { bool, fn, Fn, num, nums, OptionIconP, str } from '../../../utils/types'
import { all as call } from '../../../utils/utils'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { useHover } from '../hooks/useHover'
import { filterProps } from '../../../utils/utils'
import useUpdateEffect from '../hooks/useUpdateEffect'

export interface MenuB extends MenuListProps {
  btnRef?: RefObject<HTMLButtonElement | HTMLLIElement>
  isOpen: bool
  close: (success?: 'esc' | 'enter') => void
  elevation?: num
  minWidth?: str
  maxHeight?: str
}
const propsFormHook = ['open', 'toggleOpen']
export const menuFilterProps = [...propsFormHook, 'btnRef', 'close', 'isOpen', 'elevation', 'minWidth', 'maxHeight']

export interface UMenu extends MenuB {
  containerRef?: RefObject<HTMLButtonElement | HTMLLIElement>
  hasNested?: bool
  isNested?: bool
  offset?: nums
  placement?: 'bottom-start' | 'right'
  disablePortal?: bool
}

const uMenuFilter = [...menuFilterProps, 'hasNested', 'isNested', 'offset', 'containerRef', 'disablePortal']

export function UMenu(ps: UMenu) {
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') ps.close()
  }

  const Animation = ps.isNested ? Fade : Grow

  return (
    <Popper
      open={ps.isOpen}
      anchorEl={ps.btnRef?.current}
      container={ps.containerRef?.current}
      placement={ps.placement || 'bottom-start'}
      transition
      disablePortal={!!ps.containerRef || ps.disablePortal}
      style={{ zIndex: 20 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: ps.offset,
          },
        },
      ]}
    >
      {({ TransitionProps, placement }) => (
        <Animation
          {...TransitionProps}
          style={{
            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
          }}
        >
          <Paper
            elevation={ps.elevation || 1}
            // setting of overflowY breaks nested menus
            sx={{ minWidth: ps.minWidth ? ps.minWidth : 'default', maxHeight: ps.maxHeight }}
          >
            {/* ClickAwayListener is inside paper due to Grow */}
            <ClickAwayListener onClickAway={ps.isNested ? fn : () => ps.close('esc')}>
              <MenuList
                {...filterProps(ps, uMenuFilter)}
                onClick={() => ps.close('enter')}
                onKeyDown={handleListKeyDown}
              />
            </ClickAwayListener>
          </Paper>
        </Animation>
      )}
    </Popper>
  )
}

export interface UMenuControlsB {
  isOpen: bool
  open: Fn
  close: Fn
  toggleOpen: Fn
}

export interface UMenuControls extends UMenuControlsB {
  btnRef: React.MutableRefObject<null>
}

export function useMenu(onOpen = fn, onClose = fn): UMenuControls {
  const btnRef = useRef(null)
  const [isOpen, setOpen] = useState(false)

  useUpdateEffect(() => {
    if (isOpen) onOpen()
    else onClose()
  }, [isOpen])

  const open = () => setOpen(true)
  const close = () => setOpen(false)
  const toggleOpen = () => setOpen((old) => !old)
  return { isOpen, open, close, toggleOpen, btnRef }
}

export interface UOption extends MenuItemProps {
  icon: FC<OptionIconP>
  iconSize?: 'small' | 'large'
  text: str
  shortcut?: str
  close?: Fn
}
const filterOption = ['icon', 'text', 'shortcut', 'close', 'iconSize']
export function UOption(props: UOption) {
  if (props.children) return <NestedOption {...props} />
  return <PlainOption {...props} />
}

function PlainOption(ps: UOption) {
  return (
    <MenuItem
      {...filterProps(ps, filterOption)}
      onClick={ps.close ? call(ps.onClick, ps.close) : ps.onClick}
      data-cy={ps.text.replaceAll(' ', '-').toLowerCase()}
    >
      <ListItemIcon sx={{ marginRight: ps.iconSize === 'large' ? '1rem' : 0 }}>
        <ps.icon fontSize={ps.iconSize || 'small'} />
      </ListItemIcon>
      <ListItemText>{ps.text}</ListItemText>
      {ps.shortcut && (
        <Shortcut variant="body2" color="text.secondary">
          {ps.shortcut}
        </Shortcut>
      )}
    </MenuItem>
  )
}

function NestedOption(props: UOption) {
  const { ref, hovered } = useHover<HTMLLIElement>()
  return (
    <MenuItem {...filterProps(props, filterOption)} ref={ref} data-cy={props.text.replaceAll(' ', '-').toLowerCase()}>
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
        close={fn}
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
  color: theme.apm('secondary'),
  transform: 'scale(1.5) translateY(2px)',
}))

const Shortcut = styled(Typography)({
  marginLeft: '1.5rem',
})
