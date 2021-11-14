import { UOption } from '../../../utils/UMenu/UMenu'
import { ReactComponent as H1I } from './h1.svg'
import { ReactComponent as H2I } from './h2.svg'
import { ReactComponent as H3I } from './h3.svg'
import { ReactComponent as ULI } from './ul.svg'
import { ReactComponent as OLI } from './ol.svg'
import { ReactComponent as TEXI } from './tex.svg'
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { Fn } from '../../../../utils/types'
import { SVGI } from '../../../utils/MuiUtils'

export interface UElementsOptions {
  context: 'general' | 'uform' | 'turner'
  turnInto?: Fn
  create?: Fn
}

export function UElementsOptions({ context }: UElementsOptions) {
  return (
    <>
      <UOption icon={TextFieldsRoundedIcon} text="Text" />
      <UOption icon={H1} text="Heading 1" />
      <UOption icon={H2} text="Heading 2" />
      <UOption icon={H3} text="Heading 3" />
      {context === 'general' && <UOption icon={DescriptionRoundedIcon} text="Page" />}
      <UOption icon={UL} text="Bullet list" />
      <UOption icon={OL} text="Numbered list" />
      <UOption icon={TEX} text="Block equation" />
    </>
  )
}

const H1 = SVGI(H1I)
const H2 = SVGI(H2I)
const H3 = SVGI(H3I)
const UL = SVGI(ULI)
const OL = SVGI(OLI)
const TEX = SVGI(TEXI)
