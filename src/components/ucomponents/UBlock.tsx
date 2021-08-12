import { styled } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { api } from '../../api/api'
import { useEffectedState, useMount } from '../../utils/hooks-utils'
import { bool, Fn, SetStr, str } from '../../utils/types'
import {
  AddNewBlock,
  isUFormComponent,
  NewBlockFocus,
  regexAndType,
  UBlockB,
  UComponentType,
  UFormComponent,
} from './types'
import { UHeading1, UHeading2, UHeading3, UParagraph } from './UText/UText'
import { UFile } from './UFile/UFile'
import { UAudioFile } from './UFile/UAudioFile/UAudioFile'
import { UImageFile } from './UFile/UImageFile/UImageFile'
import { UFormBlock } from '../uform/UFormBlock/UFormBlock'

export interface UBlock extends UBlockB {
  addNewBlock: AddNewBlock
  deleteBlock: SetStr
  autoFocus?: bool
  data?: str
  type?: UComponentType
  isFactory?: bool
  onFactoryBackspace?: Fn
}

export function UBlock({
  _id,
  type: initialType,
  data: initialData,
  addNewBlock,
  readonly = false,
  isEditing = false,
  autoFocus: initialAutoFocus = false,
  isFactory = false,
  deleteBlock,
  onFactoryBackspace,
}: UBlock) {
  const [data, setData_] = useState(initialData || '')
  const [type, setType_] = useState<UComponentType>(initialType || 'TEXT')
  const [autoFocus, setAutoFocus] = useEffectedState(initialAutoFocus)
  const [needNewBlock, setNeedNewBlock] = useState<NewBlockFocus | null>(null)

  useEffect(() => {
    if (needNewBlock && addNewBlock) addNewBlock(_id, needNewBlock)
  }, [needNewBlock])

  const setData = (d: str) => {
    setData_(d)
    api.patchUBlock(_id, { data: d })
  }

  const setType = (t: UComponentType) => {
    setType_(t)
    api.patchUBlock(_id, { type: t })
  }

  const commonProps = { data, setData, readonly }

  const utextProps = {
    ...commonProps,
    tryToChangeFieldType: tryToChangeFieldType(setAutoFocus, setType, setData_),
    autoFocus,
    addNewBlock: (focus?: NewBlockFocus, data?: str) => addNewBlock(_id, focus, data),
    produceNewBlock: isFactory ? setNeedNewBlock : undefined,
    deleteBlock: () => {
      deleteBlock(_id)
      api.deleteUBlock(_id)
    },
    isFactory,
    onFactoryBackspace,
  }

  useMount(() => {
    if (isFactory) return
    if (initialData !== undefined) return

    let cancelled = false

    api.getUBlock(_id).then((d) => {
      if (cancelled) return
      setData_(d.data)
      setType_(d.type)
    })

    return () => {
      cancelled = true
    }
  })

  return (
    <Container>
      {type === 'TEXT' && <UParagraph {...utextProps} />}
      {type === 'HEADING1' && <UHeading1 {...utextProps} />}
      {type === 'HEADING2' && <UHeading2 {...utextProps} />}
      {type === 'HEADING3' && <UHeading3 {...utextProps} />}
      {type === 'FILE' && <UFile {...commonProps} />}
      {type === 'AUDIO' && <UAudioFile {...commonProps} />}
      {type === 'IMAGE' && <UImageFile {...commonProps} />}
      {isUFormComponent(type) && (
        <UFormBlock _id={_id} type={type as UFormComponent} isEditing={isEditing} {...commonProps} />
      )}
    </Container>
  )
}

const Container = styled('div', { label: 'UBlock' })({
  width: '100%',
  minHeight: '1.5rem',
})

const tryToChangeFieldType =
  (setAutoFocus: (v: bool) => void, setType: (v: UComponentType) => void, setData: (v: str) => void) =>
  (newData: str) => {
    if (!newData.includes(' ')) return

    const firstElement = newData.split(' ')
    const newType = regexAndType.get(firstElement[0])
    if (!newType) return

    setAutoFocus(true)
    setType(newType)
    setData('')
  }
