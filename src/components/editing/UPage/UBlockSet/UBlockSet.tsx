import { Stack, styled } from '@mui/material'
import { memo } from 'react'
import { str, bool, SetStr } from '../../../../utils/types'
import { UBlock } from '../UBlock/UBlock'
import { UBlocks } from '../ublockTypes'
import { UPageTitle } from '../UPageTitle'
import { upage } from '../useUPageInfo'
import { UBlockSetFactory } from './UBlockSetFactory'

export interface UBlocksSet {
  id: str
  blocks: UBlocks
  readonly?: bool

  hideFactory?: bool
  factoryPlaceholder?: str

  title?: str
  setTitle?: SetStr
}

export const UBlocksSet = memo(UBlocksSet_)

function UBlocksSet_({ id, blocks, readonly, factoryPlaceholder, hideFactory, title = '', setTitle }: UBlocksSet) {
  return (
    <Root>
      {setTitle && (
        <UPageTitle
          onEnter={upage.moveFocusDown}
          data={title}
          setData={setTitle}
          onDrop={upage.rearrange}
          onClick={upage.resetFocus}
        />
      )}
      {blocks.map((b) => (
        <UBlock key={b.id} block={b} readonly={readonly} />
      ))}
      {!readonly && !hideFactory && (
        <UBlockSetFactory
          addNewBlock={(data) => {
            if (data) upage.onFactoryChange(data, 'text', id)
            else upage.onFactoryEnter(id)
          }}
          onBackspace={upage.moveFocusUp} // uform factory is not focusable
          placeholder={factoryPlaceholder}
          onClick={upage.resetFocus}
        />
      )}
    </Root>
  )
}

const Root = styled(Stack, { label: 'UBlocksSet' })({})
