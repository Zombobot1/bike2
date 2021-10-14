import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import { Typography, Stack } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon'
import { fancyNumber } from '../../../../../../utils/formatting'

export interface TrainingConceptsInfoP {
  toRepeat: number
  toLearn: number
}

type Info = {
  Icon: OverridableComponent<SvgIconTypeMap> & { muiName: string }
  num: number
  marginRight?: string
}

const Info = ({ Icon, num, marginRight = '1px' }: Info) => (
  <Typography fontSize="small">
    <Icon sx={{ width: 15, height: 15, transform: 'translateY(3px)', marginRight }} />
    {fancyNumber(num)}
  </Typography>
)

export const TrainingConceptsInfo = ({ toRepeat, toLearn }: TrainingConceptsInfoP) => {
  return (
    <Stack direction="row" spacing={1}>
      {Boolean(toRepeat) && <Info Icon={AutorenewOutlinedIcon} num={toRepeat} />}
      {Boolean(toLearn) && <Info Icon={RemoveRedEyeOutlinedIcon} num={toLearn} marginRight={'2px'} />}
    </Stack>
  )
}
