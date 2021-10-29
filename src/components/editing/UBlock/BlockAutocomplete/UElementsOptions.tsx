import { UOption, OptionIconP } from '../../../utils/UMenu/UMenu'
import { ReactComponent as H1I } from './h1.svg'
import { ReactComponent as H2I } from './h2.svg'
import { ReactComponent as H3I } from './h3.svg'
import { ReactComponent as ULI } from './ul.svg'
import { ReactComponent as OLI } from './ol.svg'
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import { Fn, SVGIcon } from '../../../../utils/types'
import { _apm } from '../../../application/theming/theme'
import { useTheme } from '@mui/material'

export interface UElementsOptions {
  context: 'general' | 'uform' | 'turner'
  turnInto?: Fn
  create?: Fn
}

export function UElementsOptions({ context, turnInto }: UElementsOptions) {
  return (
    <>
      <UOption icon={TextFieldsRoundedIcon} text="Text" />
      <UOption icon={H1} text="Heading 1" />
      <UOption icon={H2} text="Heading 2" />
      <UOption icon={H3} text="Heading 3" />
      {context === 'general' && <UOption icon={DescriptionRoundedIcon} text="Page" />}
      <UOption icon={UL} text="Bullet list" />
      <UOption icon={OL} text="Numbered list" />
    </>
  )
}

const H = (Component: SVGIcon) => (_: OptionIconP) => {
  const theme = useTheme()
  return <Component style={{ fill: _apm(theme, 'btn') }} />
}
const H1 = H(H1I)
const H2 = H(H2I)
const H3 = H(H3I)
const UL = H(ULI)
const OL = H(OLI)
