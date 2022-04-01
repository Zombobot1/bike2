import { UOption } from '../../../../utils/UMenu/UMenu'
import { ublocksFor, ublockTypeFrom } from './BlockAutocompleteOptions'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import { UBlockType } from '../../ublockTypes'

export interface BlockTurner {
  turnInto: (t: UBlockType) => void
}

export function BlockTurner({ turnInto }: BlockTurner) {
  return (
    <UOption icon={AutorenewRoundedIcon} text="Turn into">
      {ublocksFor('turner').map((e) => (
        <UOption
          key={e.text}
          icon={e.icon}
          text={e.text}
          iconSize="large"
          onClick={() => turnInto(ublockTypeFrom(e.text))}
        />
      ))}
    </UOption>
  )
}
