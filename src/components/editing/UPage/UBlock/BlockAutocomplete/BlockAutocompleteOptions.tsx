import { ReactComponent as H1I } from './h1.svg'
import { ReactComponent as H2I } from './h2.svg'
import { ReactComponent as H3I } from './h3.svg'
import { ReactComponent as TEXI } from './tex.svg'
import { ReactComponent as TEXII } from './texInline.svg'
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded'
import VideoCameraBackRoundedIcon from '@mui/icons-material/VideoCameraBackRounded'
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import Crop75RoundedIcon from '@mui/icons-material/Crop75Rounded'
import Crop54RoundedIcon from '@mui/icons-material/Crop54Rounded'
import RuleRoundedIcon from '@mui/icons-material/RuleRounded'
import ViewCarouselRoundedIcon from '@mui/icons-material/ViewCarouselRounded'
import BallotRoundedIcon from '@mui/icons-material/BallotRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded'
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded'

import { bool, num, str, UIcon } from '../../../../../utils/types'
import { SVGI } from '../../../../utils/MuiUtils'
import { UBlockType } from '../../ublockTypes'

type Context = 'upage' | 'uform' | 'ucard' | 'turner'

const H1 = SVGI(H1I)
const H2 = SVGI(H2I)
const H3 = SVGI(H3I)
const TEX = SVGI(TEXI, { scale: 1.1 })
const TEXInline = SVGI(TEXII)

const turner = 1
const general = 2
const uform = 4
const ucard = 8
const notTurner = uform | general | ucard
const any = notTurner | turner | ucard

function contextStrToNum(context: Context): num {
  switch (context) {
    case 'turner':
      return turner
    case 'upage':
      return general
    case 'uform':
      return uform
    case 'ucard':
      return ucard
  }
}

function canShow(context: num, contextStr: Context): bool {
  return !!(contextStrToNum(contextStr) & context)
}

type Item = { text: str; icon: UIcon; context: num }
type Items = Item[]

const ublocks: Items = [
  { text: 'Text', icon: TextFieldsRoundedIcon, context: any },
  { text: 'Single choice', icon: RadioButtonCheckedRoundedIcon, context: uform },
  { text: 'Multiple choice', icon: CheckBoxRoundedIcon, context: uform },
  { text: 'Short answer', icon: Crop75RoundedIcon, context: uform },
  { text: 'Long answer', icon: Crop54RoundedIcon, context: uform },
  { text: 'Inline exercise', icon: RuleRoundedIcon, context: uform },
  { text: 'Page', icon: DescriptionRoundedIcon, context: general },
  { text: 'Bullet list', icon: FormatListBulletedRoundedIcon, context: any },
  { text: 'Heading 1', icon: H1, context: any },
  { text: 'Heading 2', icon: H2, context: any },
  { text: 'Heading 3', icon: H3, context: any },
  { text: 'Numbered list', icon: FormatListNumberedRoundedIcon, context: any },
  { text: 'Toggle list', icon: PlaylistPlayRoundedIcon, context: any },
  { text: 'Table', icon: TableChartRoundedIcon, context: notTurner },
  { text: 'Block equation', icon: TEX, context: notTurner },
  { text: 'Inline equation', icon: TEXInline, context: notTurner },
  { text: 'Code', icon: CodeRoundedIcon, context: any },
  { text: 'Quote', icon: FormatQuoteRoundedIcon, context: any },
  { text: 'Callout', icon: InfoRoundedIcon, context: any },
  { text: 'File', icon: UploadFileRoundedIcon, context: notTurner },
  { text: 'Image', icon: ImageRoundedIcon, context: notTurner },
  { text: 'Audio', icon: AudiotrackRoundedIcon, context: notTurner },
  { text: 'Video', icon: VideoCameraBackRoundedIcon, context: notTurner },
  { text: 'Divider', icon: HorizontalRuleRoundedIcon, context: notTurner },
  { text: 'Exercise', icon: BallotRoundedIcon, context: general },
  { text: 'Cards', icon: ViewCarouselRoundedIcon, context: general },
]

export function ublocksFor(context: Context): Items {
  return ublocks.filter((e) => canShow(e.context, context))
}

export function ublockTypeFrom(type: str): UBlockType {
  return type.replaceAll(' ', '-').toLowerCase() as UBlockType
}
