import { alpha, Button, Stack, styled, Tooltip } from '@mui/material'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useReactive, useMount, useReactiveObject } from '../../utils/hooks/hooks'
import { bool, fn, Fn, num, SetBool, setStr, SetStr, str } from '../../../utils/types'
import {
  AddNewBlockUText,
  ArrowNavigation,
  BlockInfo,
  FocusType,
  InitialData,
  isNotFullWidthComponent,
  isUFileComponent,
  isUFormBlockComponent,
  isUFormComponent,
  isUTextComponent,
  NewBlockFocus,
  regexAndType,
  UBlockB,
  UComponentType,
  UFormBlockComponent,
  UTextFocus,
} from '../types'
import { UHeading0, UHeading1, UHeading2, UHeading3, UText } from '../UText/UText'
import { UFile } from '../UFile/UFile'
import { UAudioFile } from '../UFile/UAudioFile/UAudioFile'
import { UImageFile } from '../UFile/UImageFile/UImageFile'
import { UFormBlock } from '../../uforms/UFormBlock/UFormBlock'
import { useData } from '../../../fb/useData'
import { useSelection } from './useSelection'
import { UForm } from '../../uforms/UForm'
import { RStack } from '../../utils/MuiUtils'
import { UMenu, UOption, useMenu } from '../../utils/UMenu/UMenu'
import { useClientRect, useElementSize } from '../../utils/hooks/useElementSize'
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { _apm, _tra } from '../../application/theming/theme'
import { useHover } from '../../utils/hooks/useHover'
import { prevented } from '../../../utils/utils'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useDebugInformation } from '../../utils/hooks/useDebug'

export interface UBlock extends UBlockB {
  addNewBlock?: AddNewBlockUText
  addInfo?: (i: BlockInfo) => void
  previousBlockInfo?: BlockInfo
  arrowNavigation?: ArrowNavigation
  addNewUPage?: Fn
  deleteBlock?: (id: str, data?: str) => void
  appendedData?: str
  focus?: UTextFocus
  initialData?: InitialData
  isFactory?: bool
  onFactoryBackspace?: Fn
  placeholder?: str
  resetActiveBlock?: Fn
  i?: num

  autoplay?: bool
  isCardField?: bool
  onAnswer?: Fn
}

interface UBlockDTO {
  data: str
  type: UComponentType
  isDeleted?: bool
}

export function UBlock({
  id,
  initialData,
  addNewBlock = fn,
  readonly = false,
  focus: initialFocus,
  isFactory = false,
  deleteBlock = fn,
  onFactoryBackspace,
  placeholder,
  autoplay: _,
  onAnswer,
  isCardField,
  addInfo = fn,
  addNewUPage = fn,
  arrowNavigation,
  resetActiveBlock = fn,
  i = 100,
  previousBlockInfo,
  appendedData,
}: UBlock) {
  const [ublock, setUBlock] = useData<UBlockDTO>('ublocks', id, initialData)
  const { selection, dispatch } = useSelection(ublock.type)

  const [focus, setFocus] = useReactiveObject(initialFocus)
  const setData = (data: str) => setUBlock({ ...ublock, data })
  const setType = (type: UComponentType, data = '', focus: FocusType = 'end') => {
    setUBlock({ data, type })
    setFocus({ type: focus })
  }

  const { ref, width } = useElementSize()
  const commonProps = { data: ublock.data, setData, readonly, type: ublock.type, maxWidth: width - 16 }

  const utextProps = {
    ...commonProps,
    tryToChangeFieldType: tryToChangeFieldType(setType, addNewUPage),
    setType,
    focus,
    addNewBlock,
    deleteBlock: (data?: str) => {
      deleteBlock(id, data)
      setUBlock({ isDeleted: true })
    },
    isFactory,
    onFactoryBackspace,
    placeholder,
    isCardField,
    arrowNavigation,
    addInfo,
    previousBlockInfo,
    appendedData,
  }

  return (
    <Container
      onMouseDown={() => {
        dispatch({ a: 'mouse-down' })
        // if you click on code and then move back to previous focused block focus will be lost: setCursor is not called
        // it is possible to trigger setCursor if special flag "fromCode" is introduced in focus but it doesn't help
        if (ublock.type !== 'code') resetActiveBlock()
      }}
      onMouseUp={() => dispatch({ a: 'mouse-up' })}
      onMouseEnter={(e) => dispatch({ a: 'mouse-enter', atY: e.clientY, id })}
      onMouseLeave={(e) => dispatch({ a: 'mouse-leave', atY: e.clientY, id })}
      onClick={ublock.type === 'image' ? () => dispatch({ a: 'select', id }) : fn}
      tabIndex={i + 100}
      data-cy="ublock"
      ref={ref}
    >
      <RStack>
        <InnerContainer sx={{ width: isNotFullWidthComponent(ublock.type) ? 'default' : '100%' }}>
          <BlockMenu
            onAddClick={() => addNewBlock('focus-start')}
            onMenuClick={() => dispatch({ a: 'select-by-click', id })}
            selectedMany={selection.ids.length > 1}
          />
          {selection.ids.includes(id) && <Selection data-cy="selection" />}
          {isUTextComponent(ublock.type) && <UText {...utextProps} />}
          {isUFileComponent(ublock.type) && <UFile {...commonProps} />}
          {isUFormBlockComponent(ublock.type) && <UFormBlock {...commonProps} _id={id} onAnswer={onAnswer} />}
          {isUFormComponent(ublock.type) && <UForm {...commonProps} />}
        </InnerContainer>
      </RStack>
    </Container>
  )
}

const Container = styled('div', { label: 'UBlock' })({
  width: '100%',
  minHeight: '1.5rem',
  ':hover': {
    '.ublock--block-menu-container': {
      opacity: 1,
    },
  },
})

const InnerContainer = styled('div')({
  position: 'relative',
  height: '100%',
  padding: '0 0.5rem',
})

const Selection = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: alpha(theme.palette.info.main, 0.25),
  marginBottom: '0.5rem',
}))

const tryToChangeFieldType = (setType: (v: UComponentType) => void, addNewUPage: Fn) => (newData: str) => {
  if (!newData.includes(' ')) return

  const firstElement = newData.split(' ')
  const newType = regexAndType.get(firstElement[0])
  if (!newType) return

  setType(newType)
  if (newType === 'page') addNewUPage()
}

interface BlockMenu {
  selectedMany: bool
  onAddClick: Fn
  onMenuClick: Fn
  readonly?: bool
}

function BlockMenu({ onAddClick, onMenuClick, selectedMany, readonly }: BlockMenu) {
  const ref = useRef<HTMLButtonElement>(null)
  const { close, isOpen, toggleOpen } = useMenu(onMenuClick)
  return (
    <LeftButtons className="ublock--block-menu-container">
      <MiniBtn onClick={onAddClick} ref={ref} data-cy="add-block-h">
        <AddI />
      </MiniBtn>
      <Tooltip title="Click or Drag" placement="right">
        <MiniBtn onClick={toggleOpen} data-cy="block-menu-h" sx={{ cursor: 'grab' }}>
          <DragI />
        </MiniBtn>
      </Tooltip>
      {/* Maybe a person can add comments */}
      <UMenu btnRef={ref} close={close} isOpen={isOpen && !readonly} hasNested={true} offset={[85, 0]} elevation={4}>
        <UOption icon={DeleteRoundedIcon} text="Delete" shortcut="Del" close={close} />

        {/* {!selectedMany && (

        )} */}
      </UMenu>
    </LeftButtons>
  )
}

const MiniBtn = styled('button')(({ theme }) => ({
  padding: '0.1rem',
  backgroundColor: 'unset',
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',

  ':focus': {
    outline: 'none',
    // backgroundColor: apm(theme, '200'), doesn't look good
  },

  ':hover': {
    backgroundColor: _apm(theme, '200'),
  },

  ':active': {
    backgroundColor: _apm(theme, '400'),
  },
}))

const DragI = styled(DragIndicatorRoundedIcon)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  color: _apm(theme, '800'),
}))

const AddI = styled(AddRoundedIcon)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  color: _apm(theme, '800'),
}))

const LeftButtons = styled(RStack)({
  position: 'absolute',
  transform: 'translateX(-100%)',
  paddingRight: '0.5rem',
  transition: _tra('opacity'),
  opacity: 0,
})
