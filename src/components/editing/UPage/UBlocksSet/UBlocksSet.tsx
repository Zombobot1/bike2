import { ClickAwayListener, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLog, useMount, useReactiveObject } from '../../../utils/hooks/hooks'
import {
  bool,
  fn,
  JSObjectStr,
  num,
  SetStr,
  setStr,
  SetStrs,
  State,
  str,
  strs,
  StrState,
} from '../../../../utils/types'
import { cast, safe } from '../../../../utils/utils'
import { uuid } from '../../../../utils/uuid'
import { BlockInfo, isUTextComponent, NewBlockFocus, UBlockB, UBlockDTO, UComponentType, UTextFocus } from '../../types'
import { UBlock } from '../../UBlock/UBlock'
import { useData } from '../../../../fb/useData'
import { addDoc } from '@firebase/firestore'
import { UHeading0, UHeading1, UParagraph, UText } from '../../UText/UText'
import { useMap } from '../../../utils/hooks/useMap'
import { reverse, safeSplit } from '../../../../utils/algorithms'
import { useArray } from '../../../utils/hooks/useArray'
import { atom } from 'jotai'
import { useSelection } from '../../UBlock/useSelection'

export interface UBlocksSet {
  readonly?: bool
  ids: strs
  setIds: SetStrs
  title?: str
  setTitle?: SetStr
  inner?: bool

  addNewUPage?: SetStr
  factoryPlaceholder?: str
}

export function UBlocksSet({
  ids,
  setIds,
  readonly,
  title,
  setTitle,
  addNewUPage = setStr,
  factoryPlaceholder,
  inner,
}: UBlocksSet) {
  const [activeBlock, setActiveBlock] = useState(new ActiveBlock())
  const addedBlocks = useArray<AddedBlock>()
  const [blockAboveDeleted, setBlockAboveDeleted] = useState(new DeletedBlock())
  const idAndInfo = useMap<str, BlockInfo>()
  const { dispatch, selection } = useSelection()

  const addNewBlocks = (underId = '', focus = 'focus-end', data = '', type: UComponentType = 'text') => {
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
    const newIds = newBlocks.map((b) => b.id)
    setIds(
      blockAbove === 0
        ? [...ids, ...newIds]
        : [...ids.slice(0, blockAbove), ...newIds, ...ids.slice(blockAbove, ids.length)],
    )
  }

  const deleteBlock = (id: str, data = '') => {
    setBlockAboveDeleted({ id: ids[ids.indexOf(id) - 1] || '', data })
    const blockBefore = ids.indexOf(id) - 1
    setActiveBlock({
      id: ids[blockBefore] || '',
      focus: !data ? { type: 'end' } : { type: 'end-integer', xOffset: data.length },
    })
    setIds(ids.filter((oldId) => oldId !== id))
  }

  function findUTextId(direction: 'up' | 'down' | 'first' | 'last', i?: num): str {
    let searchArea = ids.slice(0, i).reverse()
    if (direction === 'down') searchArea = ids.slice((i || 0) + 1)
    else if (direction === 'last') searchArea = [...ids].reverse()
    else if (direction === 'first') searchArea = ids
    const index = searchArea.findIndex((id) => isUTextComponent(idAndInfo.get(id)?.type))
    if (index === -1) return direction === 'up' ? 'title' : 'factory'
    return searchArea[index]
  }

  const focusUp = (id: str) => (xOffset?: num) =>
    setActiveBlock({ id: findUTextId('up', ids.indexOf(id)), focus: { type: 'end', xOffset } })
  const focusDown = (id: str) => (xOffset?: num) =>
    setActiveBlock({ id: findUTextId('down', ids.indexOf(id)), focus: { type: 'start', xOffset } })
  const onFactoryBackspace = () => setActiveBlock({ id: findUTextId('last'), focus: { type: 'end' } })
  const onTitleEnter = (x?: num) => setActiveBlock({ id: findUTextId('first'), focus: { type: 'start', xOffset: x } })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selection.ids.length) return
      if (e.key === 'Enter') {
        e.preventDefault() // otherwise new block will contain div with br
        e.stopImmediatePropagation()
        const type = idAndInfo.get(selection.ids[0])?.type
        if (isUTextComponent(type) && type !== 'code') setActiveBlock({ id: selection.ids[0], focus: { type: 'end' } })
        else addNewBlocks(selection.ids.at(-1), 'focus-start', '')
        dispatch({ a: 'clear' })
      } else if (e.key === 'Backspace') {
        setIds(ids.filter((id) => !selection.ids.includes(id)))
        dispatch({ a: 'clear' })
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        navigator.clipboard.writeText(
          idAndInfo
            .entries()
            .filter(([_, info]) => isUTextComponent(info.type))
            .map(([_, info]) => info.data)
            .join('\n\n'),
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selection, ids])

  return (
    <Stack>
      {setTitle && (
        <UHeading0
          focus={activeBlock.id === 'title' ? activeBlock.focus : undefined}
          arrowNavigation={{ up: fn, down: onTitleEnter }}
          clearFocus={() => setActiveBlock(new ActiveBlock())}
          onTitleEnter={onTitleEnter}
          data={title || ''}
          setData={setStr}
          tryToChangeFieldType={setStr}
          setType={fn}
          addNewBlock={fn}
          type="text"
        />
      )}
      <ClickAwayListener onClickAway={() => dispatch({ a: 'clear' })}>
        <div>
          {ids.map((_id, i) => {
            const currentType = idAndInfo.get(_id)?.type
            const typesStrike = currentType
              ? reverse(ids.slice(0, i)).findIndex((id) => idAndInfo.get(id)?.type !== currentType)
              : 0
            const prev = idAndInfo.get(ids[i - 1])
            const previousBlockInfo = prev ? { ...prev, typesStrike } : undefined
            return (
              <UBlock
                key={_id}
                id={_id}
                readonly={readonly}
                focus={_id === activeBlock.id ? activeBlock.focus : undefined}
                arrowNavigation={{ down: focusDown(_id), up: focusUp(_id) }}
                initialData={
                  addedBlocks.has((b) => b.id === _id) ? { ...addedBlocks.get((b) => b.id === _id) } : undefined
                }
                addNewBlock={(focus, data, isImage) => addNewBlocks(_id, focus, data, isImage)}
                addInfo={(info) => idAndInfo.set(_id, info)}
                addNewUPage={() => addNewUPage(ids.slice(0, i).find((id) => idAndInfo.get(id)?.type === 'page') || '')}
                deleteBlock={deleteBlock}
                appendedData={_id === blockAboveDeleted.id ? blockAboveDeleted.data : undefined}
                resetActiveBlock={() => setActiveBlock({ id: '' })}
                i={i}
                previousBlockInfo={previousBlockInfo}
              />
            )
          })}
        </div>
      </ClickAwayListener>
      {!readonly && (
        <UParagraph
          key={`factory-${activeBlock.id}`}
          focus={activeBlock.id === 'factory' ? { type: 'start' } : undefined}
          onFactoryBackspace={onFactoryBackspace}
          arrowNavigation={{ down: fn, up: onFactoryBackspace }}
          addNewBlock={(focus, data) => addNewBlocks('', focus, data)}
          isFactory={true}
          placeholder={factoryPlaceholder}
          data=""
          setData={setStr}
          tryToChangeFieldType={setStr}
          setType={fn}
          type="text"
        />
      )}
    </Stack>
  )
}

type UBlocks = { data: { ids: strs } }
export function useUBlocks<T extends UBlocks, D>(id: str) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ublock, setUBlock] = useData<any>('ublocks', id)
  const data = cast<{ ids: strs }>((ublock as { data: str }).data, { ids: [] })
  return {
    ids: data.ids,
    ublock: { ...ublock, data } as T,
    setUBlockData: (d: D) => setUBlock({ data: JSON.stringify(d) }),
  }
}

export function useDeleteUPage(id: str) {
  const [_, setUBlock] = useData<UBlockDTO>('ublocks', id)
  return () => setUBlock({ isDeleted: true })
}

class ActiveBlock {
  id = ''
  focus?: UTextFocus
}

class AddedBlock {
  id = ''
  data = ''
  type: UComponentType = 'text'
}

class DeletedBlock {
  id = ''
  data = ''
}
