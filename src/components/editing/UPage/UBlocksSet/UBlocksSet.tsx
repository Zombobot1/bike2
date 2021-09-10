import { Stack } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useMount } from '../../../utils/hooks/hooks'
import { bool, setStr, State, str, strs } from '../../../../utils/types'
import { cast } from '../../../../utils/utils'
import { uuid } from '../../../../utils/uuid'
import { AddNewBlock, NewBlockFocus, UBlockB, UBlockDTO } from '../../types'
import { UBlock } from '../../UBlock'
import { addData, setData, useData } from '../../../utils/hooks/useData'
import { addDoc } from '@firebase/firestore'

export interface UBlocksSet {
  readonly: bool
  idsS: State<strs>
  oneBlockOnly?: bool
  factoryPlaceholder?: str
}

export function UBlocksSet({ idsS, readonly, oneBlockOnly = false, factoryPlaceholder }: UBlocksSet) {
  const [ids, setIds] = idsS
  const [lastActiveBlock, setLastActiveBlock] = useState(new Block())

  const addNewBlock: AddNewBlock = (underId = '', focus = 'FOCUS', data = '') => {
    const id = uuid.v4()
    addData('ublocks', id, { data })
    setLastActiveBlock({ data, focus, id })

    setIds((old) => {
      const blockAbove = old.indexOf(underId) + 1
      if (blockAbove === 0) return [...old, id]
      return [...old.slice(0, blockAbove), id, ...old.slice(blockAbove, old.length)]
    })
  }

  const deleteBlock = (id: str) => {
    setData('ublocks', id, { isDeleted: true })
    setIds((old) => {
      const blockBefore = old.indexOf(id) - 1
      setLastActiveBlock({ id: old[blockBefore] || '', focus: 'FOCUS' })
      return old.filter((oldId) => oldId !== id)
    })
  }

  return (
    <Stack spacing={2}>
      {ids.map((_id) => {
        return (
          <UBlock
            key={_id}
            id={_id}
            readonly={readonly}
            autoFocus={_id === lastActiveBlock.id && lastActiveBlock.focus === 'FOCUS'}
            initialData={_id === lastActiveBlock.id ? { data: lastActiveBlock.data || '', type: 'TEXT' } : undefined}
            addNewBlock={addNewBlock}
            deleteBlock={deleteBlock}
          />
        )
      })}
      {(!ids.length || !oneBlockOnly) && (
        <UBlock
          key={`factory-${lastActiveBlock.id}`}
          id=""
          addNewBlock={addNewBlock}
          deleteBlock={setStr}
          isFactory={true}
          readonly={readonly}
          autoFocus={Boolean(lastActiveBlock.id) && lastActiveBlock.focus === 'NO_FOCUS'}
          onFactoryBackspace={() => setLastActiveBlock({ id: ids.slice(-1)[0] || '', focus: 'FOCUS' })}
          placeholder={factoryPlaceholder || undefined}
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
  const idsS = useState(data.ids)
  return {
    idsS,
    ublock: { ...ublock, data } as T,
    setUBlockData: (d: D) => setUBlock({ data: JSON.stringify(d) }),
  }
}

class Block {
  id = ''
  focus: NewBlockFocus = 'NO_FOCUS'
  data?: str
}
