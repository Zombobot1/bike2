import { Stack } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { api } from '../../../api/api'
import { useMount } from '../../../utils/hooks-utils'
import { setStr, str, strs } from '../../../utils/types'
import { cast } from '../../../utils/utils'
import { uuid } from '../../../utils/uuid'
import { AddNewBlock, NewBlockFocus, UBlockB } from '../types'
import { UBlock } from '../UBlock'

class Ids {
  ids: strs = []
  needsUpdate = false
}

export function UPage({ _id, isEditing, readonly }: UBlockB) {
  const [ids, setIds] = useState(new Ids())
  const [lastActiveBlock, setLastActiveBlock] = useState(new Block())

  useMount(() => {
    let cancelled = false

    api.getUBlock(_id).then((d) => {
      if (cancelled) return
      setIds({ ids: cast<strs>(d.data, []), needsUpdate: false })
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

  return (
    <Stack>
      {ids.ids.map((_id) => {
        return (
          <UBlock
            key={_id}
            _id={_id}
            isEditing={isEditing}
            readonly={readonly}
            autoFocus={_id === lastActiveBlock._id && lastActiveBlock.focus === 'FOCUS'}
            data={_id === lastActiveBlock._id ? lastActiveBlock.data || '' : undefined}
            addNewBlock={addNewBlock}
            deleteBlock={deleteBlock}
          />
        )
      })}
      <UBlock
        key={`factory-${lastActiveBlock._id}`}
        _id=""
        addNewBlock={addNewBlock}
        deleteBlock={setStr}
        isFactory={true}
        autoFocus={Boolean(lastActiveBlock._id) && lastActiveBlock.focus === 'NO_FOCUS'}
        onFactoryBackspace={() => setLastActiveBlock({ _id: ids.ids.slice(-1)[0] || '', focus: 'FOCUS' })}
      />
    </Stack>
  )
}

const sendData = (_id: str, ids: strs) => api.patchUBlock(_id, { data: JSON.stringify(ids) })

class Block {
  _id = ''
  focus: NewBlockFocus = 'NO_FOCUS'
  data?: str
}
