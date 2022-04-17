import { styled, Tooltip, useTheme } from '@mui/material'
import { memo, useMemo, useRef } from 'react'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { ConnectDragSource, useDrag, useDrop } from 'react-dnd'
import { useIsSM, useReactiveObject } from '../../../utils/hooks/hooks'
import { bool, Children, JSObject, SetStr, str } from '../../../../utils/types'
import { DragType, UBlockContent, UPageFocus } from '../../types'
import { UText } from '../../UText/UText'
import { UFile } from '../../UFile/UFile'
import { UFormBlock } from '../../UForm/UFormBlock/UFormBlock'
import { UForm } from '../../UForm/UForm'
import { RStack } from '../../../utils/MuiUtils'
import { UMenu, UOption, useMenu } from '../../../utils/UMenu/UMenu'
import { UEquation } from '../../UEquation/UEquation'
import { UDivider } from '../../UDivider/UDivider'
import { BlockTurner } from './BlockAutocomplete/BlockTurner'
import { utextPaddings } from '../../UText/utextStyles'
import { UTable } from '../../UTable/UTable'
import useUpdateEffect from '../../../utils/hooks/useUpdateEffect'
import { UPageBlock } from '../UPageBlock/UPageBlock'
import { UGrid } from '../../UGrid/UGrid'
import { UText as UTextP } from '../../UText/types'
import { UList } from '../../UList/UList'
import {
  UBlockType,
  isUListBlock,
  isNotFullWidthBlock,
  isFlat,
  isSelectableByClickBlock,
  isUTextBlock,
  isUFileBlock,
  isUFormBlock,
  UBlock as UBlockDTO,
} from '../ublockTypes'
import { upage, useUPageCursor, useUPageInfo } from '../useUPageInfo'
import { UPageCursor } from '../UPageState/types'

export interface UBlockP {
  block: UBlockDTO
  readonly?: bool
  inList?: bool
}

export const UBlock = memo(UBlock_)

function UBlock_({ block, inList, readonly }: UBlockP) {
  const { id, data, type } = block
  const { cursor } = useUPageCursor()

  const focusS = useReactiveObject(cursor.focus)

  const isSM = useIsSM()

  const { info } = useUPageInfo()
  readonly = info.readonly || readonly

  const commonPs: UBlockContent = useMemo(() => {
    return {
      id,
      data,
      type,
      setData: upage.change,
      readonly,
    }
  }, [block, readonly])

  const utextPs: UTextP = useMemo(
    () => ({
      ...commonPs,
      context: upage.context(id),
      focusS,
      goUp: upage.moveFocusUp,
      goDown: upage.moveFocusDown,
      resetActiveBlock: upage.resetFocus,
      setType: upage.changeType,
      addUBlock: upage.add,

      onUTextTab: upage.onUTextTab,
      onUTextShiftTab: upage.onUTextShiftTab,
      onUTextBackspace: upage.onUTextBackspace,
      onUTextEnter: upage.onUTextEnter,
      onUTextPaste: upage.onUTextPaste,
    }),
    [commonPs, upage.context(id), myFocusChanged(id, focusS[0])],
  )

  return (
    <>
      {isSM && (
        <ContentWrapper block={block} inList={inList} cursor={cursor} readonly={readonly}>
          <Content type={type} commonPs={commonPs} utextPs={utextPs} />
        </ContentWrapper>
      )}
      {!isSM && <Content type={type} commonPs={commonPs} utextPs={utextPs} />}
    </>
  )
}

const myFocusChanged = (id: str, focus?: UPageFocus) => (focus?.id === id ? focus : undefined)

interface ContentWrapper {
  block: UBlockDTO
  cursor: UPageCursor
  inList?: bool
  readonly?: bool
  children: Children
}

function ContentWrapper({ block, cursor, inList, children, readonly }: ContentWrapper) {
  const { id, type } = block
  // TODO: when uimage / uvideo change parents resize them back to 100%

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
        if (!monitor.didDrop()) upage.rearrange(id)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [],
  )

  useUpdateEffect(() => {
    if (!isDragging) upage.onDragEnd()
  }, [isDragging])

  const notFullWidth = isNotFullWidthBlock(type) && upage.globalContext() !== 'ucard'
  const flat = isFlat(type)
  const selected = cursor.selected.includes(id)
  const isSideDroppable = cursor.isDragging && !selected && flat

  // RStack is mandatory to keep BlockMenu next to block's content, InnerContainer is selectable
  // simpler composition is impossible due to interplay of BlockMenu and selection

  const inUcard = upage.globalContext() === 'ucard'

  return (
    <Container
      onMouseDown={() => {
        // if you click on code and then move back to previous focused block focus will be lost: setCursor is not called
        // it is possible to trigger setCursor if special flag "fromCode" is introduced in focus but it doesn't help
        if (type !== 'code') upage.resetFocus()
      }}
      tabIndex={100}
      data-cy="ublock"
    >
      <InnerContainerWrapper_>
        <InnerContainer
          ref={drop}
          className={selected ? 'selected' : ''}
          sx={{ width: notFullWidth ? 'auto' : '100%', maxWidth: '100%' }}
          data-ublock-id={id}
        >
          {flat && (
            <BlockMenu block={block} drag={drag} inList={inList} readonly={readonly} mode={inUcard ? 'drag' : 'full'} />
          )}
          {isOver && !selected && <Dropbox />}
          {isSideDroppable && (
            <>
              <SideDrop onDrop={() => upage.createUGrid(id, 'left')} />
              <SideDrop isRight={true} onDrop={() => upage.createUGrid(id, 'right')} />
            </>
          )}
          <div
            ref={preview}
            onClick={() => {
              if (isSelectableByClickBlock(type)) upage.select(id)
              else if (cursor.selected.length) upage.unselect()
            }}
          >
            {children}
          </div>
          {flat && inUcard && <BlockMenu block={block} drag={drag} inList={inList} readonly={readonly} mode={'add'} />}
        </InnerContainer>
      </InnerContainerWrapper_>
    </Container>
  )
}

const InnerContainerWrapper_ = styled(RStack)(({ theme }) => ({
  '.selected': {
    ':before': {
      content: '""',
      position: 'absolute',
      zIndex: 2,
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: theme.apm('info'),
      marginBottom: '0.25rem',
      marginTop: '0.25rem',
      pointerEvents: 'none',
    },
  },
}))

interface ContentP {
  type: UBlockType
  commonPs: UBlockContent
  utextPs: UTextP
}

function Content_({ type, commonPs, utextPs }: ContentP) {
  return (
    <>
      {isUTextBlock(type) && <UText {...utextPs} />}
      {isUFileBlock(type) && <UFile {...commonPs} upageId={upage.getUPageId()} />}
      {isUFormBlock(type) && <UFormBlock {...commonPs} />}
      {isUListBlock(type) && <UList {...commonPs} toggleOpen={upage.triggerUListOpen} />}
      {type === 'exercise' && <UForm {...commonPs} handleUFormEvent={upage.handleUFormEvent} />}
      {type === 'block-equation' && <UEquation {...commonPs} />}
      {type === 'divider' && <UDivider />}
      {type === 'grid' && <UGrid {...commonPs} />}
      {type === 'table' && <UTable {...commonPs} />}
      {type === 'page' && <UPageBlock {...commonPs} handleMoveBlocksTo={upage.moveTo} />}
    </>
  )
}

const Content = memo(Content_)

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
  block: UBlockDTO
  drag: ConnectDragSource
  inList?: bool
  readonly?: bool
  mode: 'add' | 'drag' | 'full'
}

function BlockMenu({ block, drag, inList, readonly, mode }: BlockMenu) {
  const { id, type } = block
  const ref = useRef<HTMLButtonElement>(null)
  const { close, isOpen, toggleOpen } = useMenu()
  const pt = utextPaddings.get(type.toLowerCase()) || '0'
  const transform = inList ? 'translateX(-130%)' : 'translateX(-100%)'
  const inCard = mode === 'add'
  const sx = {
    transform: !inCard ? transform : 'translateX(100%)',
    right: inCard ? 0 : undefined,
    top: inCard ? 0 : undefined,
  }

  // zIndex: 20 to match zIndex of menu with disabled portal (without disabling doesn't work in idea)
  return (
    <LeftButtons
      className={readonly ? '' : 'ublock--block-menu-container'}
      sx={{ ...sx, paddingTop: pt }}
      style={{ zIndex: 20 }}
    >
      {(mode === 'add' || mode === 'full') && (
        <MiniBtn onClick={() => upage.add(id)} ref={ref} data-cy="add-block-h">
          <AddI />
        </MiniBtn>
      )}
      {(mode === 'drag' || mode === 'full') && (
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
          <MiniBtn
            ref={drag}
            onClick={toggleOpen}
            onMouseDown={() => {
              upage.select(id)
              upage.onDragStart()
            }}
            data-cy="block-menu-h"
            sx={{ cursor: 'grab' }}
          >
            <DragI />
          </MiniBtn>
        </Tooltip>
      )}

      <UMenu
        btnRef={ref}
        close={close}
        isOpen={isOpen && !readonly}
        hasNested={true}
        offset={[85, 0]}
        elevation={4}
        disablePortal={true}
      >
        {/* Maybe user can add comments */}
        <UOption
          icon={DeleteRoundedIcon}
          text="Delete"
          shortcut="Del"
          close={close}
          onClick={() => upage.deleteSelected()}
        />
        {isUTextBlock(type) && (
          <BlockTurner
            turnInto={(t) => {
              upage.unselect()
              close()
              upage.changeType(id, t)
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
