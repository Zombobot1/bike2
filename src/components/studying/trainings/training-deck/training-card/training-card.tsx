import { SmallDeckCard } from './types'
import { TrainingConceptsInfo, TrainingConceptsInfoP } from './training-cards-info/training-concepts-info'
import { _TrainingDTO as TrainingDTO } from '../../../training/training/training'
import { styled, Typography } from '@mui/material'
import { f } from '../../../../../utils/types'
import { cut } from '../../../../../utils/utils'

export interface DeckCard extends SmallDeckCard {
  deckPath: string
}

export interface TrainingConceptInfo {
  _id: string
  trainingConceptsInfo: TrainingConceptsInfoP
}

export type TrainingCard = Omit<TrainingDTO, 'cards'>
export const TrainingCard = ({ _id, deckColor, deckName, deckPath, trainingConceptsInfo }: TrainingCard) => {
  // const onClick = () => history.push(`${STUDY}/${_id}`)
  return (
    <Card onClick={f} sx={{ ':before': { backgroundColor: deckColor } }}>
      <DeckPath fontSize="small" color="text.secondary">
        {deckPath}
      </DeckPath>
      <DeckName>{cut(deckName, 40)}</DeckName>
      <S>
        <TrainingConceptsInfo {...trainingConceptsInfo} />
      </S>
    </Card>
  )
}

const Card = styled('div', { label: 'TrainingCard' })(({ theme }) => ({
  width: '100%',
  minWidth: 270,
  height: 90,

  position: 'relative',
  paddingTop: 4,
  paddingRight: 8,
  borderRadius: 10,
  backgroundColor: theme.palette.common.white,
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)',

  transition: 'transform .3s ease-out, box-shadow .3s ease-out',

  ':hover': {
    transform: 'translate(5px, 0)',
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
    cursor: 'pointer',
  },

  overflow: 'hidden',
  ':before': {
    content: '""',
    width: 14,
    height: '100%',
    position: 'absolute',
    top: 0,
  },
}))

const DeckPath = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: 20,
  fontWeight: 600,
})

const DeckName = styled(Typography)({
  marginLeft: 20,
  fontWeight: 600,
  lineHeight: 1.2,
})

const S = styled('div')({
  position: 'absolute',
  bottom: 4,
  right: 8,
})
