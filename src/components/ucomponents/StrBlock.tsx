import { styled } from '@material-ui/core'
import { useState } from 'react'
import { api } from '../../api/api'
import { useMount } from '../../utils/hooks-utils'
import { bool, str } from '../../utils/types'
import { regexAndType, UComponentType } from './types'
import { UHeading1, UHeading2, UHeading3, UText } from './EditableText/EditableText'
import { UFile } from './UFile/UFile'
import { UAudioFile } from './UFile/UAudioFile/UAudioFile'

export interface StrBlock {
  _id: str
  type?: UComponentType
  readonly?: bool
}

export function StrBlock({ _id, type: initialType, readonly = false }: StrBlock) {
  const [data, setData_] = useState('')
  const [type, setType_] = useState<UComponentType>(initialType || 'TEXT')
  const [autoFocus, setAutoFocus] = useState(false)
  const [id, setId] = useState(_id)

  const setData = (d: str) => {
    setData_(d)
    api.patchStrBlock(id, { data: d }).catch(console.error)
  }

  const setType = (t: UComponentType) => {
    setType_(t)
    api.patchStrBlock(id, { type: t }).catch(console.error)
  }

  const props = {
    data,
    setData,
    tryToChangeFieldType: tryToChangeFieldType(setAutoFocus, setType, setData_),
    autoFocus,
    readonly,
  }

  useMount(() => {
    let cancelled = false

    if (!id) {
      api.postStrBlock({ type }).then((d) => {
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
      {type === 'TEXT' && <UText {...props} />}
      {type === 'HEADING1' && <UHeading1 {...props} />}
      {type === 'HEADING2' && <UHeading2 {...props} />}
      {type === 'HEADING3' && <UHeading3 {...props} />}
      {type === 'FILE' && <UFile {...props} />}
      {type === 'AUDIO' && <UAudioFile {...props} />}
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
