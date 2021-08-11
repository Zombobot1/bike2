import { Stack } from '@material-ui/core'
import { useState } from 'react'
import { api } from '../../../api/api'
import { useMount } from '../../../utils/hooks-utils'
import { JSObjectStr, setStr, str, strs } from '../../../utils/types'
import { cast } from '../../../utils/utils'
import { uuid } from '../../../utils/uuid'
import { AddNewBlock, NewBlockFocus, UBlockB } from '../types'
import { UBlock } from '../UBlock'

const sendData = (_id: str, ids: strs) => api.patchUBlock(_id, { data: JSON.stringify(ids) })

class Block {
  _id = ''
  focus: NewBlockFocus = 'NO_FOCUS'
  data?: str
}

export function UPage({ _id, isEditing, readonly }: UBlockB) {
  const [ids, setIds] = useState<strs>([])
  const [lastActiveBlock, setLastActiveBlock] = useState(new Block())

  useMount(() => {
    let cancelled = false

    api.getUBlock(_id).then((d) => {
      if (cancelled) return
      setIds(cast<strs>(d.data, []))
    })

    return () => {
      cancelled = true
    }
  })

  const addNewBlock: AddNewBlock = (underId = '', focus = 'FOCUS', data) => {
    const _id = uuid()
    api.postUBlock({ _id })
    setLastActiveBlock({ data, focus, _id })
    setIds((old) => {
      const blockAbove = old.indexOf(underId) + 1
      const r = [...old.slice(0, blockAbove), _id, ...old.slice(blockAbove, old.length)]
      sendData(_id, r)
      return r
    })
  }

  const deleteBlock = (id: str) => {
    setIds((old) => {
      const blockBefore = old.indexOf(id) - 1
      const la: Block = { _id: old[blockBefore] || '', focus: 'FOCUS' }
      setLastActiveBlock(la)
      const r = old.filter((_id) => _id !== id)
      sendData(_id, r)
      return r
    })
  }

  return (
    <Stack>
      {ids.map((_id) => {
        return (
          <UBlock
            key={_id}
            _id={_id}
            isEditing={isEditing}
            readonly={readonly}
            autoFocus={_id === lastActiveBlock._id && lastActiveBlock.focus === 'FOCUS'}
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
        onFactoryBackspace={() => setLastActiveBlock({ _id: ids.slice(-1)[0] || '', focus: 'FOCUS' })}
      />
    </Stack>
  )
}
