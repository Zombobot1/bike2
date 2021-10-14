import { ClickAwayListener, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLog, useMount, useReactiveObject } from '../../../utils/hooks/hooks'
import { bool, fn, JSObjectStr, num, SetStr, setStr, State, str, strs, StrState } from '../../../../utils/types'
import { cast, safe } from '../../../../utils/utils'
import { uuid } from '../../../../utils/uuid'
import { BlockInfo, isUTextComponent, NewBlockFocus, UBlockB, UBlockDTO, UComponentType, UTextFocus } from '../../types'
import { UBlock } from '../../UBlock'
import { useData } from '../../../../fb/useData'
import { addDoc } from '@firebase/firestore'
import { UHeading0, UParagraph, UText } from '../../UText/UText'
import { useMap } from '../../../utils/hooks/useMap'
import { reverse, safeSplit } from '../../../../utils/algorithms'
import { useArray } from '../../../utils/hooks/useArray'
import { atom } from 'jotai'
import { useSelection } from '../../useSelection'

export interface UBlocksSet {
  readonly?: bool
  idsS: State<strs>
  title?: str
  setTitle?: SetStr

  addNewUPage?: SetStr
  oneBlockOnly?: bool
  factoryPlaceholder?: str
}

export function UBlocksSet({
  idsS,
  readonly,
  title,
  setTitle,
  addNewUPage = setStr,
  oneBlockOnly = false,
  factoryPlaceholder,
}: UBlocksSet) {
  const [ids, setIds] = idsS
  const [activeBlock, setActiveBlock] = useState(new ActiveBlock())
  const addedBlocks = useArray<AddedBlock>()
  const [blockAboveDeleted, setBlockAboveDeleted] = useState(new DeletedBlock())
  const idAndInfo = useMap<str, BlockInfo>()
  const { dispatch, selection } = useSelection()

  const addNewBlocks = (underId = '', focus = 'FOCUS_END', data = '', type: UComponentType = 'TEXT') => {
    let newBlocks: AddedBlock[] = []
    if (type !== 'IMAGE') {
      const blocksData = safeSplit(data, '\n\n')
      newBlocks = blocksData.length
        ? blocksData.map((d): AddedBlock => ({ id: uuid.v4(), data: d, type }))
        : [{ id: uuid.v4(), data: '', type }]
    } else {
      newBlocks.push({ id: uuid.v4(), data, type: 'IMAGE' })
    }

    addedBlocks.reset(newBlocks)

    if (type === 'IMAGE') {
      setActiveBlock({ id: '' })
      dispatch({ a: 'select', id: newBlocks[0].id })
    } else {
      setActiveBlock((old) =>
        focus !== 'NO_FOCUS'
          ? { data, focus: { type: focus === 'FOCUS_START' ? 'start' : 'end' }, id: safe(newBlocks.at(-1)).id }
          : old,
      )
    }

    setIds((old) => {
      const blockAbove = old.indexOf(underId) + 1
      const newIds = newBlocks.map((b) => b.id)
      if (blockAbove === 0) return [...old, ...newIds]
      return [...old.slice(0, blockAbove), ...newIds, ...old.slice(blockAbove, old.length)]
    })
  }

  const deleteBlock = (id: str, data = '') => {
    setBlockAboveDeleted({ id: ids[ids.indexOf(id) - 1] || '', data })
    setIds((old) => {
      const blockBefore = old.indexOf(id) - 1
      setActiveBlock({
        id: old[blockBefore] || '',
        focus: !data ? { type: 'end' } : { type: 'end-integer', xOffset: data.length },
      })
      return old.filter((oldId) => oldId !== id)
    })
  }

  function findUTextId(direction: 'UP' | 'DOWN' | 'FIRST' | 'LAST', i?: num): str {
    let searchArea = ids.slice(0, i).reverse()
    if (direction === 'DOWN') searchArea = ids.slice((i || 0) + 1)
    else if (direction === 'LAST') searchArea = [...ids].reverse()
    else if (direction === 'FIRST') searchArea = ids
    const index = searchArea.findIndex((id) => isUTextComponent(idAndInfo.get(id)?.type))
    if (index === -1) return direction === 'UP' ? 'title' : 'factory'
    return searchArea[index]
  }

  const focusUp = (id: str) => (xOffset?: num) =>
    setActiveBlock({ id: findUTextId('UP', ids.indexOf(id)), focus: { type: 'end', xOffset } })
  const focusDown = (id: str) => (xOffset?: num) =>
    setActiveBlock({ id: findUTextId('DOWN', ids.indexOf(id)), focus: { type: 'start', xOffset } })
  const onFactoryBackspace = () => setActiveBlock({ id: findUTextId('LAST'), focus: { type: 'end' } })
  const onTitleEnter = (x?: num) => setActiveBlock({ id: findUTextId('FIRST'), focus: { type: 'start', xOffset: x } })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selection.ids.length) return
      if (e.key === 'Enter') {
        e.preventDefault() // otherwise new block will contain div with br
        e.stopImmediatePropagation() // other
        if (isUTextComponent(idAndInfo.get(selection.ids[0])?.type))
          setActiveBlock({ id: selection.ids[0], focus: { type: 'end' } })
        else addNewBlocks(selection.ids.at(-1), 'FOCUS_START', '')
        dispatch({ a: 'clear' })
      } else if (e.key === 'Backspace') {
        setIds((old) => old.filter((id) => !selection.ids.includes(id)))
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
  }, [selection])

  return (
    <Stack>
      {setTitle && (
        <UHeading0
          focus={activeBlock.id === 'title' ? activeBlock.focus : undefined}
          arrowNavigation={{ up: fn, down: onTitleEnter }}
          onTitleEnter={onTitleEnter}
          data={title || ''}
          setData={setStr}
          tryToChangeFieldType={setStr}
          setType={fn}
          addNewBlock={fn}
          type="TEXT"
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
                addNewUPage={() => addNewUPage(ids.slice(0, i).find((id) => idAndInfo.get(id)?.type === 'PAGE') || '')}
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

      {(!ids.length || !oneBlockOnly) && (
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
          type="TEXT"
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
  const idsS = useReactiveObject(data.ids)
  return {
    idsS,
    ublock: { ...ublock, data } as T,
    setUBlockData: (d: D) => setUBlock({ data: JSON.stringify(d) }),
    setUBlockType: (t: UComponentType) => setUBlock({ type: t }), // type is not included in versioning
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
  type: UComponentType = 'TEXT'
}

class DeletedBlock {
  id = ''
  data = ''
}
