import { ClickAwayListener } from '@mui/material'
import { str, SetStr } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { _mockFileUploader } from '../../UFile/FileUploader'
import { UBlocks } from '../ublockTypes'
import { useTestUPageState } from '../UPageState/UPageState'
import { upage } from '../useUPageInfo'
import { UBlocksSet } from './UBlockSet'
import { useUserKeyDownForSelection } from './useUserKeyDownForSelection'

interface SetForStories {
  title?: str
  setTitle?: SetStr
  blocks: UBlocks
}

export function SetForStories({ blocks, title, setTitle }: SetForStories) {
  const { ublocks, changer } = useTestUPageState(blocks)

  useUserKeyDownForSelection(changer)
  // window.c.blocks.push(ublocks)
  // useMount(() => {
  //   window.c = new C()
  //   return _mockFileUploader()
  // })
  useMount(_mockFileUploader)
  return (
    <ClickAwayListener onClickAway={upage.unselect}>
      <div>
        <UBlocksSet id={'r'} blocks={ublocks} title={title} setTitle={setTitle} />
      </div>
    </ClickAwayListener>
  )
}

// class C {
//   blocks: UBlocks[] = []

//   comp = (i1, j1, i2, j2) => {
//     console.log(this.blocks[i1][j1] === this.blocks[i2][j2])
//   }
// }

// window.c = new C()
