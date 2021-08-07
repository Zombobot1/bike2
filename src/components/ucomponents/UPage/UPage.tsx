import { Stack } from '@material-ui/core'
import { useState } from 'react'
import { api } from '../../../api/api'
import { useMount } from '../../../utils/hooks-utils'
import { JSObjectStr, str, strs } from '../../../utils/types'
import { cast, uuid } from '../../../utils/utils'
import { AddNewBlock, UBlockB } from '../types'
import { UBlock } from '../UBlock'

class IMap {
  _map: JSObjectStr = {}

  get(key: str): str {
    return this._map[key] || ''
  }

  set(k: str, v: str): IMap {
    const result = new IMap()
    result._map = { ...this._map, [k]: v }
    return result
  }
}

class State {
  ids: strs = []
  tmpAndRealIds = new IMap()
}

function sendData(_id: str, state: State) {
  const data = state.ids.map((id) => (isTmp(id) ? state.tmpAndRealIds.get(id) : id)).filter(Boolean)
  api.patchStrBlock(_id, { data: JSON.stringify(data) })
}

export function UPage({ _id, isEditing, readonly }: UBlockB) {
  const [state, setState] = useState(new State())
  const [lastAddedId, setLastAddedId] = useState('')
  const { ids } = state

  useMount(() => {
    let cancelled = false

    api.getStrBlock(_id).then((d) => {
      if (cancelled) return
      setState((old) => ({ ...old, ids: [...cast<strs>(d.data, []), getTempId()] }))
    })

    return () => {
      cancelled = true
    }
  })

  function addBlockToProjection(tmpId: str, realId: str) {
    setState((old) => {
      const result = { ...old }
      if (old.ids.includes(tmpId)) {
        result.tmpAndRealIds = old.tmpAndRealIds.set(tmpId, realId)
        sendData(_id, result)
      } else api.deleteStrBlock(realId)

      return result
    })
  }

  const addNewBlock: AddNewBlock = (underId, focus) => {
    const tmpId = getTempId()
    if (focus === 'FOCUS') setLastAddedId(tmpId)
    setState((old) => {
      const blockAbove = old.ids.indexOf(underId) + 1
      return { ...old, ids: [...old.ids.slice(0, blockAbove), tmpId, ...old.ids.slice(blockAbove, old.ids.length)] }
    })
  }

  const deleteBlock = (id: str) => {
    setState((old) => {
      const result = { ...old, ids: old.ids.filter((_id) => _id !== id) }
      sendData(_id, result)
      return result
    })
  }

  return (
    <Stack>
      {ids.map((id, i) => {
        const updateId =
          isTmp(id) && !state.tmpAndRealIds.get(id) ? (realId: str) => addBlockToProjection(id, realId) : undefined
        return (
          <UBlock
            key={id}
            isEditing={isEditing}
            readonly={readonly}
            _id={isTmp(id) ? '' : id}
            autoFocus={id === lastAddedId}
            replaceTmpIdByReal={updateId}
            addNewBlock={addNewBlock}
            tmpId={isTmp(id) ? id : undefined}
            isFactory={i === ids.length - 1}
            deleteBlock={deleteBlock}
          />
        )
      })}
    </Stack>
  )
}
const isTmp = (id: str) => id.startsWith('tmp-')
const getTempId = () => `tmp-${uuid()}`
// const LastBlock
