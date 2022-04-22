import { RStack } from '../../../utils/MuiUtils'
import { UText } from '../types'
import { UText_ } from '../UText_'
import { alpha, IconButton, MenuItem, styled, useTheme } from '@mui/material'
import { useRef } from 'react'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import { UMenu, useMenu } from '../../../utils/UMenu/UMenu'
import { bool } from '../../../../utils/types'
import { PaddedBox } from '../../UPage/UBlock/PaddedBox'
import { CalloutData } from '../../UPage/ublockTypes'
import { useIsSM } from '../../../utils/hooks/hooks'

export function Callout(ps: UText) {
  const { id, data: d, setData, readonly } = ps
  const data = d as CalloutData

  const theme = useTheme()
  const bg = alpha(theme.palette[data.type].main, theme.palette.mode === 'dark' ? 0.2 : 0.1)
  const isSM = useIsSM()
  return (
    <PaddedBox>
      <Container sx={{ backgroundColor: bg }} alignItems="start" spacing={isSM ? 1 : 0.5}>
        <CalloutTypePicker type={data.type} setType={(type) => setData(id, { type })} readonly={readonly} />
        <UText_
          {...ps}
          data={data.text}
          setData={(t) => setData(id, { text: t })}
          component="pre"
          color={theme.palette[data.type].main}
        />
      </Container>
    </PaddedBox>
  )
}

const Container = styled(RStack)(({ theme }) => ({
  flex: 1,
  borderRadius: theme.shape.borderRadius,
  paddingTop: '0.5rem',
  paddingLeft: '0.5rem',
  paddingRight: '1rem',
  paddingBottom: '0.5rem',

  [`${theme.breakpoints.up('sm')}`]: {
    paddingTop: '1rem',
    paddingLeft: '1rem',
    paddingRight: '1.5rem',
    paddingBottom: '0.75rem',
  },
}))

const icons: { [key: string]: JSX.Element } = {
  info: <InfoRoundedIcon color="info" fontSize="small" />,
  success: <CheckCircleRoundedIcon color="success" fontSize="small" />,
  warning: <WarningRoundedIcon color="warning" fontSize="small" />,
  error: <ErrorRoundedIcon color="error" fontSize="small" />,
}

const iconsSM: { [key: string]: JSX.Element } = {
  info: <InfoRoundedIcon color="info" fontSize="large" />,
  success: <CheckCircleRoundedIcon color="success" fontSize="large" />,
  warning: <WarningRoundedIcon color="warning" fontSize="large" />,
  error: <ErrorRoundedIcon color="error" fontSize="large" />,
}

interface CalloutTypePicker_ {
  type: CalloutData['type']
  setType: (t: CalloutData['type']) => void
  readonly?: bool
}

function CalloutTypePicker({ type, setType, readonly }: CalloutTypePicker_) {
  const ref = useRef<HTMLButtonElement>(null)
  const { isOpen, toggleOpen, close } = useMenu()
  const isSM = useIsSM()

  return (
    <>
      <IconButton onClick={toggleOpen} ref={ref} disabled={readonly}>
        {isSM ? iconsSM[type] : icons[type]}
      </IconButton>
      <UMenu isOpen={isOpen} btnRef={ref} close={close}>
        {Object.entries(isSM ? iconsSM : icons).map(([k, icon], i) => (
          <MenuItem value={i} key={i} onClick={() => setType(k as CalloutData['type'])}>
            {icon}
          </MenuItem>
        ))}
      </UMenu>
    </>
  )
}
