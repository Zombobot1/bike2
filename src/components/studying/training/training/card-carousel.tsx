import { UCard } from '../../../decks/UCard/UCard'
import { CardDTO, CardEstimation } from '../types'
import { styled } from '@material-ui/core'
import { Slides } from '../../../utils/Slides/Slides'
import { TrainingEnd } from '../TrainingEnd/TrainingEnd'
import { str } from '../../../../utils/types'
import { useMistakesCounter } from './hooks'
import { useTrainingTimer } from '../training-timer/training-timer'

export interface CardData {
  dto: CardDTO
  showHidden?: boolean
  estimation?: CardEstimation
}
export type CardDatas = CardData[]
export type CardDataP = Promise<CardData>

export interface CardCarouselP {
  cards: CardDatas
  currentTrainingId: str
}

export const CardCarousel = ({ cards, currentTrainingId }: CardCarouselP) => {
  const { mistakesCount } = useMistakesCounter()
  const { totalTime } = useTrainingTimer()
  const expectedTime = cards.reduce((p, c) => p + (c.dto?.timeToAnswer || 0), 0)
  return (
    <Cards>
      <Slides timeout={500}>
        {cards.map((c) => (
          <UCard
            key={c.dto._id}
            fields={c.dto.fields}
            stageColor={c.dto.stageColor}
            estimation={c.estimation}
            isMediaActive={true}
            showHidden={c.showHidden || false}
            readonly={true}
          />
        ))}
        <TrainingEnd
          key={-1}
          currentTrainingId={currentTrainingId}
          mistakesCount={mistakesCount}
          spentTime={totalTime}
          expectedTime={expectedTime}
        />
      </Slides>
    </Cards>
  )
}

const Cards = styled('div')({
  width: '100%',
  height: '90%',
  paddingTop: 5,
  paddingBottom: 7,
})
