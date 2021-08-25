import { Stack } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { api } from '../../../api/api'
import { useMount } from '../../utils/hooks/hooks'
import { bool, setStr, str, strs } from '../../../utils/types'
import { cast } from '../../../utils/utils'
import { uuid } from '../../../utils/uuid'
import { AddNewBlock, NewBlockFocus, UBlockB } from '../types'
import { UBlock } from '../UBlock'

export interface UPage extends UBlockB {
  oneBlockOnly?: bool
  factoryPlaceholder?: str
}

export function UPage({ _id, readonly, oneBlockOnly = false, factoryPlaceholder }: UPage) {
  const [isReady, setIsReady] = useState(false)
  const [ids, setIds] = useState(new Ids())
  const [lastActiveBlock, setLastActiveBlock] = useState(new Block())

  useMount(() => {
    let cancelled = false

    api.getUBlock(_id).then((d) => {
      if (cancelled) return
      setIds({ ids: cast<strs>(d.data, []), needsUpdate: false })
      setIsReady(true)
    })

    return () => {
      cancelled = true
    }
  })

  const addNewBlock: AddNewBlock = (underId = '', focus = 'FOCUS', data = '') => {
    const _id = uuid.v4()
    api.postUBlock({ _id, data })
    setLastActiveBlock({ data, focus, _id })
    setIds((old) => {
      const blockAbove = old.ids.indexOf(underId) + 1
      if (blockAbove === 0) return { ids: [...old.ids, _id], needsUpdate: true }
      // sendData(_id, ids) sends twice
      return {
        ids: [...old.ids.slice(0, blockAbove), _id, ...old.ids.slice(blockAbove, old.ids.length)],
        needsUpdate: true,
      }
    })
  }

  useEffect(() => {
    if (ids.needsUpdate) {
      setIds((old) => ({ ...old, needsUpdate: false }))
      sendData(_id, ids.ids)
    }
  }, [ids.needsUpdate])

  const deleteBlock = (id: str) => {
    setIds((old) => {
      const blockBefore = old.ids.indexOf(id) - 1
      const la: Block = { _id: old.ids[blockBefore] || '', focus: 'FOCUS' }
      setLastActiveBlock(la)
      return { ids: old.ids.filter((_id) => _id !== id), needsUpdate: true }
    })
  }

  if (!isReady) return null
  return (
    <Stack>
      {ids.ids.map((_id) => {
        return (
          <UBlock
            key={_id}
            _id={_id}
            readonly={readonly}
            autoFocus={_id === lastActiveBlock._id && lastActiveBlock.focus === 'FOCUS'}
            data={_id === lastActiveBlock._id ? lastActiveBlock.data || '' : undefined}
            addNewBlock={addNewBlock}
            deleteBlock={deleteBlock}
          />
        )
      })}
      {(!ids.ids.length || !oneBlockOnly) && (
        <UBlock
          key={`factory-${lastActiveBlock._id}`}
          _id=""
          addNewBlock={addNewBlock}
          deleteBlock={setStr}
          isFactory={true}
          readonly={readonly}
          autoFocus={Boolean(lastActiveBlock._id) && lastActiveBlock.focus === 'NO_FOCUS'}
          onFactoryBackspace={() => setLastActiveBlock({ _id: ids.ids.slice(-1)[0] || '', focus: 'FOCUS' })}
          placeholder={factoryPlaceholder || undefined}
        />
      )}
    </Stack>
  )
}

const sendData = (_id: str, ids: strs) => api.patchUBlock(_id, { data: JSON.stringify(ids) })

class Block {
  _id = ''
  focus: NewBlockFocus = 'NO_FOCUS'
  data?: str
}

class Ids {
  ids: strs = []
  needsUpdate = false
}