import { str } from '../../../../utils/types'
import { UBlockDTO } from '../../types'
import { useFirestoreData } from '../../../../fb/useData'
import { WS } from '../../../application/navigation/workspace'
import { ucast as ucast } from '../../../../utils/utils'
import { UPageDTO } from '../UPage'

export function useDeleteUPage(workspace: WS, { skipRootDeletion = false } = {}) {
  const { setData, getData } = useFirestoreData()
  const deleteBlock = (id: str) => setData<UBlockDTO>('ublocks', id, { isDeleted: true })
  return (id: str) => {
    if (!skipRootDeletion) deleteBlock(id)
    return workspace.delete(
      id,
      (id) =>
        getData<UBlockDTO>('ublocks', id).then(
          (page) => ucast<UPageDTO>(page.data, { ids: [], color: '', name: '' }).ids,
        ),
      deleteBlock,
    )
  }
}
