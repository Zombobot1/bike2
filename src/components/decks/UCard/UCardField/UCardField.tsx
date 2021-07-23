import { FieldDTO, FieldType } from '../../../study/training/types'
import { UInput } from '../../../uform/ufields/uinput'
import { useInteractiveSubmit } from '../../../study/training/hooks'
import { UChecks } from '../../../uform/ufields/uchecks'
import { UAudioField } from './UAudioField'
import { PassiveData } from './types'
import { UImageField } from './UImageField'
import { UTextField } from './UTextField'
import { useNewCardDataField } from '../../UCardEditor/useNewCardData'

export interface UCardField extends Omit<FieldDTO, 'status' | 'isPreview'> {
  isMediaActive: boolean
  canBeEdited: boolean
}

export const UCardField = ({
  _id = '',
  name,
  passiveData,
  interactiveData,
  type,
  isMediaActive,
  canBeEdited,
}: UCardField) => {
  const { interactiveSubmit } = useInteractiveSubmit()
  const newDataProps = useNewCardDataField(_id, name)

  if (passiveData || canBeEdited)
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

  if (interactiveData) {
    return (
      <>
        {type === 'RADIO' && <UChecks _id={_id} {...interactiveData} onAnswer={interactiveSubmit} />}
        {type === 'INPUT' && <UInput _id={_id} {...interactiveData} onAnswer={interactiveSubmit} />}
      </>
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
      {props.type === 'AUDIO' && <UAudioField {...props} />}
    </>
  )
}
