import { UOption } from '../../../utils/UMenu/UMenu'
import { ReactComponent as H1I } from './h1.svg'
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded'
import { Fn, OptionIconP } from '../../../../utils/types'

export interface UElementsOptions {
  context: 'general' | 'uform'
  close: Fn
}

export function UElementsOptions({ close }: UElementsOptions) {
  return (
    <>
      <UOption icon={TextFieldsRoundedIcon} text="Text" close={close} />
      <UOption icon={H1} text="Heading 1" close={close} />
    </>
  )
}

function H1(_: OptionIconP) {
  return <H1I />
}
