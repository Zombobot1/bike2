import { ReactComponent as CatI } from './cat.svg'
import { ReactComponent as DogI } from './dog.svg'
import { OptionIconP } from '../../../../utils/types'
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import { _onTestUserSignIn } from '../../../../fb/auth'

const _CatI = (_: OptionIconP) => <CatI style={{ width: '24px', height: '24px' }} />
const _DogI = (_: OptionIconP) => <DogI style={{ width: '24px', height: '24px' }} />

export function _TestLogin() {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <SpeedDial
      sx={{ position: 'absolute', top: 16, left: 16 }}
      icon={<SpeedDialIcon icon={<LoginRoundedIcon />} />}
      direction="down"
      ariaLabel="test"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => _onTestUserSignIn(action.name)}
        />
      ))}
    </SpeedDial>
  )
}

const actions = [
  { icon: <_CatI />, name: 'Kitten' },
  { icon: <_DogI />, name: 'Puppy' },
]
