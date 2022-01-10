import { insertAt, removeAt, replaceAt } from '../../../utils/algorithms'
import { SetState, str, strs } from '../../../utils/types'
import { ucast } from '../../../utils/utils'
import { useC, useReactiveObject } from '../../utils/hooks/hooks'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { ResizableColumns } from '../../utils/ResizableWidth/ResizableColumns'
import { AddedBlocks, UBlockImplementation, UGridDTO } from '../types'
import { PaddedBox } from '../UBlock/PaddedBox'
import { UBlocksSet } from '../UBlockSet/UBlockSet'
import { uuid } from '../../../utils/uuid'
import { useState } from 'react'

export interface UGrid extends UBlockImplementation {
  deleteGrid: (id: str, idsLeft: strs) => void
}

export function UGrid({ data, setData, id, deleteGrid }: UGrid) {
  const [grid, setGrid] = useReactiveObject(ucast<UGridDTO>(data, new UGridDTO()))
  const [addedBlocks, setAddedBlocks] = useState<AddedBlocks>([])

  useUpdateEffect(() => {
    if (grid.ids.length === 1) {
      deleteGrid(id, grid.columns[0])
    } else setData(JSON.stringify(grid))
  }, [JSON.stringify(grid)])

  return (
    <PaddedBox>
      <ResizableColumns widths={grid.widths} updateWidths={(widths) => setData(JSON.stringify({ ...grid, widths }))}>
        {grid.columns.map((column, i) => (
          <Column
            key={grid.ids[i]}
            id={grid.ids[i]}
            ids={column}
            setGrid={setGrid}
            addedBlocks={addedBlocks}
            setAddedBlocks={setAddedBlocks}
          />
        ))}
      </ResizableColumns>
    </PaddedBox>
  )
}

interface Column_ {
  id: str
  ids: strs
  setGrid: SetState<UGridDTO>
  addedBlocks: AddedBlocks
  setAddedBlocks: (b: AddedBlocks) => void
}

function Column({ id, ids, setGrid, addedBlocks, setAddedBlocks }: Column_) {
  const setColumns = useC((f: (old: strs) => strs) => {
    setGrid((old) => {
      const i = old.ids.indexOf(id)
      const newColumn = f(old.columns[i])

      if (!newColumn.length) {
        const columns = removeAt(old.columns, i)
        const widths = Array(columns.length).fill(100 / columns.length + '%')
        return { columns, widths, ids: removeAt(old.ids, i) }
      }

      return { ...old, columns: replaceAt(old.columns, newColumn, old.ids.indexOf(id)) }
    })
  })

  const addColumn = useC((id: str, newColumn: strs, side: 'right' | 'left') => {
    const newId = uuid.v4()
    setGrid((old) => {
      const droppedI = +old.ids.indexOf(id)
      const newI = droppedI + (side === 'right' ? 1 : 0)
      const columns = insertAt(old.columns, newI, newColumn)
      const widths = Array(columns.length).fill(100 / columns.length + '%')
      return { columns, widths, ids: insertAt(old.ids, newI, newId) }
    })
  })

  return (
    <UBlocksSet
      id={id}
      ids={ids}
      setIds={setColumns}
      addedBlocks={addedBlocks}
      setAddedBlocks={setAddedBlocks}
      createColumn={addColumn}
      hideFactory={true}
    />
  )
}
