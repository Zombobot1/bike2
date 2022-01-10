import { useEffect, useState } from 'react'
import { SetStr, str, strs } from '../../../utils/types'
import { setRoot } from '../UPage/blockIdAndInfo'
import { UBlocksSet } from './UBlockSet'
import { AddedBlocks } from '../types'

interface SetForStories {
  id: str
  ids: strs
  title?: str
  setTitle?: SetStr
}

export function SetForStories({ id, ids: initial, title, setTitle }: SetForStories) {
  const [ids, setIds] = useState(initial)
  const [addedBlocks, setAddedBlocks] = useState<AddedBlocks>([])

  useEffect(() => setRoot(id), [id])

  return (
    <UBlocksSet
      id={id}
      ids={ids}
      setIds={setIds}
      addedBlocks={addedBlocks}
      setAddedBlocks={setAddedBlocks}
      title={title}
      setTitle={setTitle}
    />
  )
}
