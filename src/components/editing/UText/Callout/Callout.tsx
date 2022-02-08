import { ucast } from '../../../../utils/utils'
import { useReactiveObject } from '../../../utils/hooks/hooks'
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
import { bool, SetStr, str } from '../../../../utils/types'
import { PaddedBox } from '../../UBlock/PaddedBox'

export function Callout(props: UText) {
  const [data] = useReactiveObject(ucast(props.data, new CalloutDTO()))
  const setText = (d: str) => props.setData(JSON.stringify({ ...data, text: d }))
  const setType = (t: str) => props.setData(JSON.stringify({ ...data, type: t }))

  const theme = useTheme()
  const bg = alpha(theme.palette[data.type].main, theme.palette.mode === 'dark' ? 0.2 : 0.1)
  return (
    <PaddedBox>
      <Container sx={{ backgroundColor: bg }} alignItems="start" spacing={1}>
        <CalloutTypePicker type={data.type} setType={setType} readonly={props.readonly} />
        <UText_ {...props} data={data.text} setData={setText} component="pre" color={theme.palette[data.type].main} />
      </Container>
    </PaddedBox>
  )
}

const Container = styled(RStack)(({ theme }) => ({
  flex: 1,
  borderRadius: theme.shape.borderRadius,
  paddingTop: '1rem',
  paddingLeft: '1rem',
  paddingRight: '1.5rem',
  paddingBottom: '0.75rem',
}))

const icons: { [key: string]: JSX.Element } = {
  info: <InfoRoundedIcon color="info" fontSize="large" />,
  success: <CheckCircleRoundedIcon color="success" fontSize="large" />,
  warning: <WarningRoundedIcon color="warning" fontSize="large" />,
  error: <ErrorRoundedIcon color="error" fontSize="large" />,
}

interface CalloutTypePicker_ {
  type: str
  setType: SetStr
  readonly?: bool
}

function CalloutTypePicker({ type, setType, readonly }: CalloutTypePicker_) {
  const ref = useRef<HTMLButtonElement>(null)
  const { isOpen, toggleOpen, close } = useMenu()
  return (
    <>
      <IconButton onClick={toggleOpen} ref={ref} disabled={readonly}>
        {icons[type]}
      </IconButton>
      <UMenu isOpen={isOpen} btnRef={ref} close={close}>
        {Object.entries(icons).map(([k, icon], i) => (
          <MenuItem value={i} key={i} onClick={() => setType(k)}>
            {icon}
          </MenuItem>
        ))}
      </UMenu>
    </>
  )
}
