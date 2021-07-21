import { CardEstimation, estimationColor, FieldDTO } from '../../study/training/types'
import { UCardField } from './UCardField/UCardField'
import { useMount } from '../../../utils/hooks-utils'
import { Stack, styled } from '@material-ui/core'
import { ReactComponent as StageChevron } from './stageChevron.svg'

export interface QACardP {
  fields: FieldDTO[]
  stageColor: string
  isCurrent: boolean
  isMediaActive?: boolean
  showHidden: boolean
  estimation?: CardEstimation
}

export const UCard = ({ fields, stageColor, isCurrent, isMediaActive = true, showHidden, estimation }: QACardP) => {
  const fieldsToShow = fields.filter((f) => f.status === 'SHOW')
  const hiddenFields = fields.filter((f) => f.status === 'HIDE')

  const sx = estimation ? { border: `1px solid ${estimationColor(estimation)}` } : {}
  useMount(() => fields.forEach(preloadImage))

  return (
    <CardContainer sx={sx}>
      <Card spacing={2}>
        {fieldsToShow.map((f) => (
          <UCardField {...f} key={f._id} isMediaActive={isCurrent} isCurrent={isCurrent} canBeEdited={false} />
        ))}
        {showHidden && hiddenFields.length !== 0 && <Hr />}
        {showHidden &&
          hiddenFields.map((f) => (
            <UCardField
              {...f}
              key={f._id}
              isMediaActive={isCurrent && isMediaActive}
              isCurrent={isCurrent}
              canBeEdited={false}
            />
          ))}
      </Card>
      {!estimation && <Stage sx={{ fill: stageColor }} />}
    </CardContainer>
  )
}
const CardContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  width: '100%',
  position: 'relative',
  backgroundColor: theme.palette.common.white,
  border: `0.5px solid ${theme.palette.grey['200']}`,
  borderRadius: 25,
  overflow: 'hidden',
}))

const Card = styled(Stack)({
  height: '100%',
  width: '100%',
  overflowY: 'auto',
  zIndex: 1,
  padding: 20,
  borderRadius: 25,

  ':after': {
    content: '""',
    margin: 'auto',
  },

  ':before': {
    content: '""',
    margin: 'auto',
  },
})

const Hr = styled('hr')({
  minHeight: 1,
  marginTop: 0,
  opacity: 0.2,
})

const preloadImage = (field: FieldDTO) => {
  if (field.type !== 'IMG' || !field.passiveData) return
  const img = new Image()
  img.src = field.passiveData
}

const Stage = styled(StageChevron)({
  position: 'absolute',
  zIndex: 5,
  left: 0,
  bottom: -2,
})
