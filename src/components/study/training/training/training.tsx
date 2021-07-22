import { CardDTOs } from '../types'
import { TrainingHeader } from '../training-header/training-header'
import { TrainingControls } from '../training-controls/training-controls'
import { useCards, usePagesPathUpdate } from './hooks'
import { CardCarousel } from './card-carousel'
import { Fn } from '../../../../utils/types'
import { Box } from '@material-ui/core'
import { useRouter } from '../../../utils/hooks/use-router'
import { useTraining } from '../../hooks'
import { safe } from '../../../../utils/utils'
import { FetchData } from '../../../utils/FetchedData'
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

export interface TrainingP {
  dto: TrainingDTO
  onLastCard: Fn
}

export const Training = ({ dto, onLastCard }: TrainingP) => {
  const { cards, onDeleteCard, currentCardIndex, estimateCard, timeToFinish, showHiddenFields, areFieldsHidden } =
    useCards(dto._id, dto.cards, onLastCard)

  return (
    <Box sx={{ height: '100%', maxWidth: 500, width: '100%', paddingBottom: 1 }}>
      <TrainingHeader timeToFinish={timeToFinish} currentCardIndex={currentCardIndex} cardsLength={cards.length} />
      <CardCarousel cards={cards} currentCardIndex={currentCardIndex} />
      <TrainingControls
        cardType={cards[currentCardIndex]?.dto?.type || 'PASSIVE'}
        estimate={estimateCard}
        showHiddenFields={showHiddenFields}
        areFieldsHidden={areFieldsHidden}
        currentCardIndex={currentCardIndex}
        deleteCard={onDeleteCard}
        cardId={cards[currentCardIndex]?.dto?._id || ''}
      />
    </Box>
  )
}

function TrainingWrapper_() {
  const { query } = useRouter()
  const { data } = useTraining(query('id') || '1')
  const dto = safe(data)
  const onLastCard = usePagesPathUpdate(dto)
  return <Training dto={dto} onLastCard={onLastCard} />
}

export const TrainingWrapper = () => (
  <FetchData>
    <TrainingWrapper_ />
  </FetchData>
)
