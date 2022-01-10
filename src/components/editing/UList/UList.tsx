import { useC, useMount, useReactiveObject } from '../../utils/hooks/hooks'
import { safe, ucast } from '../../../utils/utils'
import { str } from '../../../utils/types'
import { useEffect, useState } from 'react'
import { ActiveBlock, AddedBlocks, SplitList, UBlockImplementation } from '../types'
import { uuid } from '../../../utils/uuid'
import { splitNode, UListNode } from './UListNode'
import { UListDTO } from './types'
import { getUBlockInfo } from '../UPage/blockIdAndInfo'

export interface UList extends UBlockImplementation {
  activeBlock?: ActiveBlock
  splitList: SplitList
}

export function UList(ps: UList) {
  const dataS = useReactiveObject(ucast(ps.data, new UListDTO()))
  const [data] = dataS

  useEffect(() => {
    if (!ps.activeBlock) return
    ps.setData(safe(ps.activeBlock.appendedData))
  }, [ps.activeBlock])

  useEffect(() => {
    const newData = JSON.stringify(dataS[0])
    if (newData !== ps.data) ps.setData(newData)
  }, [dataS[0]])

  const addedBlocksS = useState<AddedBlocks>([])

  const moveIdInList = useC((id: str, direction: 'left' | 'right') => {
    if (direction === 'left') {
      if (getUBlockInfo(id).setId === ps.id) {
        const { newRootData, newListData, newListId } = splitNode(ps.id, id)
        ps.splitList({ id: ps.id, wasRemoved: !newRootData }, id, newListId, newListData)
        ps.setData(newRootData)
      }
    }
  })

  // function handleTab(e: KeyboardEvent<HTMLInputElement>, atStart = false) {
  //   if (!atStart || e.key !== 'Tab') return
  //   e.preventDefault()
  //   if (e.shiftKey) {
  //     if (data.offset === 1) ps.setType('text', data.text, 'start')
  //     else if (data.offset > 1) setOffset(data.offset - 1)
  //   } else setOffset(data.offset + 1)
  //   ps.openToggleParent?.(ps.id)
  // }

  useMount(() => {
    if (data.children) return
    const id = uuid.v4()
    const newData: UListDTO = { id: data.id, children: [{ id }] }
    addedBlocksS[1]([{ id, data: '', type: 'text' }])
    ps.setData(JSON.stringify(newData))
  })

  if (!data.children) return null

  return <UListNode id={data.id} dataS={dataS} addedBlocksS={addedBlocksS} type={ps.type} moveIdInList={moveIdInList} />
}
