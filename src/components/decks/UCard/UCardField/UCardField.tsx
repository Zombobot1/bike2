import { FieldDTO, FieldType, isPassive } from '../../../study/training/types'
import { useInteractiveSubmit } from '../../../study/training/hooks'
import { UAudioField } from './UAudioField'
import { PassiveData } from './types'
import { UImageField } from './UImageField'
import { UTextField } from './UTextField'
import { useNewCardDataField } from '../../UCardEditor/useNewCardData'

export interface UCardField extends Omit<FieldDTO, 'status' | 'isPreview'> {
  isMediaActive?: boolean
  canBeEdited?: boolean
}

export const UCardField = ({
  _id = '',
  name,
  passiveData,
  interactiveData,
  type,
  isMediaActive = false,
  canBeEdited = false,
}: UCardField) => {
  const { interactiveSubmit: _ } = useInteractiveSubmit()
  const newDataProps = useNewCardDataField(_id, name)

  if (passiveData || (canBeEdited && isPassive(type)))
    return (
      <PassiveField
        name={name}
        type={type}
        data={passiveData}
        canBeEdited={canBeEdited}
        isMediaActive={isMediaActive}
        {...newDataProps}
      />
    )

  if (interactiveData || canBeEdited) {
    return (
      <>{/* {type === 'RADIO' && <UChecks _id={_id} question={interactiveData} onAnswer={interactiveSubmit} />} */}</>
    )
  }

  return null
}

interface PassiveField extends PassiveData {
  type: FieldType
  isMediaActive: boolean
}

function PassiveField(props: PassiveField) {
  return (
    <>
      {props.type === 'PRE' && <UTextField {...props} />}
      {props.type === 'IMG' && <UImageField {...props} />}
      {props.type === 'AUDIO' && <UAudioField {...props} autoplay={props.isMediaActive} />}
    </>
  )
}
