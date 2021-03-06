import { IsSM, rstyled } from '../../../../utils/utils'
import { useEffect, useState } from 'react'
import { TrainingTimer, useTrainingTimer } from '../training-timer/training-timer'
import { CardType } from '../types'
import { bool, Fn, num } from '../../../../utils/types'
import { EstimateCard } from '../training/hooks'
import { useInteractiveSubmit } from '../hooks'
import { Button, ButtonGroup, ButtonProps, Stack, styled } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import { useIsSM } from '../../../utils/hooks/hooks'
import { TrainingSettings } from './training-settings'
import { TrainingSettingsP } from './training-settings'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded'

export interface TrainingControlsP extends TrainingSettingsP {
  estimate: EstimateCard
  areFieldsHidden: bool
  showHiddenFields: Fn
  cardType: CardType
  currentCardIndex: num
  isAtEnd: bool
  onTrainingEnd: Fn
}

export const TrainingControls = ({
  cardType,
  estimate,
  areFieldsHidden,
  showHiddenFields,
  currentCardIndex,
  cardId,
  deleteCard,
  isAtEnd,
  onTrainingEnd,
}: TrainingControlsP) => {
  const [goToNextCardFn, setGoToNextCardFn] = useState<GoToNextCard | null>(null)

  // const onSubmit = (estimation: num) => {
  //   const finalMark = estimation === 1 ? 'GOOD' : 'BAD'
  //   const gtnc = estimate(finalMark, 'no-transition')
  //   if (gtnc) setGoToNextCardFn({ go: gtnc })
  // }

  const goToNextCard = () => {
    if (!goToNextCardFn) return
    goToNextCardFn.go()
    setGoToNextCardFn(null)
  }

  const { interactiveSubmit } = useInteractiveSubmit()

  // useEffect(() => {
  //   setInteractiveSubmit(() => submit(onSubmit))
  // }, [submit])

  const { setOnTimeout } = useTrainingTimer()
  const fail = () => estimate('BAD')
  const onTimeout = () => (goToNextCardFn ? goToNextCard() : fail())
  useEffect(() => {
    setOnTimeout(onTimeout)
  }, [currentCardIndex])

  const isSM = useIsSM()
  const size = isSM ? 'large' : 'medium'

  return (
    <Stack
      sx={{ width: '100%' }}
      direction="row"
      justifyContent={isAtEnd ? 'center' : 'space-between'}
      alignItems="center"
      spacing={0}
    >
      {!isAtEnd && (
        <>
          <TrainingTimer />
          {cardType === 'passive' && (
            <SelfEstimateBtn
              estimate={estimate}
              areFieldsHidden={areFieldsHidden}
              showHiddenFields={showHiddenFields}
            />
          )}
          {cardType === 'interactive' && (
            <EstimateBtn submit={interactiveSubmit} goToNextCard={goToNextCard} isSubmitted={Boolean(goToNextCardFn)} />
          )}
          <TrainingSettings cardId={cardId} deleteCard={deleteCard} />
        </>
      )}
      {isAtEnd && (
        <Btn size={size} onClick={onTrainingEnd} startIcon={<KeyboardBackspaceRoundedIcon />}>
          Back to trainings
        </Btn>
      )}
    </Stack>
  )
}

const EstimationBtn = rstyled(Button)<ButtonProps & IsSM>(({ isSM }) => ({
  width: isSM ? 85 : 65,
  fontWeight: 600,
}))

const Btn = styled(Button)({
  fontWeight: 600,
})

interface SelfEstimateBtnP {
  areFieldsHidden: boolean
  showHiddenFields: Fn
  estimate: EstimateCard
}

const SelfEstimateBtn = ({ areFieldsHidden, showHiddenFields, estimate }: SelfEstimateBtnP) => {
  const bad = () => estimate('BAD')
  const poor = () => estimate('POOR')
  const good = () => estimate('GOOD')
  const easy = () => estimate('EASY')

  const isSM = useIsSM()
  const size = isSM ? 'large' : 'medium'
  return (
    <>
      {areFieldsHidden && (
        <Btn size={size} onClick={showHiddenFields} startIcon={<CheckRoundedIcon />}>
          Grade
        </Btn>
      )}
      {!areFieldsHidden && (
        <ButtonGroup variant="text" size={size}>
          <EstimationBtn isSM={isSM} color="warning" onClick={poor}>
            Poor
          </EstimationBtn>
          <EstimationBtn isSM={isSM} color="error" onClick={bad}>
            Bad
          </EstimationBtn>
          <EstimationBtn isSM={isSM} color="success" onClick={good}>
            Good
          </EstimationBtn>
          <EstimationBtn isSM={isSM} color="info" onClick={easy}>
            Easy
          </EstimationBtn>
        </ButtonGroup>
      )}
    </>
  )
}

type GoToNextCard = { go: Fn } | null

interface EstimateBtnP {
  isSubmitted: boolean
  submit: Fn
  goToNextCard: Fn
}

const EstimateBtn = ({ isSubmitted, submit, goToNextCard }: EstimateBtnP) => {
  const isSM = useIsSM()
  const size = isSM ? 'large' : 'medium'

  return (
    <>
      {!isSubmitted && (
        <Btn size={size} onClick={submit} startIcon={<CheckRoundedIcon />}>
          Grade
        </Btn>
      )}
      {isSubmitted && (
        <Btn size={size} onClick={goToNextCard} endIcon={<ArrowRightAltRoundedIcon />}>
          Next
        </Btn>
      )}
    </>
  )
}
