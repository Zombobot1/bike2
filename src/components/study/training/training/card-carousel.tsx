import { UCard } from '../../../decks/UCard/UCard'
import { CardDTO, CardEstimation } from '../types'
import { styled } from '@material-ui/core'
import { CardTemplateDTO } from '../../../decks/dto'
import { Slides } from '../../../utils/Slides'
import { TrainingEnd } from '../TrainingEnd/TrainingEnd'
import { str } from '../../../../utils/types'
import { useMistakesCounter } from './hooks'
import { useTrainingTimer } from '../training-timer/training-timer'

export interface CardData {
  dto?: CardDTO
  showHidden?: boolean
  estimation?: CardEstimation
  template?: CardTemplateDTO
}
export type CardDatas = CardData[]
export type CardDataP = Promise<CardData>

export interface CardCarouselP {
  cards: CardDatas
  currentTrainingId: str
}

const Cards = styled('div')({
  width: '100%',
  height: '90%',
  paddingTop: 5,
  paddingBottom: 7,
})

export const CardCarousel = ({ cards, currentTrainingId }: CardCarouselP) => {
  const { mistakesCount } = useMistakesCounter()
  const { totalTime } = useTrainingTimer()
  const expectedTime = cards.reduce((p, c) => p + (c.dto?.timeToAnswer || 0), 0)
  return (
    <Cards>
      <Slides>
        {cards.map((c, i) => (
          <UCard
            key={c.dto?._id || i}
            fields={c.dto?.fields || []}
            stageColor={c.dto?.stageColor || 'white'}
            showHidden={c.showHidden}
            estimation={c.estimation}
            template={c.template}
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
