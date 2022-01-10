import { styled, Tooltip, useTheme } from '@mui/material'
import { memo, useEffect, useRef, useState } from 'react'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { ConnectDragSource, useDrag, useDrop } from 'react-dnd'
import { useC, useIsSM, useMount } from '../../utils/hooks/hooks'
import { bool, Children, fn, Fn, JSObject, num, SetStr, str, strs } from '../../../utils/types'
import {
  FocusType,
  isSelectableByClickBlock,
  isNotFullWidthBlock,
  isUFileBlock,
  isUQuestionBlock,
  isUFormBlock,
  isUTextBlock,
  UBlockType,
  DragType,
  UBlockImplementation,
  UBlockDTO,
  UTextFocus,
  ActiveBlock,
  isUListBlock,
  isFlat,
  SplitList,
} from '../types'
import { UText } from '../UText/UText'
import { UFile } from '../UFile/UFile'
import { UFormBlock } from '../../uforms/UFormBlock/UFormBlock'
import { useData, useFirestoreData } from '../../../fb/useData'
import { currentSelection, UPageSelectionD, useUPageSelection } from '../UPage/hooks/useUpageSelection'
import { UForm } from '../../uforms/UForm'
import { RStack } from '../../utils/MuiUtils'
import { UMenu, UOption, useMenu } from '../../utils/UMenu/UMenu'
import { UEquation } from '../UEquation/UEquation'
import { UDivider } from '../UDivider/UDivider'
import { BlockTurner } from './BlockAutocomplete/BlockTurner'
import { utextPaddings } from '../UText/utextStyles'
import { UTable } from '../UTable/UTable'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { UPageBlock } from '../UPage/UPageBlock/UPageBlock'
import { UGrid } from '../UGrid/UGrid'
import { TextInUList, UText as UTextP } from '../UText/types'
import { UFormFieldInfo } from '../../uforms/types'
import { safe } from '../../../utils/utils'
import { deleteUBlockInfo, mergeListsAround, setUBlockInfo } from '../UPage/blockIdAndInfo'
import { BlockManagement } from '../UBlockSet/useUBlockSet'
import { UPageFocusD } from '../UPage/hooks/useUPageFocus'
import { actions } from '../UPage/hooks/useUpageActions'
import { UList } from '../UList/UList'

export interface UBlock extends TextInUList {
  id: str
  parentId: str
  i: num
  readonly?: bool
  initialData?: UBlockDTO
  previousBlockInfo?: { offset?: num; typesStrike?: num } // doesn't exist on first render

  blockManagement: BlockManagement
  // splitList?: (listId: str, splitOnId: str, newListId: str, newListData: str) => void // overrides in UListNode
  autoplay?: bool
  isCardField?: bool
  uformPs?: UFormFieldInfo
}

export const mockUblock: UBlock = {
  i: 0,
  id: '404',
  parentId: '',
  blockManagement: {
    addNewBlocks: fn,
    deleteBlock: fn,
    deleteBlocks: fn,
    deleteGrid: fn,
    mergeLists: fn,
    splitList: fn,
    handleGridCreation: fn,
    handleMoveBlocksTo: fn,
    handleUpdate: fn,
    rearrangeBlocks: fn,
  },
}

export function UBlock(ps: UBlock) {
  const { activeBlock, selection, focusD, selectionD } = useUPageSelection()
  const { ublock, setData, setType, focus, setFocus, appendedData } = useUBlock(ps, activeBlock)

  const goUp = useC((id: str, xOffset?: num) => focusD({ a: 'up', id, xOffset }))
  const goDown = useC((id: str, xOffset?: num) => focusD({ a: 'down', id, xOffset }))
  const resetActiveBlock = useC(() => focusD({ a: 'reset' }))

  const isSM = useIsSM() // WARNING: IF SSR IS TURNED ON IT WILL UNMOUNT COMPONENT (critical for images)

  // when upage is deleted it still should be inside its parent to get restored
  if (ublock.isDeleted) return null

  const commonPs: UBlockImplementation = {
    id: ps.id,
    data: ublock.data,
    setData,
    readonly: ps.readonly,
    type: ublock.type,
  }

  const utextPs: UTextP = {
    ...commonPs,
    inUForm: !!ps.uformPs,
    goUp,
    goDown,
    resetActiveBlock,
    setType,
    focus,
    setFocus,
    appendedData,
    addNewBlocks: ps.blockManagement.addNewBlocks,
    deleteBlock: ps.blockManagement.deleteBlock,
    mergeLists: ps.blockManagement.mergeLists,
    isCardField: ps.isCardField,
    initialData: ps.initialData?.data,
    openToggleParent: ps.openToggleParent,
    moveIdInList: ps.moveIdInList,
  }

  return (
    <>
      {isSM && (
        <ContentWrapper
          id={ps.id}
          parentId={ps.parentId}
          i={ps.i}
          data={ublock.data}
          type={ublock.type}
          setType={setType}
          isSelected={selection.ids.includes(ps.id)}
          readonly={ps.readonly}
          blockManagement={ps.blockManagement}
          focusD={focusD}
          selectionD={selectionD}
          isInList={!!ps.openToggleParent}
        >
          <Content
            type={ublock.type}
            commonPs={commonPs}
            utextPs={utextPs}
            uformPs={ps.uformPs}
            deleteGrid={ps.blockManagement.deleteGrid}
            handleMoveBlocksTo={ps.blockManagement.handleMoveBlocksTo}
            splitList={ps.blockManagement.splitList}
            activeUList={activeBlock.ulistId === ps.id ? activeBlock : undefined}
          />
        </ContentWrapper>
      )}
      {!isSM && (
        <Content
          type={ublock.type}
          commonPs={commonPs}
          utextPs={utextPs}
          uformPs={ps.uformPs}
          deleteGrid={ps.blockManagement.deleteGrid}
          handleMoveBlocksTo={ps.blockManagement.handleMoveBlocksTo}
          splitList={ps.blockManagement.splitList}
          activeUList={activeBlock.ulistId === ps.id ? activeBlock : undefined}
        />
      )}
    </>
  )
}

export function useDeleteUBlocks() {
  const { setData: setExternalData } = useFirestoreData()
  return {
    deleteExternalUBlocks: (ids: strs) => ids.forEach((id) => setExternalData('ublocks', id, { isDeleted: true })),
  }
}

function useUBlock(ps: UBlock, activeBlock?: ActiveBlock) {
  const [ublock, setUBlock] = useData<UBlockDTO>('ublocks', ps.id, ps.initialData)
  const [focus, setFocus] = useState<UTextFocus | undefined>()
  useEffect(() => {
    if (activeBlock?.id === ps.id && ublock.data !== '/') setFocus(activeBlock.focus)
    else setFocus(undefined)
  }, [JSON.stringify(activeBlock)])

  const [newType, setNewType] = useState<{ type: UBlockType; data?: str; focus?: FocusType } | undefined>()

  useEffect(() => {
    if (!newType) return

    if (isUListBlock(newType.type))
      return ps.blockManagement.mergeLists(mergeListsAround(ps.id, ublock.data, 'changed-type', newType.type))

    if (newType.data !== undefined) setUBlock({ data: newType.data, type: newType.type })
    else setUBlock({ type: newType.type })
    setFocus({ type: newType.focus || 'end' })

    if (newType.type === 'page') actions.createPage(ps.id)
  }, [newType])

  const setType = useC((type: UBlockType, data?: str, focus?: FocusType) => setNewType({ type, data, focus }))
  const setData = useC((data: str) => setUBlock({ data }))

  useEffect(() => {
    setUBlockInfo(ps.id, { data: ublock.data, i: ps.i, setId: ps.parentId, type: ublock.type })
  }, [ublock, ps.id, ps.i, ps.parentId])
  useMount(() => () => deleteUBlockInfo(ps.id))

  const appendedData = activeBlock?.id === ps.id && !activeBlock.ulistId ? activeBlock.appendedData : undefined
  return { ublock, setData, setType, focus, setFocus, appendedData }
}

interface ContentWrapper_ {
  id: str
  parentId: str
  i: num
  type: UBlockType
  setType: (t: UBlockType) => void
  data: str
  readonly?: bool
  isSelected: bool
  children: Children
  blockManagement: BlockManagement
  focusD: UPageFocusD
  selectionD: UPageSelectionD
  isInList?: bool
}

function ContentWrapper(ps: ContentWrapper_) {
  const ref = useRef<HTMLDivElement>(null)
  const notFullWidth = isNotFullWidthBlock(ps.type)
  // when uimage / uvideo change parents resize them back to 100%

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
        if (!monitor.didDrop()) ps.blockManagement.rearrangeBlocks(ps.id)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [],
  )

  useUpdateEffect(() => {
    if (!isDragging) ps.selectionD({ a: 'end-drag' })
  }, [isDragging])

  const flat = isFlat(ps.type)
  const isSomethingDragging = currentSelection.draggingIds.length > 0 // recalculated on isOver
  const isSideDroppable = isSomethingDragging && !currentSelection.draggingIds.includes(ps.id) && flat

  return (
    <Container
      ref={ref}
      onMouseDown={() => {
        // if you click on code and then move back to previous focused block focus will be lost: setCursor is not called
        // it is possible to trigger setCursor if special flag "fromCode" is introduced in focus but it doesn't help
        if (ps.type !== 'code') ps.focusD({ a: 'reset' })
      }}
      onMouseEnter={
        flat ? (e) => ps.selectionD({ a: 'mouse-enter', atY: e.clientY, id: ps.id, setId: ps.parentId }) : fn
      }
      onMouseLeave={flat ? (e) => ps.selectionD({ a: 'mouse-leave', atY: e.clientY, id: ps.id }) : fn}
      tabIndex={ps.i + 100}
      data-cy="ublock"
    >
      <RStack>
        <InnerContainer sx={{ width: notFullWidth ? 'auto' : '100%' }} ref={drop}>
          {flat && (
            <BlockMenu
              data={ps.data}
              type={ps.type}
              setType={ps.setType}
              deleteBlock={() => ps.blockManagement.deleteBlocks()}
              onAddClick={() => ps.blockManagement.addNewBlocks(ps.id, 'focus-start')}
              onMenuClick={() => ps.selectionD({ a: 'select-by-click', id: ps.id, setId: ps.parentId })}
              clearSelection={() => ps.selectionD({ a: 'clear', force: true })}
              readonly={ps.readonly}
              drag={drag}
              startDrag={() => ps.selectionD({ a: 'start-drag', id: ps.id, setId: ps.parentId })}
              isInList={ps.isInList}
            />
          )}
          {ps.isSelected && <Selection data-cy="selection" />}
          {isOver && !currentSelection.draggingIds.includes(ps.id) && <Dropbox />}
          {isSideDroppable && (
            <>
              <SideDrop onDrop={() => ps.blockManagement.handleGridCreation(ps.id, 'left')} />
              <SideDrop isRight={true} onDrop={() => ps.blockManagement.handleGridCreation(ps.id, 'right')} />
            </>
          )}
          <div
            ref={preview}
            onClick={
              isSelectableByClickBlock(ps.type)
                ? () => ps.selectionD({ a: 'select', id: ps.id, setId: ps.parentId })
                : fn
            }
          >
            {ps.children}
          </div>
        </InnerContainer>
      </RStack>
    </Container>
  )
}

interface ContentP {
  type: UBlockType
  commonPs: UBlockImplementation
  utextPs: UTextP
  uformPs?: UFormFieldInfo
  activeUList?: ActiveBlock
  splitList: SplitList
  deleteGrid: (id: str, ids: strs) => void
  handleMoveBlocksTo: (id: str) => void
}

function Content_(ps: ContentP) {
  return (
    <>
      {isUTextBlock(ps.type) && <UText {...ps.utextPs} />}
      {isUFileBlock(ps.type) && <UFile {...ps.commonPs} />}
      {isUQuestionBlock(ps.type) && <UFormBlock {...ps.commonPs} {...safe(ps.uformPs)} />}
      {isUFormBlock(ps.type) && <UForm {...ps.commonPs} />}
      {isUListBlock(ps.type) && <UList {...ps.commonPs} activeBlock={ps.activeUList} splitList={ps.splitList} />}
      {ps.type === 'block-equation' && <UEquation {...ps.commonPs} />}
      {ps.type === 'divider' && <UDivider />}
      {ps.type === 'grid' && <UGrid {...ps.commonPs} deleteGrid={ps.deleteGrid} />}
      {ps.type === 'table' && <UTable {...ps.commonPs} />}
      {ps.type === 'page' && <UPageBlock {...ps.commonPs} handleMoveBlocksTo={ps.handleMoveBlocksTo} />}
    </>
  )
}

const Content = memo(Content_, (prev, next) => {
  return JSON.stringify(prev) === JSON.stringify(next)
})

interface SideDrop_ {
  isRight?: bool
  onDrop: SetStr
}

function SideDrop({ isRight, onDrop }: SideDrop_) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragType.ublock,
      drop: (_, monitor) => {
        if (!monitor.didDrop()) onDrop('')
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [onDrop],
  )

  const theme = useTheme()

  let sx: JSObject = { transform: 'translateX(-100%)' }
  if (isRight) sx = { right: 0 }
  if (isOver) sx = { ...sx, backgroundColor: theme.apm('info') }
  return <SideDropbox ref={drop} sx={sx} />
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

const SideDropbox = styled('div', { label: 'SideDropbox' })({
  position: 'absolute',
  zIndex: 2,
  top: 0,
  bottom: 0,
  width: '0.5rem',
})

interface BlockMenu {
  data: str
  type: UBlockType
  clearSelection: Fn
  deleteBlock: Fn
  setType: (t: UBlockType, data?: str) => void
  onAddClick: Fn
  onMenuClick: Fn
  drag: ConnectDragSource
  startDrag: Fn
  readonly?: bool
  isInList?: bool
}

function BlockMenu({
  data,
  type,
  deleteBlock,
  setType,
  onAddClick,
  onMenuClick,
  readonly,
  clearSelection,
  startDrag,
  drag,
  isInList,
}: BlockMenu) {
  const ref = useRef<HTMLButtonElement>(null)
  const { close, isOpen, toggleOpen } = useMenu(onMenuClick)
  const pt = utextPaddings.get(type.toLowerCase()) || '0'
  const transform = isInList ? 'translateX(-130%)' : 'translateX(-100%)'

  return (
    <LeftButtons className={readonly ? '' : 'ublock--block-menu-container'} sx={{ paddingTop: pt, transform }}>
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
        {isUTextBlock(type) && (
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
  color: theme.apm('400'),
}))

const AddI = styled(AddRoundedIcon)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  color: theme.apm('400'),
}))

const LeftButtons = styled(RStack, { label: 'BlockMenu' })(({ theme }) => ({
  position: 'absolute',
  paddingRight: '0.5rem',
  transition: theme.tra('opacity'),
  opacity: 0,
}))
