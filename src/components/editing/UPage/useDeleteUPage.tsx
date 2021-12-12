import { str } from '../../../utils/types'
import { UBlockDTO } from '../types'
import { useFirestoreData } from '../../../fb/useData'
import { WS } from '../../application/navigation/workspace'
import { UPageDataDTO } from './UPage'
import { ucast as ucast } from '../../../utils/utils'

export function useDeleteUPage(workspace: WS, { skipRootDeletion = false } = {}) {
  const { setData, getData } = useFirestoreData()
  const deleteBlock = (id: str) => setData<UBlockDTO>('ublocks', id, { isDeleted: true })
  return (id: str) => {
    if (!skipRootDeletion) deleteBlock(id)
    return workspace.delete(
      id,
      (id) =>
        getData<UBlockDTO>('ublocks', id).then(
          (page) => ucast<UPageDataDTO>(page.data, { ids: [], color: '', name: '' }).ids,
        ),
      deleteBlock,
    )
  }
}
