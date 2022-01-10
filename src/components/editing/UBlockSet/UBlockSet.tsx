import { Stack, styled } from '@mui/material'
import { memo } from 'react'
import { bool, SetStr, str, strs } from '../../../utils/types'
import { AddedBlocks, SetIds } from '../types'
import { UBlock } from '../UBlock/UBlock'
import { UFormFieldInfo } from '../../uforms/types'
import { CreateColumn, useUBlockSet } from './useUBlockSet'
import { UPageTitle } from '../UPage/UPageTitle'
import { UBlockSetFactory } from './UBlockSetFactory'

export interface UBlocksSet {
  id: str
  ids: strs
  setIds: SetIds
  addedBlocks: AddedBlocks
  setAddedBlocks: (b: AddedBlocks) => void
  readonly?: bool

  hideFactory?: bool
  factoryPlaceholder?: str

  uformPs?: UFormFieldInfo
  createColumn?: CreateColumn
  title?: str
  setTitle?: SetStr
}

export const UBlocksSet = memo(UBlocksSet_, (old, new_) => JSON.stringify(old) === JSON.stringify(new_))

function UBlocksSet_({
  id,
  ids,
  setIds,
  addedBlocks,
  setAddedBlocks,
  readonly,
  factoryPlaceholder,
  hideFactory,
  uformPs,
  createColumn,
  title,
  setTitle,
}: UBlocksSet) {
  const blocks = useUBlockSet({ id, createColumn, setAddedBlocks }, setIds)

  return (
    <Root>
      {setTitle && (
        <UPageTitle
          onEnter={() => blocks.focusD({ a: 'title-enter' })}
          data={title || ''}
          setData={setTitle}
          onDrop={() => blocks.rearrangeBlocks('title')}
          onClick={() => blocks.focusD({ a: 'reset' })}
        />
      )}
      {ids.map((_id, i) => {
        return (
          <UBlock
            key={_id}
            id={_id}
            parentId={id}
            i={i}
            readonly={readonly}
            blockManagement={blocks}
            initialData={addedBlocks.find((b) => b.id === _id)}
            uformPs={uformPs}
          />
        )
      })}
      {!readonly && !hideFactory && (
        <UBlockSetFactory
          addNewBlock={(data) => blocks.addNewBlocks('', !data ? 'no-focus' : 'focus-end', data)}
          onBackspace={() => blocks.focusD({ a: 'factory-backspace' })}
          placeholder={factoryPlaceholder}
          onClick={() => blocks.focusD({ a: 'reset' })}
        />
      )}
    </Root>
  )
}

const Root = styled(Stack, { label: 'UBlocksSet' })({})
