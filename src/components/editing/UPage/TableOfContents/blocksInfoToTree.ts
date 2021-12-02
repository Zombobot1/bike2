import { sort } from '../../../../utils/algorithms'
import { num } from '../../../../utils/types'
import { safe } from '../../../../utils/utils'
import { isIndexableBLock, UBlockType } from '../../types'
import { TOCItems, TOCItems_, TOCItem_ } from './types'

const MAX_DEPTH = 2
const MIN_DEPTH = 0

function depthByType(type?: UBlockType): num {
  switch (type) {
    case 'heading-1':
      return 0
    case 'heading-2':
      return 1
    case 'heading-3':
      return 2
    case 'cards':
      return 0
    case 'exercise':
      return 0
    default:
      throw new Error(`Depth is not defined for ${type}`)
  }
}

export function _treefy(tocItems: TOCItems): TOCItems_ {
  const rawTocItems = sort(
    tocItems.filter((t) => isIndexableBLock(t.type)),
    (t) => t.i,
  )

  if (!rawTocItems.length) return []

  const r: TOCItems_ = [{ id: rawTocItems[0].id, data: rawTocItems[0].data, scrollTo: rawTocItems[0].scrollTo }]
  let lastAddedParents = [r[0]]
  for (let i = 1; i < rawTocItems.length; i++) {
    const lastParent = safe(lastAddedParents.at(-1))
    const lastParentDepth = lastAddedParents.length - 1

    const newItem: TOCItem_ = { id: rawTocItems[i].id, data: rawTocItems[i].data, scrollTo: rawTocItems[i].scrollTo }
    const newItemDepth = depthByType(rawTocItems[i].type)

    if (newItemDepth > lastParentDepth) {
      lastParent.children = lastParent.children ? [...lastParent.children, newItem] : [newItem]
      if (newItemDepth !== MAX_DEPTH) lastAddedParents.push(newItem)
    } else if (newItemDepth === lastParentDepth) {
      lastAddedParents.pop()

      if (newItemDepth === MIN_DEPTH) r.push(newItem)
      else {
        const grandPa = safe(lastAddedParents.at(-1))
        grandPa.children = grandPa.children ? [...grandPa.children, newItem] : [newItem]
      }

      lastAddedParents.push(newItem)
    } else {
      lastAddedParents = []

      if (newItemDepth === MIN_DEPTH) r.push(newItem)
      else {
        const grandPa = safe(lastAddedParents.at(-1))
        grandPa.children = grandPa.children ? [...grandPa.children, newItem] : [newItem]
      }

      lastAddedParents.push(newItem)
    }
  }

  return r
}
