import { CardEstimation, estimationColor, FieldDTO, FieldDTOs } from '../../study/training/types'
import { UCardField } from './UCardField/UCardField'
import { Stack, styled } from '@material-ui/core'
import { ReactComponent as StageChevron } from './stageChevron.svg'
import { CardTemplateDTO } from '../dto'

export interface UCardP {
  fields: FieldDTO[]
  template?: CardTemplateDTO
  stageColor: string
  isMediaActive?: boolean
  showHidden?: boolean
  estimation?: CardEstimation
}

export const UCard = ({ fields, stageColor, isMediaActive = true, showHidden, estimation, template }: UCardP) => {
  const canBeEdited = Boolean(template)
  const isAudioActive = isMediaActive && !canBeEdited

  const { fieldsToShow, hiddenFields } = chooseFields(fields, template)
  const sx = estimation ? { border: `1px solid ${estimationColor(estimation)}` } : {}

  return (
    <CardContainer sx={sx}>
      <Card spacing={2}>
        {fieldsToShow.map((f, i) => (
          <UCardField {...f} key={f._id || i} isMediaActive={isAudioActive} canBeEdited={canBeEdited} />
        ))}
        {showHidden && hiddenFields.length !== 0 && <Hr />}
        {showHidden &&
          hiddenFields.map((f, i) => (
            <UCardField {...f} key={f._id || i} isMediaActive={isAudioActive} canBeEdited={false} />
          ))}
      </Card>
      {!estimation && <Stage sx={{ fill: stageColor }} />}
    </CardContainer>
  )
}

function chooseFields(fields: FieldDTOs, template?: CardTemplateDTO) {
  if (fields.length) {
    return {
      fieldsToShow: fields.filter((f) => f.status === 'SHOW'),
      hiddenFields: fields.filter((f) => f.status === 'HIDE'),
    }
  }

  if (template) {
    return {
      fieldsToShow: template.fields,
      hiddenFields: [],
    }
  }

  throw new Error('Cards template was not provided and fields are empty!')
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

const Stage = styled(StageChevron)({
  position: 'absolute',
  zIndex: 5,
  left: 0,
  bottom: -2,
})
