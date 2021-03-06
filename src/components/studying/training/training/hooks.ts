import { CardDTO, CardDTOs, CardEstimation, isMistake } from '../types'
import { useEffect, useState } from 'react'
import { useUnmount } from '../../../utils/hooks/hooks'
import { Fn, num, State } from '../../../../utils/types'
import { _TrainingDTO as TrainingDTO } from './training'
import { removeElement, safe } from '../../../../utils/utils'
import { CardData, CardDatas } from './card-carousel'
import { useTrainingTimer } from '../training-timer/training-timer'
import { useSlides } from '../../../utils/Slides/Slides'
import { atom, useAtom } from 'jotai'

const mistakesCountA = atom(0)

export function useMistakesCounter() {
  const [mistakesCount, setMistakesCount] = useAtom(mistakesCountA)
  return {
    mistakesCount,
    resetMistakesCount: () => setMistakesCount(0),
    registerMistake: (e: CardEstimation) => {
      if (isMistake(e)) setMistakesCount((c) => c + 1)
    },
  }
}

export const useTimeToFinish = (cards: CardDatas, currentCardIndex: number) => {
  const [timeToFinish, setTimeToFinish] = useState(0)
  const timeLeft = (from: number) => cards.slice(from).reduce((p, e) => p + safe(e.dto).timeToAnswer, 0)
  useEffect(() => setTimeToFinish(timeLeft(currentCardIndex)), [currentCardIndex, cards])

  return { timeToFinish }
}

export const useCardSettings = (cardsS: State<CardDatas>, currentCardIndex: num) => {
  const [_cards, setCards] = cardsS

  const { setTimeToAnswer } = useTrainingTimer()

  const onDeleteCard = async () => {
    // await api.deleteCard(safe(cards[currentCardIndex].dto)._id)
    setCards((cs) => {
      const result = removeElement(cs, currentCardIndex)
      setTimeToAnswer(result[currentCardIndex]?.dto?.timeToAnswer || 0)
      return result
    })
  }

  return { onDeleteCard, setTimeToAnswer }
}

type CardTransition = 'transit' | 'no-transition'
export type EstimateCard = (e: CardEstimation, ct?: CardTransition) => Fn | undefined

const cardDTOToCardData = (dto: CardDTO): CardData => ({ dto, showHidden: false })
const cardDTOsToCardDatas = (dtos: CardDTOs) => dtos.map(cardDTOToCardData)

export const useCards = (trainingId: string, initialCards: CardDTOs) => {
  const { resetMistakesCount, registerMistake } = useMistakesCounter()

  const [cards, setCards] = useState<CardDatas>(cardDTOsToCardDatas(initialCards))
  const slides = useSlides()

  useEffect(() => {
    setCards(cardDTOsToCardDatas(initialCards))
    resetMistakesCount()
    slides.first()
  }, [trainingId])

  const currentCardIndex = slides.currentSlide

  const { setTimeToAnswer, onDeleteCard } = useCardSettings([cards, setCards], currentCardIndex)

  const areFieldsHidden = !(cards[currentCardIndex]?.showHidden ?? false)
  const showHiddenFields = () =>
    setCards((cs) => cs.map((c, i) => (i === currentCardIndex ? { ...c, showHidden: true } : c)))

  const goToNextCard = slides.next

  useEffect(() => {
    if (currentCardIndex >= cards.length) return
    setTimeToAnswer(cards[currentCardIndex]?.dto?.timeToAnswer || 0)
  }, [currentCardIndex])

  const { timeToFinish } = useTimeToFinish(cards, currentCardIndex)

  const estimateCard: EstimateCard = (e: CardEstimation, transition: CardTransition = 'transit'): Fn | undefined => {
    // const isLastCard = currentCardIndex < cards.length - 1

    setCards((cs) => cs.map((c, i) => (i === currentCardIndex ? { ...c, estimation: e } : c)))
    registerMistake(e)

    // api
    //   .estimateAnswer({ deckId: trainingId, cardId: cards[currentCardIndex]?.dto?._id || '', estimation: e })
    //   .then((cards) => {
    //     if (!isLastCard) setCards((cs) => [...cs, ...cardDTOsToCardDatas(cards)])
    //   })

    if (transition === 'transit') goToNextCard()
    else if (transition === 'no-transition') return goToNextCard
  }

  useUnmount(resetMistakesCount)

  return {
    cards,
    onDeleteCard,
    areFieldsHidden,
    showHiddenFields,
    currentCardIndex,
    estimateCard,
    timeToFinish,
    isAtEnd: slides.isLast,
  }
}

type OnLastCard = Fn
export const usePagesPathUpdate = ({ _id }: TrainingDTO): OnLastCard => {
  // const { history } = useRouter()
  return () => {
    // history.push(STUDY)
  }
}
