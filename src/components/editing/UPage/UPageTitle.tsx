import { Box, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { Fn, SetStr, str } from '../../../utils/types'
import { EditableUtility } from '../../utils/EditableText/EditableUtility'
import { DragType } from '../types'
import { useUPageFocus } from './hooks/useUPageFocus'

export interface UPageTitle {
  data: str
  setData: SetStr
  onDrop: Fn
  onEnter: Fn
  onClick: Fn
}
export function UPageTitle(ps: UPageTitle) {
  const { activeBlock } = useUPageFocus()
  const [focus, setFocus] = useState(0)

  useEffect(() => setFocus((old) => (activeBlock.id === 'title' ? old + 1 : old)), [activeBlock])

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragType.ublock,
      drop: ps.onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [ps.onDrop],
  )
  return (
    <Box ref={drop} sx={{ position: 'relative' }}>
      <EditableUtility
        type="title"
        placeholder="Untitled"
        text={ps.data}
        setText={ps.setData}
        focusIfEmpty={true}
        onEnter={ps.onEnter}
        onArrowDown={ps.onEnter}
        onClick={ps.onClick}
        focus={focus}
        cy="upage-title"
      />
      {isOver && <Dropbox />}
    </Box>
  )
}

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
