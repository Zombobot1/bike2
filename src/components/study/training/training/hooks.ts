import { CardDTO, CardDTOs, CardEstimation } from '../types'
import { useEffect, useState } from 'react'
import { deleteCard, estimateAnswer } from '../../../../api/api'
import { useMount } from '../../../../utils/hooks-utils'
import { Fn, num, StateT } from '../../../../utils/types'
import { useRouter } from '../../../utils/hooks/use-router'
import { TrainingDTO } from './training'
import { removeElement, safe } from '../../../../utils/utils'
import { useUserPosition } from '../../../Shell/navigation/breadcrumb/user-position-provider'
import { CardData, CardDatas } from './card-carousel'
import { useTrainingTimer } from '../training-timer/training-timer'
import { STUDY } from '../../../Shell/navigation/pages'
import { useSlides } from '../../../utils/Slides'

export const useTimeToFinish = (cards: CardDatas, currentCardIndex: number) => {
  const [timeToFinish, setTimeToFinish] = useState(0)
  const timeLeft = (from: number) => cards.slice(from).reduce((p, e) => p + safe(e.dto).timeToAnswer, 0)
  useEffect(() => setTimeToFinish(timeLeft(currentCardIndex)), [currentCardIndex, cards])

  return { timeToFinish }
}

export const useCardSettings = (cardsS: StateT<CardDatas>, currentCardIndex: num) => {
  const [cards, setCards] = cardsS

  const { setTimeToAnswer } = useTrainingTimer()

  const onDeleteCard = async () => {
    await deleteCard(safe(cards[currentCardIndex].dto)._id)
    setCards((cs) => {
      const result = removeElement(cs, currentCardIndex)
      setTimeToAnswer(result[currentCardIndex]?.dto?.timeToAnswer || 0)
      return result
    })
  }

  return { onDeleteCard, setTimeToAnswer }
}

type CardTransition = 'TRANSIT' | 'NO_TRANSITION'
export type EstimateCard = (v: CardEstimation, ct?: CardTransition) => Fn | undefined

const cardDTOToCardData = (dto: CardDTO): CardData => ({ dto, showHidden: false })
const cardDTOsToCardDatas = (dtos: CardDTOs) => dtos.map(cardDTOToCardData)

export const useCards = (trainingId: string, initialCards: CardDTOs, onLastCard: Fn) => {
  const [cards, setCards] = useState<CardDatas>(cardDTOsToCardDatas(initialCards))
  const slides = useSlides()
  const currentCardIndex = slides.currentSlide

  const { setTimeToAnswer, onDeleteCard } = useCardSettings([cards, setCards], currentCardIndex)

  const areFieldsHidden = !(cards[currentCardIndex]?.showHidden ?? false)
  const showHiddenFields = () =>
    setCards((cs) => cs.map((c, i) => (i === currentCardIndex ? { ...c, showHidden: true } : c)))

  const goToNextCard = slides.next

  useEffect(() => {
    if (currentCardIndex >= cards.length) return
    setTimeToAnswer(safe(cards[currentCardIndex].dto).timeToAnswer)
  }, [currentCardIndex])

  const { timeToFinish } = useTimeToFinish(cards, currentCardIndex)
  const [isLoading, setIsLoading] = useState(false)

  const estimateCard: EstimateCard = (e: CardEstimation, transition: CardTransition = 'TRANSIT'): Fn | undefined => {
    setIsLoading(true)
    const hasCards = currentCardIndex < cards.length - 1

    setCards((cs) => cs.map((c, i) => (i === currentCardIndex ? { ...c, estimation: e } : c)))

    estimateAnswer({ deckId: trainingId, cardId: safe(cards[currentCardIndex].dto)._id, estimation: e }).then(
      (cards) => {
        setCards((cs) => [...cs, ...cardDTOsToCardDatas(cards)])
        setIsLoading(false)
        if (transition === 'TRANSIT' && !hasCards) goToNextCard()
      },
    )

    if (transition === 'TRANSIT' && hasCards) goToNextCard()
    else if (transition === 'NO_TRANSITION') return goToNextCard
  }

  useEffect(() => {
    if (!isLoading && currentCardIndex >= cards.length) onLastCard()
  }, [cards, isLoading, currentCardIndex])

  return {
    cards,
    onDeleteCard,
    areFieldsHidden,
    showHiddenFields,
    currentCardIndex,
    estimateCard,
    timeToFinish,
  }
}

type OnLastCard = Fn
export const usePagesPathUpdate = ({ _id, deckName }: TrainingDTO): OnLastCard => {
  const { history } = useRouter()
  const { setPath, clearPath } = useUserPosition()

  useMount(() => {
    setPath([{ name: deckName }])
  })

  return () => {
    history.push(STUDY)
    clearPath()
  }
}
