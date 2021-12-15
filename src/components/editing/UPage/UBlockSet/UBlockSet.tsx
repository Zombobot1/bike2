import { Stack } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { bool, fn, num, SetStr, SetStrs, str, strs } from '../../../../utils/types'
import { ucast, safe } from '../../../../utils/utils'
import { uuid } from '../../../../utils/uuid'
import { BlockInfo, isUTextBlock, UBlockType, UTextFocus } from '../../types'
import { UBlock, useDeleteUBlocks } from '../../UBlock/UBlock'
import { useData } from '../../../../fb/useData'
import { UPageTitle, UParagraph } from '../../UText/UText'
import { useMap } from '../../../utils/hooks/useMap'
import { reverse, safeSplit } from '../../../../utils/algorithms'
import { useArray } from '../../../utils/hooks/useArray'
import { useSelection } from '../../UBlock/useSelection'
import { TOCItems } from '../TableOfContents/types'

export interface UBlocksSet {
  updateTOC?: (items: TOCItems) => void
  deleteUPage?: SetStr
  readonly?: bool
  ids: strs
  setIds: SetStrs
  title?: str
  setTitle?: SetStr
  inner?: bool

  addNewUPage?: (id: str, underId?: str) => void
  factoryPlaceholder?: str
}

export function UBlocksSet({
  ids,
  setIds,
  readonly,
  title,
  setTitle,
  addNewUPage = fn,
  deleteUPage = fn,
  updateTOC,
  factoryPlaceholder,
}: UBlocksSet) {
  const [activeBlock, setActiveBlock] = useState(new ActiveBlock())
  const addedBlocks = useArray<AddedBlock>()
  const [blockAboveDeleted, setBlockAboveDeleted] = useState(new DeletedBlock())
  const idAndInfo = useMap<str, BlockInfo>()
  const { dispatch, selection } = useSelection()
  const _infos = JSON.stringify(idAndInfo.values())

  useEffect(() => {
    if (updateTOC) {
      updateTOC(idAndInfo.entries().map(([id, { data, type, scrollTo, i }]) => ({ id, data, type, scrollTo, i })))
    }
  }, [_infos])

  useEffect(() => {
    if (blockAboveDeleted.id) setBlockAboveDeleted(new DeletedBlock())
  }, [blockAboveDeleted]) // if you separate the same block 2 times it will remove separated content

  const addInfo = useCallback(
    (id: str, info: BlockInfo) => {
      idAndInfo.set(id, info)
    },
    [_infos],
  )

  const _addNewUPage = useCallback(
    (id: str) =>
      addNewUPage(
        id,
        ids.slice(0, ids.indexOf(id)).find((id) => idAndInfo.get(id)?.type === 'page'),
      ),
    [ids, _infos],
  )

  const addNewBlocks = useCallback(
    (underId = '', focus = 'focus-end', data = '', type: UBlockType = 'text') => {
      let newBlocks: AddedBlock[] = []
      if (type !== 'image') {
        const blocksData = safeSplit(data, '\n\n')
        newBlocks = blocksData.length
          ? blocksData.map((d): AddedBlock => ({ id: uuid.v4(), data: d, type }))
          : [{ id: uuid.v4(), data: '', type }]
      } else {
        newBlocks.push({ id: uuid.v4(), data, type: 'image' })
      }

      addedBlocks.reset(newBlocks)

      if (type === 'image') {
        setActiveBlock({ id: '' })
        dispatch({ a: 'select', id: newBlocks[0].id })
      } else {
        setActiveBlock((old) =>
          focus !== 'no-focus'
            ? { data, focus: { type: focus === 'focus-start' ? 'start' : 'end' }, id: safe(newBlocks.at(-1)).id }
            : old,
        )
      }

      const blockAbove = ids.indexOf(underId) + 1
      const newAddedIds = newBlocks.map((b) => b.id)
      const newIds =
        blockAbove === 0
          ? [...ids, ...newAddedIds]
          : [...ids.slice(0, blockAbove), ...newAddedIds, ...ids.slice(blockAbove, ids.length)]
      setIds(newIds)
    },
    [ids, setIds, _infos],
  )

  const deleteBlock = useCallback(
    (id: str, data = '') => {
      setBlockAboveDeleted({ id: ids[ids.indexOf(id) - 1] || '', data })
      const blockBefore = ids.indexOf(id) - 1
      setActiveBlock({
        id: ids[blockBefore] || '',
        focus: !data ? { type: 'end' } : { type: 'end-integer', xOffset: data.length },
      })
      setIds(ids.filter((oldId) => oldId !== id))
    },
    [ids],
  )

  const rearrangeBlocks = useCallback(
    (underId: str) => {
      if (selection.draggingIds.includes(underId)) return
      const newIds = ids.filter((oldId) => !selection.draggingIds.includes(oldId))
      const underI = newIds.indexOf(underId)
      if (underI === -1) setIds([...selection.draggingIds, ...newIds.slice()]) // drop on title
      setIds([...newIds.slice(0, underI + 1), ...selection.draggingIds, ...newIds.slice(underI + 1)])
    },
    [ids, selection.draggingIds],
  )

  const handleMoveBlocksTo = useCallback(
    (pageId: str) => {
      if (selection.draggingIds.includes(pageId)) return
      setIds(ids.filter((oldId) => !selection.draggingIds.includes(oldId)))
    },
    [ids, selection.draggingIds],
  )

  const deleteBlocks = useCallback(
    (idsToRemove: strs) => {
      idsToRemove.filter((id) => idAndInfo.get(id)?.type === 'page').forEach((id) => deleteUPage(id))
      setIds(ids.filter((oldId) => !idsToRemove.includes(oldId)))
    },
    [ids, _infos],
  )

  const toggleListOpen = useCallback(
    (id: str) => {
      const info = idAndInfo.get(id)
      if (!info) return
      idAndInfo.set(id, { ...info, isOpen: !info?.isOpen })
    },
    [ids, _infos],
  )

  const openToggleParent = useCallback(
    (id: str) => {
      const parentId = ids[ids.indexOf(id) - 1] // top element becomes parent
      if (!parentId) return

      const info = idAndInfo.get(parentId)
      if (!info) return
      idAndInfo.set(parentId, { ...info, isOpen: true })
    },
    [ids, _infos],
  )

  const findUTextId = useCallback(
    (direction: 'up' | 'down' | 'first' | 'last', i?: num): str => {
      let searchArea = ids.slice(0, i).reverse()
      if (direction === 'down') searchArea = ids.slice((i || 0) + 1)
      else if (direction === 'last') searchArea = [...ids].reverse()
      else if (direction === 'first') searchArea = ids
      const index = searchArea.findIndex((id) => isUTextBlock(idAndInfo.get(id)?.type))
      if (index === -1) return direction === 'up' ? 'title' : 'factory'
      return searchArea[index]
    },
    [ids, _infos],
  )

  const focusUp = useCallback(
    (id: str, xOffset?: num) =>
      setActiveBlock({ id: findUTextId('up', ids.indexOf(id)), focus: { type: 'end', xOffset } }),
    [findUTextId],
  )

  const focusDown = useCallback(
    (id: str, xOffset?: num) =>
      setActiveBlock({ id: findUTextId('down', ids.indexOf(id)), focus: { type: 'start', xOffset } }),
    [findUTextId],
  )

  const onFactoryBackspace = useCallback(
    (_ = 0) => setActiveBlock({ id: findUTextId('last'), focus: { type: 'end' } }),
    [findUTextId],
  )

  const onTitleEnter = useCallback(
    (_?: str, x?: num) => setActiveBlock({ id: findUTextId('first'), focus: { type: 'start', xOffset: x } }),
    [findUTextId],
  )

  const clearFocus = useCallback(() => setActiveBlock(new ActiveBlock()), [])
  const { deleteExternalUBlocks } = useDeleteUBlocks()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selection.ids.length) return
      if (e.key === 'Enter') {
        e.preventDefault() // otherwise new block will contain div with br
        e.stopImmediatePropagation()
        const type = idAndInfo.get(selection.ids[0])?.type
        if (isUTextBlock(type) && type !== 'code') setActiveBlock({ id: selection.ids[0], focus: { type: 'end' } })
        else addNewBlocks(selection.ids.at(-1), 'focus-start', '')
        dispatch({ a: 'clear' })
      } else if (e.key === 'Backspace') {
        setIds(ids.filter((id) => !selection.ids.includes(id)))
        deleteExternalUBlocks(selection.ids)
        dispatch({ a: 'clear' })
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        navigator.clipboard.writeText(
          Array.from(idAndInfo.entries())
            .filter(([id, { type }]) => selection.ids.includes(id) && isUTextBlock(type))
            .map(([_, { data }]) => data)
            .join('\n\n'),
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selection, ids, _infos])

  return (
    <Stack>
      {setTitle && (
        <UPageTitle
          id={'title'}
          i={-1}
          tryToChangeFieldType={fn}
          focus={activeBlock.id === 'title' ? activeBlock.focus : undefined}
          goUp={fn}
          goDown={onTitleEnter}
          clearFocus={clearFocus}
          onTitleEnter={onTitleEnter}
          data={title || ''}
          setData={fn}
          setType={fn}
          addNewBlock={fn}
          type="text"
          hideMenus={true}
          onDrop={() => rearrangeBlocks('title')}
        />
      )}
      {ids.map((_id, i) => {
        const info = idAndInfo.get(_id)
        const currentType = info?.type
        const typesStrike = currentType
          ? reverse(ids.slice(0, i)).findIndex((id) => idAndInfo.get(id)?.type !== currentType)
          : 0
        const prev = idAndInfo.get(ids[i - 1])
        const previousBlockInfo = prev ? { ...prev, typesStrike } : undefined

        let isOpen: bool | undefined = undefined
        if (info?.type === 'toggle-list' && info?.offset && info?.offset > 1) {
          isOpen = getIsOpen(ids, idAndInfo._data, i)
          if (!isOpen) return null
        }

        return (
          <UBlock
            key={_id}
            id={_id}
            readonly={readonly}
            focus={_id === activeBlock.id ? activeBlock.focus : undefined}
            goUp={focusUp}
            goDown={focusDown}
            initialData={addedBlocks.has((b) => b.id === _id) ? { ...addedBlocks.get((b) => b.id === _id) } : undefined}
            addNewBlock={addNewBlocks}
            addInfo={addInfo}
            addNewUPage={_addNewUPage}
            deleteBlock={deleteBlock}
            deleteBlocks={deleteBlocks}
            appendedData={_id === blockAboveDeleted.id ? blockAboveDeleted.data : undefined}
            resetActiveBlock={clearFocus}
            i={i}
            previousBlockInfo={previousBlockInfo}
            rearrangeBlocks={rearrangeBlocks}
            handleMoveBlocksTo={handleMoveBlocksTo}
            toggleListOpen={toggleListOpen}
            openToggleParent={openToggleParent}
            isToggleOpen={info?.isOpen}
          />
        )
      })}
      {!readonly && (
        <UParagraph
          i={-1}
          key={`factory-${activeBlock.id}`}
          id="factory"
          focus={activeBlock.id === 'factory' ? { type: 'start' } : undefined}
          onFactoryBackspace={onFactoryBackspace}
          goUp={onFactoryBackspace}
          goDown={fn}
          tryToChangeFieldType={fn}
          addNewBlock={addNewBlocks}
          isFactory={true}
          placeholder={factoryPlaceholder}
          data=""
          setData={fn}
          setType={fn}
          type="text"
          hideMenus={true}
        />
      )}
    </Stack>
  )
}

type UBlocks = { data: { ids: strs } }
export function useUBlocks<T extends UBlocks, D>(id: str) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ublock, setUBlock] = useData<any>('ublocks', id)
  const data = ucast<{ ids: strs }>((ublock as { data: str }).data, { ids: [] })
  return {
    ids: data.ids,
    ublock: { ...ublock, data } as T,
    setUBlockData: (d: D) => {
      setUBlock({ data: JSON.stringify(d) })
    },
  }
}

function getIsOpen(ids: strs, idAndInfo: Map<str, BlockInfo>, i: num): bool | undefined {
  let parentId = findToggleParentId(ids[i], ids, idAndInfo)
  if (!parentId) return undefined

  while (parentId) {
    if (!idAndInfo.get(parentId)?.isOpen) return false
    parentId = findToggleParentId(parentId, ids, idAndInfo)
  }

  // all parents are open
  return true
}

function findToggleParentId(id: str, ids: strs, idAndInfo: Map<str, BlockInfo>): str | undefined {
  let i = ids.indexOf(id)
  const info = idAndInfo.get(id)
  if (!info) return undefined
  const offset = info.offset || 1
  i--
  let siblingInfo = idAndInfo.get(ids[i])
  while (siblingInfo?.type === 'toggle-list' && siblingInfo?.offset && siblingInfo.offset >= offset) {
    i--
    siblingInfo = idAndInfo.get(ids[i])
  }

  if (siblingInfo?.type === 'toggle-list' && siblingInfo.offset && siblingInfo.offset < offset) {
    return ids[i]
  }

  return undefined
}

class ActiveBlock {
  id = ''
  focus?: UTextFocus
}

class AddedBlock {
  id = ''
  data = ''
  type: UBlockType = 'text'
}

class DeletedBlock {
  id = ''
  data = ''
}
