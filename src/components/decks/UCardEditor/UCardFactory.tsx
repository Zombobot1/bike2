import { useNewCardData, useSubmitNewCardData } from './useNewCardData'
import { CardTemplateDTO } from '../dto'
import { NewCardData } from './useNewCardData'
import { CardDataP, CardData } from '../../studying/training/training/card-carousel'
import { useEffect } from 'react'

export interface UCardFactory {
  template: CardTemplateDTO
  addCreatedCard: (cd: CardData) => void
  onSubmit: (d: NewCardData) => CardDataP
  prepopulatedData?: NewCardData
}

export function UCardFactory({ addCreatedCard, onSubmit, template: _, prepopulatedData = [] }: UCardFactory) {
  const { submit, setNewCardData, newCardData } = useNewCardData('')
  const { setSubmit } = useSubmitNewCardData()

  function afterSubmit(createdCard: CardData) {
    setNewCardData(prepopulatedData)
    addCreatedCard(createdCard)
  }

  useEffect(() => setSubmit(() => submit((d) => onSubmit(d).then(afterSubmit))), [JSON.stringify(newCardData)])

  return null
}
