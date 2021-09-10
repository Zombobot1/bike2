import { Stack, styled } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useReactive, useMount } from '../utils/hooks/hooks'
import { bool, fn, Fn, setStr, SetStr, str } from '../../utils/types'
import {
  AddNewBlock,
  isUFormComponent,
  NewBlockFocus,
  regexAndType,
  UBlockB,
  UComponentType,
  UFormBlockComponent,
} from './types'
import { UHeading1, UHeading2, UHeading3, UParagraph } from './UText/UText'
import { UFile } from './UFile/UFile'
import { UAudioFile } from './UFile/UAudioFile/UAudioFile'
import { UImageFile } from './UFile/UImageFile/UImageFile'
import { UFormBlock } from '../uforms/UFormBlock/UFormBlock'
import { useData } from '../utils/hooks/useData'

type InitialData = { data: str; type: UComponentType }
export interface UBlock extends UBlockB {
  addNewBlock?: AddNewBlock
  deleteBlock?: SetStr
  autoFocus?: bool
  initialData?: InitialData
  isFactory?: bool
  onFactoryBackspace?: Fn
  placeholder?: str

  autoplay?: bool
  isCardField?: bool
  onAnswer?: Fn
}

interface UBlockDTO {
  data: str
  type: UComponentType
  isDeleted?: bool
}

export function UBlock(props: UBlock) {
  if (props.isFactory) return <Factory {...props} />
  return <UBlock_ {...props} />
}

function UBlock_({
  id,
  initialData,
  addNewBlock = fn,
  readonly = false,
  autoFocus: initialAutoFocus = false,
  isFactory = false,
  deleteBlock = fn,
  onFactoryBackspace,
  placeholder,
  autoplay: _,
  onAnswer,
  isCardField,
}: UBlock) {
  const [ublock, setUBlock] = useData<UBlockDTO>('ublocks', id, initialData)

  const [autoFocus, setAutoFocus] = useReactive(initialAutoFocus)
  const setData = (data: str) => setUBlock({ ...ublock, data })

  const commonProps = { data: ublock.data, setData, readonly }

  const utextProps = {
    ...commonProps,
    tryToChangeFieldType: tryToChangeFieldType(setAutoFocus, (t) => setUBlock({ ...ublock, type: t }), setData),
    autoFocus,
    addNewBlock: (focus?: NewBlockFocus, data?: str) => addNewBlock(id, focus, data),
    deleteBlock: () => {
      deleteBlock(id)
      setUBlock({ isDeleted: true })
    },
    isFactory,
    onFactoryBackspace,
    placeholder,
    isCardField,
  }

  const type = ublock.type
  return (
    <Container>
      {type === 'TEXT' && <UParagraph {...utextProps} />}
      {type === 'HEADING1' && <UHeading1 {...utextProps} />}
      {type === 'HEADING2' && <UHeading2 {...utextProps} />}
      {type === 'HEADING3' && <UHeading3 {...utextProps} />}
      {type === 'FILE' && <UFile {...commonProps} />}
      {type === 'IMAGE' && <UImageFile {...commonProps} />}
      {type === 'AUDIO' && <UAudioFile {...commonProps} />}
      {isUFormComponent(type) && (
        <UFormBlock {...commonProps} _id={id || ''} type={type as UFormBlockComponent} onAnswer={onAnswer} />
      )}
    </Container>
  )
}

function Factory({ autoFocus = false, onFactoryBackspace, placeholder }: UBlock) {
  return (
    <Container>
      <UParagraph
        autoFocus={autoFocus}
        addNewBlock={fn}
        isFactory={true}
        onFactoryBackspace={onFactoryBackspace}
        placeholder={placeholder}
        data=""
        setData={setStr}
        tryToChangeFieldType={setStr}
      />
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
