import { alpha, Stack, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactive, useMount, useReactiveObject } from '../utils/hooks/hooks'
import { bool, fn, Fn, num, SetBool, setStr, SetStr, str } from '../../utils/types'
import {
  AddNewBlockUText,
  ArrowNavigation,
  BlockInfo,
  FocusType,
  InitialData,
  isUFileComponent,
  isUFormComponent,
  isUTextComponent,
  NewBlockFocus,
  regexAndType,
  UBlockB,
  UComponentType,
  UFormBlockComponent,
  UTextFocus,
} from './types'
import { UHeading0, UHeading1, UHeading2, UHeading3, UText } from './UText/UText'
import { UFile } from './UFile/UFile'
import { UAudioFile } from './UFile/UAudioFile/UAudioFile'
import { UImageFile } from './UFile/UImageFile/UImageFile'
import { UFormBlock } from '../uforms/UFormBlock/UFormBlock'
import { useData } from '../../fb/useData'
import { useSelection } from './useSelection'

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
  const { selection, dispatch } = useSelection()

  const [focus, setFocus] = useReactiveObject(initialFocus)
  const setData = (data: str) => setUBlock({ ...ublock, data })
  const setType = (type: UComponentType, data = '', focus: FocusType = 'end') => {
    setUBlock({ data, type })
    setFocus({ type: focus })
  }

  const commonProps = { data: ublock.data, setData, readonly, type: ublock.type }

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
        resetActiveBlock()
      }}
      onMouseUp={() => dispatch({ a: 'mouse-up' })}
      onMouseEnter={(e) => dispatch({ a: 'mouse-enter', atY: e.clientY, id })}
      onMouseLeave={(e) => dispatch({ a: 'mouse-leave', atY: e.clientY, id })}
      onClick={ublock.type === 'IMAGE' ? () => dispatch({ a: 'select', id }) : fn}
      tabIndex={i + 100}
      data-cy="ublock"
    >
      {selection.ids.includes(id) && <Selection />}
      {isUTextComponent(ublock.type) && <UText {...utextProps} />}
      {isUFileComponent(ublock.type) && <UFile {...commonProps} />}
      {isUFormComponent(ublock.type) && <UFormBlock {...commonProps} _id={id} onAnswer={onAnswer} />}
    </Container>
  )
}

const Container = styled('div', { label: 'UBlock' })({
  position: 'relative',
  width: '100%',
  minHeight: '1.5rem',
})

const Selection = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  width: '100%',
  height: '100%',
  backgroundColor: alpha(theme.palette.info.main, 0.15),
}))

const tryToChangeFieldType = (setType: (v: UComponentType) => void, addNewUPage: Fn) => (newData: str) => {
  if (!newData.includes(' ')) return

  const firstElement = newData.split(' ')
  const newType = regexAndType.get(firstElement[0])
  if (!newType) return

  setType(newType)
  if (newType === 'PAGE') addNewUPage()
}
