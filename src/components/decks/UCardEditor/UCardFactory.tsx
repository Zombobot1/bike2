import { getPreviewName } from '../dto'
import { EditingUCard } from '../UCard/UCard'
import { useNewCardData, useSubmitNewCardData } from './useNewCardData'
import { CardTemplateDTO } from '../dto'
import { NewCardData } from './useNewCardData'
import { CardDataP, CardData } from '../../study/training/training/card-carousel'
import { useEffect } from 'react'

export function UCardFactory({ addCreatedCard, onSubmit, template, prepopulatedData = [] }: UCardFactory) {
  const { submit, setNewCardData, newCardData } = useNewCardData(getPreviewName(template))
  const { setSubmit } = useSubmitNewCardData()

  function afterSubmit(createdCard: CardData) {
    setNewCardData(prepopulatedData)
    addCreatedCard(createdCard)
  }

  useEffect(() => setSubmit(() => submit((d) => onSubmit(d).then(afterSubmit))), [JSON.stringify(newCardData)])

  return <EditingUCard template={template} />
}

export interface UCardFactory {
  template: CardTemplateDTO
  addCreatedCard: (cd: CardData) => void
  onSubmit: (d: NewCardData) => CardDataP
  prepopulatedData?: NewCardData
}
