import { UCard } from './UCard'
import { cardWithDifferentFields, cardWithQandA, uCardLong, uCardMinimal } from '../../../content/content'

const QACardT = (args: UCard) => (
  <div style={{ width: '500px', height: '715px' }}>
    <UCard {...args} />
  </div>
)

const hiddenA: UCard = {
  stageColor: '#6C38FF',
  showHidden: false,
  fields: uCardLong.fields,
  isMediaActive: false,
}

const template1 = {
  stageColor: '#6C38FF',
  isMediaActive: false,
  showHidden: true,
  fields: uCardLong.fields,
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

export const Hidden = () => QACardT(hiddenA)
export const AllFieldsShown = () => QACardT(allFieldsShownA)
export const Estimated = () => QACardT(estimatedA)
export const Minimal = () => QACardT(minimalA)
export const MinimalHidden = () => QACardT(minimalHiddenA)
export const LongText = () => QACardT(longTextA)
export const InteractiveAndPassive = () => QACardT(interactiveAndPassiveA)
