import { Box, Stack, styled, Typography } from '@mui/material'
import { bool, Children, num, State, str, strs } from '../../../utils/types'
import { safe, ucast } from '../../../utils/utils'
import { useC, useLocalTrigger } from '../../utils/hooks/hooks'
import { RStack } from '../../utils/MuiUtils'
import { UBlock } from '../UBlock/UBlock'
import { useUBlockSet } from '../UBlockSet/useUBlockSet'
import {
  getIsBlockOpen,
  getUBlockInfo,
  openListParent,
  preventUListIdsDeletion,
  toggleListOpen,
} from '../UPage/blockIdAndInfo'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { AddedBlocks, UBlockType } from '../types'
import { UListDTO, UListDTOs } from './types'
import { uuid } from '../../../utils/uuid'

export interface UListNode {
  id: str
  type: UBlockType
  dataS: State<UListDTO>
  addedBlocksS: State<AddedBlocks>
  moveIdInList: (id: str, direction: 'right' | 'left') => void
  readonly?: bool
  depth?: num
}

export function UListNode({ id, type, dataS, addedBlocksS, readonly, moveIdInList, depth = 0 }: UListNode) {
  const [data, setData] = dataS
  const [addedBlocks, setAddedBlocks] = addedBlocksS
  const setIds = useC((f: (old: strs) => strs) => setData((old) => updateIds(old, id, f)))
  const blocks = useUBlockSet({ id, setAddedBlocks }, setIds)
  const [_, triggerListToggle] = useLocalTrigger()
  const openToggleParent = useC((id: str) => openListParent(id, triggerListToggle))

  return (
    <Root>
      {getChildren(data, id).map((c, i) => {
        const isOpen = getIsBlockOpen(c.id)
        return (
          <Box key={c.id} sx={{ width: '100%' }}>
            <RStack>
              {c.unmarked && <Box sx={{ minWidth: 2 * (depth + 1) + 'rem' }} />}
              {type === 'bullet-list' && !c.unmarked && (
                <LeftPartContainer depth={depth}>
                  <FiberManualRecordRounded />
                </LeftPartContainer>
              )}
              {type === 'numbered-list' && (
                <LeftPartContainer depth={depth}>
                  <Number>{i + 1 + '.'}</Number>
                </LeftPartContainer>
              )}
              {type === 'toggle-list' && !c.unmarked && (
                <LeftPartContainer depth={depth} isToggle={true}>
                  <IconBox onClick={() => toggleListOpen(c.id, triggerListToggle)}>
                    {isOpen ? <ArrowDropDownRoundedIcon /> : <ArrowRightRoundedIcon />}
                  </IconBox>
                </LeftPartContainer>
              )}
              <UBlock
                key={c.id}
                id={c.id}
                parentId={id}
                i={i}
                readonly={readonly}
                blockManagement={blocks}
                initialData={addedBlocks.find((b) => b.id === c.id)}
                openToggleParent={openToggleParent}
                moveIdInList={moveIdInList}
              />
            </RStack>
            {isOpen && c.children && (
              <UListNode
                id={c.id}
                type={type}
                dataS={dataS}
                addedBlocksS={addedBlocksS}
                moveIdInList={moveIdInList}
                depth={depth + 1}
              />
            )}
          </Box>
        )
      })}
    </Root>
  )
}

const Root = styled(Stack, { label: 'UListBlocksSet' })({})

export function splitNode(rootId: str, splitOnId: str): { newListId: str; newListData: str; newRootData: str } {
  const root = ucast(getUBlockInfo(rootId).data, new UListDTO())
  const splitI = root.children?.findIndex((c) => c.id === splitOnId)
  const newListChildren = root.children?.slice(safe(splitI) + 1)
  const newChildren = root.children?.slice(0, splitI) || []
  preventUListIdsDeletion([
    ...bfs({ id: '', children: newListChildren })
      .slice(1)
      .map((v) => v.id),
    splitOnId,
  ])
  const newListId = uuid.v4()
  const newData: UListDTO = { id: newListId, children: newListChildren }
  const newRootData: UListDTO = { id: rootId, children: newChildren }
  return {
    newListId,
    newListData: newListChildren?.length ? JSON.stringify(newData) : '',
    newRootData: newChildren.length ? JSON.stringify(newRootData) : '',
  }
}

function bfs(node: UListDTO): UListDTOs {
  const queue: UListDTOs = [node]
  const r: UListDTOs = []

  while (queue.length) {
    const node = safe(queue.shift())
    if (node?.children) queue.push(...node.children)
    r.push(node)
  }

  return r
}

function updateIds(old: UListDTO, id: str, f: (old: strs) => strs): UListDTO {
  const nodes = bfs(old)
  const parent = safe(nodes.find((n) => n.id === id))

  const oldChildren = parent.children || []
  const newChildren = f(oldChildren.map((c) => c.id))
  parent.children = newChildren.map((childId): UListDTO => {
    const oldChild = oldChildren.find((n) => n.id === childId)
    if (!oldChild) return { id: childId }
    return { ...oldChild, id: childId }
  })

  if (!parent.children.length) delete parent.children

  return { ...old }
}

function getChildren(data: UListDTO, id: str): UListDTOs {
  const nodes = bfs(data)
  const parent = safe(nodes.find((n) => n.id === id))
  return safe(parent.children)
}

// turn into, 1., *, tab (without list above) creates new list
// tab with list above - merges lists
// backspace (unmarked), shift+tab - deletes list. If it is in root returns it to parent blockSet
// merges lists if removed between them

interface LeftPartContainer_ {
  children: Children
  depth: num
  isToggle?: bool
}

function LeftPartContainer({ children, depth, isToggle }: LeftPartContainer_) {
  const padding = isToggle ? 0.5 : 0.75
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ paddingLeft: padding + 2 * depth + 'rem', paddingRight: padding + 'rem' }}
    >
      {children}
    </Stack>
  )
}

const FiberManualRecordRounded = styled(FiberManualRecordRoundedIcon)(({ theme }) => ({
  width: '0.5rem',
  height: '0.5rem',
  [`${theme.breakpoints.up('sm')}`]: { width: '0.65rem', height: '0.65rem' },
}))

const Number = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  [`${theme.breakpoints.up('sm')}`]: { fontSize: '1.25rem' },
}))

const IconBox = styled(Box)(({ theme }) => ({
  width: '23px',
  height: '23px',
  borderRadius: '4px',
  transition: 'background-color 0.1s ease-in-out',
  color: theme.apm('secondary'),
  cursor: 'pointer',

  ':hover': {
    backgroundColor: theme.apm('200'),
  },

  '.MuiSvgIcon-root': {
    width: '23px',
    height: '23px',
    transform: 'scale(1.3)',
  },
}))
