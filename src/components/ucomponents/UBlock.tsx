import { styled } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { api } from '../../api/api'
import { useMount } from '../../utils/hooks-utils'
import { bool, SetStr, str } from '../../utils/types'
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
  tmpId?: str
  autoFocus?: bool
  addNewBlock?: AddNewBlock
  deleteBlock?: SetStr
  replaceTmpIdByReal?: SetStr
  type?: UComponentType
  isFactory?: bool
}

export function UBlock({
  _id,
  tmpId,
  type: initialType,
  addNewBlock,
  replaceTmpIdByReal,
  readonly = false,
  isEditing = false,
  autoFocus: initialAutoFocus = false,
  isFactory = false,
  deleteBlock,
}: UBlock) {
  const [data, setData_] = useState('')
  const [type, setType_] = useState<UComponentType>(initialType || 'TEXT')
  const [autoFocus, setAutoFocus] = useState(initialAutoFocus)
  const [id, setId] = useState(_id)
  const [needNewBlock, setNeedNewBlock] = useState<NewBlockFocus | null>(null)

  useEffect(() => {
    if (!needNewBlock) return

    if (addNewBlock) addNewBlock(tmpId || '', needNewBlock)

    let cancelled = false

    api.postStrBlock({ type }).then((d) => {
      if (cancelled) return
      setId(d._id)
      if (replaceTmpIdByReal) replaceTmpIdByReal(d._id)
    })

    return () => {
      cancelled = true
    }
  }, [needNewBlock])

  const setData = (d: str) => {
    setData_(d)
    if (id) api.patchStrBlock(id, { data: d })
  }

  const setType = (t: UComponentType) => {
    setType_(t)
    if (id) api.patchStrBlock(id, { type: t })
  }

  const commonProps = { data, setData, readonly }

  const utextProps = {
    ...commonProps,
    tryToChangeFieldType: tryToChangeFieldType(setAutoFocus, setType, setData_),
    autoFocus,
    addNewBlock: addNewBlock ? () => addNewBlock(tmpId || id, 'FOCUS') : undefined,
    produceNewBlock: isFactory ? setNeedNewBlock : undefined,
    deleteBlock: deleteBlock
      ? () => {
          deleteBlock(tmpId || id)
          api.deleteStrBlock(id)
        }
      : undefined,
  }

  useMount(() => {
    if (isFactory) return

    let cancelled = false

    if (!id) {
      api.postStrBlock({ type }).then((d) => {
        if (replaceTmpIdByReal) replaceTmpIdByReal(d._id) // to detect removed blocks
        if (cancelled) return
        setId(d._id)
      })
    } else {
      api.getStrBlock(id).then((d) => {
        if (cancelled) return
        setData_(d.data)
        setType_(d.type)
      })
    }

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
