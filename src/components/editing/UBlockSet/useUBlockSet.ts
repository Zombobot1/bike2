import { useEffect } from 'react'
import { insertAt, remove, replace, safeSplit } from '../../../utils/algorithms'
import { bool, Fn, fn, str, strs } from '../../../utils/types'
import { safe } from '../../../utils/utils'
import { uuid } from '../../../utils/uuid'
import { useC } from '../../utils/hooks/hooks'
import {
  AddedBlock,
  AddedBlocks,
  NewBlockFocus,
  SetIds,
  SplitList,
  UBlockSetUpdate,
  UBlockType,
  UGridDTO,
  UTextFocus,
} from '../types'
import { useDeleteUBlocks } from '../UBlock/UBlock'
import { currentSelection, useUPageSelection } from '../UPage/hooks/useUpageSelection'
import { actions } from '../UPage/hooks/useUpageActions'
import { replaceAllCodeToNothing } from '../../utils/Selection/htmlAsStr'
import { getUBlockInfo, UListMerge } from '../UPage/blockIdAndInfo'

export interface BlockManagement {
  addNewBlocks: (underId: str, focus?: NewBlockFocus, data?: str, type?: UBlockType) => void
  deleteBlock: (id: str, dataToAppend?: str) => void
  deleteBlocks: Fn
  rearrangeBlocks: (underId: str) => void
  handleGridCreation: (underId: str, side: Side) => void
  deleteGrid: (id: str, idsLeft: strs) => void
  mergeLists: (merge: UListMerge) => void
  splitList: SplitList
  handleMoveBlocksTo: (pageId: str) => void
  handleUpdate: (update: UBlockSetUpdate) => void
}

export function useUBlockSet(ps: Ps, setIds: SetIds) {
  const { focusD, selectionD, selection } = useUPageSelection()
  const { deleteExternalUBlocks } = useDeleteUBlocks()

  useEffect(() => {
    const update = selection.updates?.find((v) => v.id === ps.id)
    if (update) {
      handleUpdate(update)
      selectionD({ a: 'applied-update', setId: ps.id })
    }
  }, [selection.updates])

  const addNewBlocks = useC(
    (underId: str, focus: NewBlockFocus = 'focus-end', data = '', type: UBlockType = 'text') => {
      let newBlocks: AddedBlocks = []

      if (type !== 'image') {
        const blocksData = safeSplit(data, '\n\n')
        newBlocks = blocksData.length
          ? blocksData.map((d): AddedBlock => ({ id: uuid.v4(), data: d, type }))
          : [{ id: uuid.v4(), data: '', type }]
      } else {
        newBlocks.push({ id: uuid.v4(), data, type: 'image' })
      }

      ps.setAddedBlocks(newBlocks)

      if (type === 'image') {
        focusD({ a: 'reset' })
        selectionD({ a: 'select', id: newBlocks[0].id, setId: ps.id })
      } else {
        if (focus !== 'no-focus') {
          focusD({
            a: 'set-active-block',
            block: {
              id: safe(newBlocks.at(-1)).id,
              focus: { type: focus === 'focus-start' ? 'start' : 'end' },
            },
          })
        }
      }

      setIds((old) => {
        const blockAbove = old.indexOf(underId) + 1
        const newAddedIds = newBlocks.map((b) => b.id)
        const newIds = insertAt(old, blockAbove, ...newAddedIds) // blockAbove === 0 ? [...old.ids, ...newAddedIds] : ???
        return newIds
      })
    },
  )

  const deleteBlock = useC((id: str, dataToAppend = '') => {
    deleteExternalUBlocks([id])
    setIds((old) => {
      const blockBefore = old[old.indexOf(id) - 1] || ''
      const focus: UTextFocus = !dataToAppend
        ? { type: 'end' }
        : { type: 'end-integer', xOffset: replaceAllCodeToNothing(dataToAppend).length }
      focusD({ a: 'set-active-block', block: { id: blockBefore, focus, appendedData: dataToAppend } })
      return old.filter((oldId) => oldId !== id)
    })
  })

  const deleteBlocks = useC(() => {
    setIds((old) => {
      const idsToRemove = currentSelection.ids
      actions.deletePages(idsToRemove)
      deleteExternalUBlocks(idsToRemove)
      selectionD({ a: 'clear' })
      return old.filter((oldId) => !idsToRemove.includes(oldId))
    })
  })

  const rearrangeBlocks = useC((underId: str) => {
    setIds((old) => {
      const draggingIds = currentSelection.draggingIds
      if (draggingIds.includes(underId)) return old

      let newIds = old.filter((oldId) => !draggingIds.includes(oldId))
      const underI = newIds.indexOf(underId)
      newIds = underI === -1 ? [...draggingIds, ...newIds] : insertAt(newIds, underI + 1, ...draggingIds) // underI === -1 - drop on title

      selectionD({ a: 'handle-drop-in', setId: ps.id })
      return newIds
    })
  })

  const handleGridCreation = useC((underId: str, side: Side) => {
    const newIds = [uuid.v4(), uuid.v4()]
    const gridId = uuid.v4()
    setIds((old) => {
      const draggingIds = currentSelection.draggingIds
      if (draggingIds.includes(underId)) return old

      const isRight = side === 'right'
      if (ps.createColumn) {
        ps.createColumn(ps.id, draggingIds, side)
        selectionD({ a: 'handle-drop-in-column', columnId: ps.id })
        return old
      }

      const newColumnIds = draggingIds
      let newSetIds = old.filter((oldId) => !newColumnIds.includes(oldId) && oldId !== underId)
      const underI = newSetIds.indexOf(underId)

      const newColumns: UGridDTO = {
        widths: ['50%', '50%'],
        columns: isRight ? [[underId], newColumnIds] : [newColumnIds, [underId]],
        ids: newIds,
      }

      const newId = gridId
      newSetIds = insertAt(newSetIds, underI + 1, newId)
      selectionD({ a: 'handle-drop-in-column', columnId: ps.id })
      ps.setAddedBlocks([{ id: newId, data: JSON.stringify(newColumns), type: 'grid' }])
      return newSetIds
    })
  })

  const deleteGrid = useC((id: str, idsLeft: strs) => {
    setIds((old) => {
      deleteExternalUBlocks([id])
      return replace(old, id, ...idsLeft)
    })
  })

  const mergeLists = useC((merge: UListMerge) => {
    setIds((old) => {
      let new_ = old
      if (merge.appendedData) {
        focusD({
          a: 'set-active-block',
          block: {
            id: merge.appendedData.id,
            appendedData: merge.appendedData.data,
            ulistId: merge.appendedData.ulistId,
            focus: { type: merge.deleteBlocks?.length === 2 ? 'end' : 'start' },
          },
        })
      } else if (merge.addedListBlock) {
        ps.setAddedBlocks([merge.addedListBlock])
        new_ = replace(new_, safe(merge.replaceId), safe(merge.replaceBy))
        focusD({
          a: 'set-active-block',
          block: {
            id: safe(merge.replaceId),
            focus: { type: 'start' },
          },
        })
      }

      if (merge.deleteBlocks) {
        deleteExternalUBlocks(merge.deleteBlocks)
        new_ = new_.filter((id) => !merge.deleteBlocks?.includes(id))
      }

      if (merge.deleteId) new_ = new_.filter((id) => id !== merge.deleteId)

      return new_
    })
  })

  const splitList = useC((list: { id: str; wasRemoved?: bool }, splitOnId: str, newListId: str, newListData: str) => {
    setIds((old) => {
      let new_ = old
      if (newListData) {
        ps.setAddedBlocks([{ id: newListId, data: newListData, type: getUBlockInfo(list.id).type }])
        new_ = insertAt(old, old.indexOf(list.id) + 1, splitOnId, newListId)
      } else new_ = insertAt(old, old.indexOf(list.id) + 1, splitOnId)

      if (list.wasRemoved) {
        deleteExternalUBlocks([list.id])
        new_ = remove(new_, list.id)
      }
      focusD({
        a: 'set-active-block',
        block: {
          id: splitOnId,
          focus: { type: 'start' },
        },
      })

      return new_
    })
  })

  const handleMoveBlocksTo = useC((pageId: str) => {
    setIds((old) => {
      if (currentSelection.draggingIds.includes(pageId)) return old
      selectionD({ a: 'clear' })
      return old.filter((oldId) => !currentSelection.draggingIds.includes(oldId))
    })
  })

  const handleUpdate = useC((update: UBlockSetUpdate) => {
    const id = uuid.v4()

    setIds((old) => {
      let newIds = old
      if (update.toDelete) {
        if (update.deletePermanently) deleteExternalUBlocks(update.toDelete)
        newIds.filter((id) => !update.toDelete?.includes(id))
      }

      let newBlocks: AddedBlocks = []
      if (update.toInsert) {
        // assume that only one block can be inserted
        newIds = insertAt(newIds, newIds.indexOf(update.toInsert[0]) + 1, id)
        newBlocks = [{ id, data: '', type: 'text' }]
        focusD({
          a: 'set-active-block',
          block: { id, focus: { type: 'start' } },
        })
      }

      ps.setAddedBlocks(newBlocks)

      return newIds
    })
  })

  return {
    addNewBlocks,
    deleteBlock,
    deleteBlocks,
    rearrangeBlocks,
    handleGridCreation,
    deleteGrid,
    mergeLists,
    splitList,
    handleMoveBlocksTo,
    handleUpdate,
    focusD,
    selectionD,
    selection,
  }
}

type Side = 'right' | 'left'
export type CreateColumn = (id: str, ids: strs, side: Side) => void
class Ps {
  id = ''
  createColumn?: CreateColumn = fn
  setAddedBlocks: (b: AddedBlocks) => void = fn
}
