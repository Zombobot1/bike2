import { CardDTO, CardDTOs, CardType, FieldDTO } from '../types'
import { TrainingHeader } from '../training-header/training-header'
import { TrainingControls } from '../training-controls/training-controls'
import { useCards } from './hooks'
import { CardCarousel } from './card-carousel'
import { Fn } from '../../../../utils/types'
import { Box } from '@mui/material'
import { Fetch } from '../../../utils/Fetch/Fetch'
import { TrainingConceptsInfoP } from '../../trainings/training-deck/training-card/training-cards-info/training-concepts-info'

export interface TrainingDTO {
  _id: string
  deckName: string
  deckColor: string
  deckPath: string
  trainingConceptsInfo: TrainingConceptsInfoP
  cards: CardDTOs
}

export interface TrainingsGroupDTO {
  rootDeckName: string
  trainings: TrainingDTO[]
}
export type TrainingsGroupDTOs = TrainingsGroupDTO[]

export interface TrainingP {
  dto: TrainingDTO
  onLastCard: Fn
}

export const Training = ({ dto, onLastCard }: TrainingP) => {
  const {
    cards,
    onDeleteCard,
    currentCardIndex,
    estimateCard,
    timeToFinish,
    showHiddenFields,
    areFieldsHidden,
    isAtEnd,
  } = useCards(dto._id, dto.cards)

  return (
    <Box sx={{ height: '100%', maxWidth: 500, width: '100%', paddingBottom: 1 }}>
      <TrainingHeader timeToFinish={timeToFinish} currentCardIndex={currentCardIndex} cardsLength={cards.length} />
      <CardCarousel cards={cards} currentTrainingId={dto._id} />
      <TrainingControls
        cardType={cardType(cards[currentCardIndex]?.dto)}
        estimate={estimateCard}
        showHiddenFields={showHiddenFields}
        areFieldsHidden={areFieldsHidden}
        currentCardIndex={currentCardIndex}
        deleteCard={onDeleteCard}
        cardId={cards[currentCardIndex]?.dto?._id || ''}
        onTrainingEnd={onLastCard}
        isAtEnd={isAtEnd}
      />
    </Box>
  )
}

function cardType(dto?: CardDTO): CardType {
  if (!dto) return 'passive'
  if (dto.hiddenFields?.length) return 'passive'
  if (dto.fields.find((f) => f.type === 'long-answer')) return 'passive'

  return 'interactive'
}

function _preloadImage(field: FieldDTO) {
  if (field.type !== 'image' || !field.data) return
  const img = new Image()
  img.src = field.data
}

function TrainingWrapper_() {
  // const { query } = useRouter()
  // const { data } = useTraining(query('id') || '1')
  // const dto = safe(data)
  // const onLastCard = usePagesPathUpdate(dto)

  // useMount(() => dto.cards.forEach((c) => c.fields.forEach(preloadImage)))

  // return <Training dto={dto} onLastCard={onLastCard} //>
  return null
}

export const TrainingWrapper = () => (
  <Fetch>
    <TrainingWrapper_ />
  </Fetch>
)
