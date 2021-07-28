import { styled } from '@material-ui/core'
import { useState } from 'react'
import { str } from '../../utils/types'
import { regexAndType, UComponentType } from './types'
import { UHeading1, UHeading2, UHeading3, UText } from './UText/UText'

export interface UComponent {
  initialData: str
  initialType: UComponentType
}

export function UComponent({ initialData, initialType }: UComponent) {
  const dataS = useState(initialData)
  const [type, setType] = useState<UComponentType>(initialType)
  const [autoFocus, setAutoFocus] = useState(false)

  console.log('hi')

  function tryToChangeFieldType(newData: str) {
    if (!newData.includes('&nbsp;')) return

    const firstElement = newData.split('&nbsp;')
    const newType = regexAndType.get(firstElement[0])
    if (!newType) return

    setAutoFocus(true)
    setType(newType)
    dataS[1]('')
  }

  const props = { dataS, tryToChangeFieldType, autoFocus }

  return (
    <Container>
      {type === 'TEXT' && <UText {...props} />}
      {type === 'Heading1' && <UHeading1 {...props} />}
      {type === 'Heading2' && <UHeading2 {...props} />}
      {type === 'Heading3' && <UHeading3 {...props} />}
    </Container>
  )
}

const Container = styled('div')({
  width: '100%',
  minHeight: '1.5rem',
  backgroundColor: 'pink',
})
