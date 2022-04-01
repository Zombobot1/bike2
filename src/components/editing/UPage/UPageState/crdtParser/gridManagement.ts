import { num, nums, str, strs } from '../../../../../utils/types'
import { safe } from '../../../../../utils/utils'
import { UBlock, UBlocks, UGridColumnData, UGridData } from '../../ublockTypes'

interface Tree {
  getParent: (id: str) => UBlock
  getUBlock: (id: str) => UBlock
}

export class UGridChanger {
  #tree: Tree
  #getId: () => str

  constructor(tree: Tree, getId: () => str) {
    this.#tree = tree
    this.#getId = getId
  }

  insert = (ublocks: UBlocks, underId: str) => {
    const grid = this.#tree.getParent(underId).data as UGridData

    let underI = -1
    const column = safe(
      grid.find((c) => {
        const blockI = c.ublocks.findIndex((b) => b.id === underId)
        const found = blockI !== -1
        if (found) underI = blockI
        return found
      }),
    )

    column.ublocks.splice(underI + 1, 0, ...ublocks)
  }

  delete = (ids: strs): { moveIdsOut?: strs } => {
    const grid = this.#tree.getParent(ids[0]).data as UGridData

    const removedColumns = [] as nums

    ids.forEach((removeId) => {
      grid.forEach((column, columnI) => {
        const i = column.ublocks.findIndex((b) => b.id === removeId)
        if (i !== -1) {
          column.ublocks.splice(i, 1)
          if (!column.ublocks.length) removedColumns.push(columnI)
        }
      })
    })

    let removedCount = 0
    removedColumns.forEach((ci) => {
      grid.splice(ci - removedCount, 1)
      removedCount++
    })

    if (grid.length === 1) return { moveIdsOut: grid[0].ublocks.map((b) => b.id) }

    return {}
  }

  create = (droppedOn: str, columnIds: strs, side: 'left' | 'right'): UBlock => {
    const ublocks = columnIds.map((id) => this.#tree.getUBlock(id))
    const newColumn: UGridColumnData = { ublocks, width: '50%' }

    const gridData: UGridData = [{ ublocks: [this.#tree.getUBlock(droppedOn)], width: '50%' }, newColumn]

    if (side === 'left') gridData.reverse()

    return { id: this.#getId(), data: gridData, type: 'grid' }
  }

  createColumn = (droppedOn: str, columnIds: strs, side: 'left' | 'right') => {
    const ublocks = columnIds.map((id) => this.#tree.getUBlock(id))
    const newColumn: UGridColumnData = { ublocks, width: '50%' }
    const grid = this.#tree.getParent(droppedOn).data as UGridData

    const i = grid.findIndex((column) => column.ublocks.find((b) => b.id === droppedOn)) + (side === 'left' ? 0 : 1)

    grid.splice(i, 0, newColumn)
    eliminateDuplicatedIds(grid, i)
    grid.forEach((column) => (column.width = (1 / grid.length) * 100 + '%'))
  }

  replace = (gridBlock: UBlock, replaceId: str, block: UBlock) => {
    const grid = gridBlock.data as UGridData

    let replaceI = -1
    const column = safe(
      grid.find((c) => {
        const blockI = c.ublocks.findIndex((b) => b.id === replaceId)
        const found = blockI !== -1
        if (found) replaceI = blockI
        return found
      }),
    )
    column.ublocks[replaceI] = block
  }
}

function eliminateDuplicatedIds(grid: UGridData, column: num) {
  const searchForIds = grid[column].ublocks.map((b) => b.id)

  const removedColumns = [] as nums

  for (let i = 0; i < grid.length; i++) {
    if (i === column) continue

    grid[i].ublocks = grid[i].ublocks.filter((b) => !searchForIds.includes(b.id))
    if (!grid[i].ublocks.length) removedColumns.unshift(i)
  }

  removedColumns.forEach((i) => grid.splice(i, 1))
}
