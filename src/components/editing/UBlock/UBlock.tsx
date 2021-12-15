import { Box, styled, Tooltip } from '@mui/material'
import { useCallback, useRef } from 'react'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { ConnectDragSource, useDrag, useDrop } from 'react-dnd'
import { useIsSM, useReactiveObject } from '../../utils/hooks/hooks'
import { bool, fn, Fn, num, SetStr, str, strs } from '../../../utils/types'
import {
  AddNewBlockUText,
  ArrowNavigationFn,
  BlockInfo,
  FocusType,
  InitialData,
  isSelectableByClickBlock,
  isNotFullWidthBlock,
  isUFileBlock,
  isUQuestionBlock,
  isUFormBlock,
  isUTextBlock,
  regexAndType,
  UBlockB,
  UBlockType,
  UTextFocus,
  DragType,
} from '../types'
import { UText } from '../UText/UText'
import { UFile } from '../UFile/UFile'
import { UFormBlock } from '../../uforms/UFormBlock/UFormBlock'
import { useData, useFirestoreData } from '../../../fb/useData'
import { useSelection } from './useSelection'
import { UForm } from '../../uforms/UForm'
import { RStack } from '../../utils/MuiUtils'
import { UMenu, UOption, useMenu } from '../../utils/UMenu/UMenu'
import { useElementSize } from '../../utils/hooks/useElementSize'
import { Equation } from '../Equation/Equation'
import { UDivider } from '../UDivider/UDivider'
import { BlockTurner } from './BlockAutocomplete/BlockTurner'
import { utextPaddings } from '../UText/utextStyles'
import { UTable } from '../UTable/UTable'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { UPageBlock } from '../UPage/UPageBlock/UPageBlock'

export interface BlocksManagement {
  rearrangeBlocks: SetStr
  handleMoveBlocksTo: SetStr
  addNewBlock: AddNewBlockUText
  deleteBlock: (id: str, data?: str) => void
  deleteBlocks: (ids: strs) => void
}

export interface FocusManagement {
  focus?: UTextFocus

  goUp: ArrowNavigationFn
  goDown: ArrowNavigationFn
  resetActiveBlock: Fn
}

export interface UBlock extends BlocksManagement, FocusManagement, UBlockB {
  initialData?: InitialData
  appendedData?: str
  previousBlockInfo?: BlockInfo // doesn't exist on first render
  i: num

  addNewUPage?: SetStr // not in UForm
  toggleListOpen?: SetStr // only for toggle list
  isToggleOpen?: bool
  openToggleParent?: SetStr
  addInfo: (id: str, i: BlockInfo) => void

  autoplay?: bool
  isCardField?: bool
  onAnswer?: Fn
}

export const mockUblock: UBlock = {
  i: 0,
  id: '404',
  addInfo: fn,
  addNewBlock: fn,
  deleteBlock: fn,
  deleteBlocks: fn,
  goDown: fn,
  goUp: fn,
  handleMoveBlocksTo: fn,
  rearrangeBlocks: fn,
  resetActiveBlock: fn,
}

interface UBlockDTO {
  data: str
  type: UBlockType
  isDeleted?: bool
}

export function UBlock({
  id,
  initialData,
  addNewBlock = fn,
  readonly = false,
  focus: initialFocus,
  deleteBlock: deleteUBlock = fn,
  autoplay: _,
  onAnswer,
  isCardField,
  addInfo = fn,
  addNewUPage = fn,
  goUp,
  goDown,
  resetActiveBlock = fn,
  deleteBlocks: deleteUBlocks = fn,
  rearrangeBlocks = fn,
  handleMoveBlocksTo = fn,
  i = 100,
  previousBlockInfo,
  toggleListOpen,
  openToggleParent,
  isToggleOpen,
  appendedData,
}: UBlock) {
  const [ublock, setUBlock] = useData<UBlockDTO>('ublocks', id, initialData)
  const { deleteExternalUBlocks } = useDeleteUBlocks()
  const { selection, dispatch } = useSelection()
  const isSM = useIsSM()
  const [focus, setFocus] = useReactiveObject(initialFocus)

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: DragType.ublock,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragType.ublock,
      drop: (_, monitor) => {
        if (!monitor.didDrop()) rearrangeBlocks(id)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [rearrangeBlocks],
  )

  useUpdateEffect(() => {
    if (!isDragging) dispatch({ a: 'end-drag' })
  }, [isDragging])

  useUpdateEffect(() => {
    if (ublock.type === 'page') addNewUPage(id)
  }, [ublock.type])

  const notFullWidth = isNotFullWidthBlock(ublock.type)
  const { ref, width } = useElementSize({ passive: !notFullWidth })

  const setData = useCallback((data: str) => setUBlock({ ...ublock, data }), [JSON.stringify(ublock)])
  const setType = useCallback(
    (type: UBlockType, data = '', focus: FocusType = 'end') => {
      setUBlock({ data, type })
      setFocus({ type: focus })
    },
    [JSON.stringify(ublock), JSON.stringify(focus)],
  )

  const tryToChangeFieldType = useCallback(getTryToChangeBlockType(id, setType), [setType])

  const deleteBlock = useCallback(
    (data?: str) => {
      setUBlock({ isDeleted: true })
      deleteUBlock(id, data)
    },
    [deleteUBlock, setUBlock],
  )

  const deleteBlocks = useCallback(() => {
    deleteUBlocks(selection.ids)
    deleteExternalUBlocks(selection.ids)
    dispatch({ a: 'clear' })
  }, [deleteUBlocks, selection.ids])

  const commonProps = { id, data: ublock.data, setData, readonly, type: ublock.type, maxWidth: width - 16, addInfo }

  const utextProps = {
    ...commonProps,
    tryToChangeFieldType,
    i,
    setType,
    focus,
    addNewBlock,
    deleteBlock,
    isCardField,
    goUp,
    goDown,
    previousBlockInfo,
    appendedData,
    initialData: initialData?.data,
    toggleListOpen,
    openToggleParent,
    isToggleOpen,
  }
  const RStack_ = isSM ? RStack : Box

  return (
    <Container
      onMouseDown={() => {
        // if you click on code and then move back to previous focused block focus will be lost: setCursor is not called
        // it is possible to trigger setCursor if special flag "fromCode" is introduced in focus but it doesn't help
        if (ublock.type !== 'code') resetActiveBlock()
      }}
      onMouseEnter={isSM ? (e) => dispatch({ a: 'mouse-enter', atY: e.clientY, id }) : fn}
      onMouseLeave={isSM ? (e) => dispatch({ a: 'mouse-leave', atY: e.clientY, id }) : fn}
      tabIndex={i + 100}
      data-cy="ublock"
      ref={ref}
    >
      <RStack_>
        <InnerContainer sx={{ width: notFullWidth ? 'default' : '100%' }} ref={drop}>
          {isSM && (
            <BlockMenu
              data={ublock.data}
              type={ublock.type}
              setType={setType}
              deleteBlock={deleteBlocks}
              onAddClick={() => addNewBlock(id, 'focus-start')}
              onMenuClick={() => dispatch({ a: 'select-by-click', id })}
              clearSelection={() => {
                dispatch({ a: 'clear', force: true })
              }}
              selectedMany={selection.ids.length > 1}
              readonly={readonly}
              pt={utextPaddings.get(ublock.type.toLowerCase())}
              drag={drag}
              startDrag={selection.ids ? () => dispatch({ a: 'start-drag', id }) : fn}
            />
          )}
          {selection.ids.includes(id) && <Selection data-cy="selection" />}
          {isOver && !selection.draggingIds.includes(id) && <Dropbox />}
          <div
            ref={preview}
            onClick={isSM && isSelectableByClickBlock(ublock.type) ? () => dispatch({ a: 'select', id }) : fn}
          >
            {isUTextBlock(ublock.type) && <UText {...utextProps} />}
            {isUFileBlock(ublock.type) && <UFile {...commonProps} />}
            {isUQuestionBlock(ublock.type) && <UFormBlock {...commonProps} onAnswer={onAnswer} />}
            {isUFormBlock(ublock.type) && <UForm {...commonProps} />}
            {ublock.type === 'block-equation' && <Equation {...commonProps} />}
            {ublock.type === 'divider' && <UDivider />}
            {ublock.type === 'table' && <UTable {...commonProps} />}
            {ublock.type === 'page' && <UPageBlock {...commonProps} handleMoveBlocksTo={handleMoveBlocksTo} />}
          </div>
        </InnerContainer>
      </RStack_>
    </Container>
  )
}

export function useDeleteUBlocks() {
  const { setData: setExternalData } = useFirestoreData()
  return {
    deleteExternalUBlocks: (ids: strs) => ids.forEach((id) => setExternalData('ublocks', id, { isDeleted: true })),
  }
}

const Container = styled('div', { label: 'UBlock' })({
  width: '100%',
  minHeight: '1.5rem',
})

const InnerContainer = styled('div', { label: 'UBlock-InnerContainer' })({
  position: 'relative',
  height: '100%',
  ':hover': {
    '> .ublock--block-menu-container': {
      opacity: 1,
    },
  },
})

const Selection = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: theme.apm('info'),
  marginBottom: '0.25rem',
  marginTop: '0.25rem',
}))

const Dropbox = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  bottom: 0,
  right: 0,
  left: 0,
  height: '0.5rem',
  backgroundColor: theme.apm('info'),
  marginTop: '0.25rem',
}))

const getTryToChangeBlockType = (id: str, setType: (v: UBlockType) => void) => (newData: str) => {
  if (!newData.includes(' ')) return

  const firstElement = newData.split(' ')
  const newType = regexAndType.get(firstElement[0])
  if (!newType) return

  setType(newType)
}

interface BlockMenu {
  data: str
  type: UBlockType
  clearSelection: Fn
  deleteBlock: Fn
  setType: (t: UBlockType, data?: str) => void
  selectedMany: bool
  onAddClick: Fn
  onMenuClick: Fn
  drag: ConnectDragSource
  startDrag: Fn
  readonly?: bool
  pt?: str
}

function BlockMenu({
  data,
  type,
  deleteBlock,
  selectedMany,
  setType,
  onAddClick,
  onMenuClick,
  readonly,
  clearSelection,
  startDrag,
  drag,
  pt = '0',
}: BlockMenu) {
  const ref = useRef<HTMLButtonElement>(null)
  const { close, isOpen, toggleOpen } = useMenu(onMenuClick)
  return (
    <LeftButtons className={readonly ? '' : 'ublock--block-menu-container'} sx={{ paddingTop: pt }}>
      <MiniBtn onClick={onAddClick} ref={ref} data-cy="add-block-h">
        <AddI />
      </MiniBtn>
      <Tooltip
        title="Click or Drag"
        placement="left-start"
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-20, 0],
              },
            },
          ],
        }}
      >
        <MiniBtn ref={drag} onClick={toggleOpen} onMouseDown={startDrag} data-cy="block-menu-h" sx={{ cursor: 'grab' }}>
          <DragI />
        </MiniBtn>
      </Tooltip>
      <UMenu btnRef={ref} close={close} isOpen={isOpen && !readonly} hasNested={true} offset={[85, 0]} elevation={4}>
        {/* Maybe user can add comments */}
        <UOption icon={DeleteRoundedIcon} text="Delete" shortcut="Del" close={close} onClick={deleteBlock} />
        {!selectedMany && isUTextBlock(type) && (
          <BlockTurner
            turnInto={(t) => {
              clearSelection()
              close()
              setType(t, data)
            }}
          />
        )}
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
    backgroundColor: theme.apm('200'),
  },

  ':active': {
    backgroundColor: theme.apm('400'),
  },
}))

const DragI = styled(DragIndicatorRoundedIcon)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  color: theme.apm('800'),
}))

const AddI = styled(AddRoundedIcon)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  color: theme.apm('800'),
}))

const LeftButtons = styled(RStack, { label: 'BlockMenu' })(({ theme }) => ({
  position: 'absolute',
  transform: 'translateX(-100%)',
  paddingRight: '0.5rem',
  transition: theme.tra('opacity'),
  opacity: 0,
}))
