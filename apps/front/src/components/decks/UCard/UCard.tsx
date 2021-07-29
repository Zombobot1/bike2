import { CardEstimation, estimationColor, FieldDTO, FieldDTOs } from '../../study/training/types'
import { UCardField } from './UCardField/UCardField'
import { Collapse, Stack, styled } from '@material-ui/core'
import { ReactComponent as StageChevron } from './stageChevron.svg'
import { CardTemplateDTO } from '../dto'
import { str, bool } from '../../../utils/types'
import { TransitionGroup } from 'react-transition-group'

export interface UCard {
  fields: FieldDTOs
  stageColor?: str
  isMediaActive: bool
  showHidden: bool
  estimation?: CardEstimation
}

export interface EditingUCard {
  fields?: FieldDTOs
  template: CardTemplateDTO
  stageColor?: str
}

export function EditingUCard({ fields, stageColor, template }: EditingUCard) {
  const fieldsToShow = fields
    ? template.fields.map((f) => (has(fields, f.name) ? { ...f, ...get(fields, f.name) } : f))
    : template.fields

  return (
    <CardContainer>
      <Card spacing={2}>
        {fieldsToShow.map((f, i) => (
          <UCardField {...f} key={f._id || i} canBeEdited={true} />
        ))}
      </Card>
      <Stage sx={{ fill: stageColor }} />
    </CardContainer>
  )
}

export function UCard({ fields, stageColor, isMediaActive = true, showHidden, estimation }: UCard) {
  const fieldsToShow = fields.filter((f) => f.status === 'SHOW')
  const hiddenFields = fields.filter((f) => f.status === 'HIDE')
  const sx = estimation ? { border: `1px solid ${estimationColor(estimation)}` } : {}

  return (
    <CardContainer sx={sx}>
      <Card spacing={2}>
        <TransitionGroup component={null}>
          {fieldsToShow.map((f, i) => (
            <Collapse key={f._id || i} timeout={0}>
              <UCardField {...f} isMediaActive={isMediaActive} />
            </Collapse>
          ))}
          {showHidden && hiddenFields.length !== 0 && (
            <Collapse>
              <Hr />
            </Collapse>
          )}
          {showHidden &&
            hiddenFields.map((f, i) => (
              <Collapse key={f._id || i} timeout={500}>
                <UCardField {...f} isMediaActive={isMediaActive} />
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

function get(fields: FieldDTOs, name: str): FieldDTO {
  const r = fields.find((f) => f.name === name)
  if (!r) throw new Error('Field with this name is missing')
  return r
}

function has(fields: FieldDTOs, name: str): bool {
  return Boolean(fields.find((f) => f.name === name))
}
