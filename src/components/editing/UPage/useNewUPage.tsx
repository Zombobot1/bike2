import randomColor from 'randomcolor'
import { useRouter } from '../../utils/hooks/useRouter'
import { UBlockDTO } from '../types'
import { uuid } from '../../../utils/uuid'
import { WS } from '../../application/navigation/workspace'
import { useFirestoreData } from '../../../fb/useData'
import { str } from '../../../utils/types'
import { UPageDataDTO } from './UPage'

export function useNewUPage(workspace: WS) {
  const { history } = useRouter()
  const { setData, addData } = useFirestoreData()

  function addNewUPage(newId?: str, parentId?: str, underId?: str, parentColor?: str) {
    const id = newId || uuid.v4()
    const newPageData: UPageDataDTO = { color: parentColor || randomColor({ luminosity: 'bright' }), ids: [], name: '' }
    const newPage: UBlockDTO = { type: 'page', data: JSON.stringify(newPageData) }

    if (newId) setData<UBlockDTO>('ublocks', id, newPage)
    else addData<UBlockDTO>('ublocks', id, newPage)

    history.push('/' + id)

    workspace.insert(id, parentId, underId)
  }

  return addNewUPage
}
