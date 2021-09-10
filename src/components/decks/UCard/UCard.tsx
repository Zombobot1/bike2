import { CardEstimation, estimationColor, FieldDTO, FieldDTOs } from '../../studying/training/types'
import { Collapse, Stack, styled } from '@material-ui/core'
import { ReactComponent as StageChevron } from './stageChevron.svg'
import { str, bool } from '../../../utils/types'
import { TransitionGroup } from 'react-transition-group'
import { useInteractiveSubmit } from '../../studying/training/hooks'
import { UBlock } from '../../editing/UBlock'

export interface UCard {
  readonly: bool
  fields: FieldDTOs
  hiddenFields?: FieldDTOs
  stageColor: str
  isMediaActive: bool
  showHidden: bool
  estimation?: CardEstimation
}

export function UCard({
  readonly,
  fields,
  hiddenFields,
  stageColor,
  isMediaActive = true,
  showHidden,
  estimation,
}: UCard) {
  const { fieldsToShow, fieldsToHide } = fieldsToShowAndHide(fields, hiddenFields, readonly)
  const sx = estimation ? { border: `1px solid ${estimationColor(estimation)}` } : {}

  return (
    <CardContainer sx={sx}>
      <Card spacing={2}>
        <TransitionGroup component={null}>
          {fieldsToShow.map((f) => (
            // inside transition group everything should be wrapped
            <Collapse key={f._id} timeout={0} sx={{ flex: '1 0 auto' }}>
              <UCardField {...f} isMediaActive={isMediaActive} readonly={readonly} />
            </Collapse>
          ))}
          {showHidden &&
            fieldsToHide.map((f) => (
              <Collapse key={f._id} timeout={500} sx={{ flex: '1 0 auto' }}>
                <UCardField {...f} isMediaActive={isMediaActive} readonly={readonly} />
              </Collapse>
            ))}
        </TransitionGroup>
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

const Stage = styled(StageChevron)({
  position: 'absolute',
  zIndex: 5,
  left: 0,
  bottom: -2,
})

function fieldsToShowAndHide(fields: FieldDTOs, hiddenFields: FieldDTOs = [], readonly?: bool) {
  if (!readonly) return { fieldsToShow: [...fields, ...hiddenFields], fieldsToHide: [] }
  return {
    fieldsToShow: fields,
    fieldsToHide: hiddenFields,
  }
}

export interface UCardField extends FieldDTO {
  isMediaActive?: bool
  readonly?: bool
}

const UCardField = ({ _id, data, type: _, isMediaActive, readonly }: UCardField) => {
  const { interactiveSubmit } = useInteractiveSubmit()

  if (!data) return null

  return (
    <UBlock id={_id} autoplay={isMediaActive} onAnswer={interactiveSubmit} readonly={readonly} isCardField={true} />
  )
}
