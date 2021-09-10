import { UCard } from './UCard'
import { cardWithDifferentFields, cardWithQandA, uCardLong, uCardMinimal } from '../../../content/trainingsAndDecks'

const T = (args: UCard) => (
  <div style={{ width: '500px', height: '715px' }}>
    <UCard {...args} />
  </div>
)

const hiddenA: UCard = {
  stageColor: '#6C38FF',
  showHidden: false,
  fields: uCardLong.fields,
  isMediaActive: false,
  readonly: true,
}

const template1: UCard = {
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardLong.fields,
  hiddenFields: uCardLong.hiddenFields,
  readonly: true,
}

const allFieldsShownA: UCard = {
  ...template1,
}

const estimatedA: UCard = {
  ...template1,
  estimation: 'GOOD',
}

const template2 = {
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardMinimal.fields,
  readonly: true,
}

const minimalA: UCard = {
  ...template2,
  showHidden: false,
}

const minimalHiddenA: UCard = {
  ...template2,
}

const longTextA: UCard = {
  ...template1,
  fields: cardWithQandA.fields,
}

const interactiveAndPassiveA: UCard = {
  ...template1,
  fields: cardWithDifferentFields.fields,
}

export const Hidden = () => T(hiddenA)
export const AllFieldsShown = () => T(allFieldsShownA)
export const Estimated = () => T(estimatedA)
export const Minimal = () => T(minimalA)
export const MinimalHidden = () => T(minimalHiddenA)
export const LongText = () => T(longTextA)
export const InteractiveAndPassive = () => T(interactiveAndPassiveA)

export default {
  title: 'Decks/UCard',
}
