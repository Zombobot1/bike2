import { insertAt, removeAt, replaceAt } from '../../../utils/algorithms'
import { num, str, strs } from '../../../utils/types'
import { ucast } from '../../../utils/utils'
import { useReactiveObject } from '../../utils/hooks/hooks'
import useUpdateEffect from '../../utils/hooks/useUpdateEffect'
import { ResizableColumns } from '../../utils/ResizableWidth/ResizableColumns'
import { UBlockComponent, UGridDTO } from '../types'
import { PaddedBox } from '../UBlock/PaddedBox'
import { UBlocksSet } from '../UPage/UBlockSet/UBlockSet'
import { uuid } from '../../../utils/uuid'

export interface UGrid extends UBlockComponent {
  deleteGrid: (id: str, idsLeft: strs) => void
}

export function UGrid({ data, setData, id, deleteGrid }: UGrid) {
  const [grid, setGrid_] = useReactiveObject(ucast<UGridDTO>(data, new UGridDTO()))

  useUpdateEffect(() => {
    if (grid.ids.length === 1) {
      deleteGrid(id, grid.columns[0])
    } else setData(JSON.stringify(grid))
  }, [JSON.stringify(grid)])

  const setColumns = (i: num) => (newColumn: strs) => {
    if (!newColumn.length)
      setGrid_((old) => {
        const columns = removeAt(old.columns, i)
        const widths = Array(columns.length).fill(100 / columns.length + '%')
        return { columns, widths, ids: removeAt(old.ids, i) }
      })
    else setGrid_((old) => ({ ...old, columns: replaceAt(old.columns, newColumn, i) }))
  }

  const addColumn = (id: str, newColumn: strs, side: 'right' | 'left') => {
    setGrid_((old) => {
      const droppedI = +old.ids.indexOf(id)
      const newI = droppedI + (side === 'right' ? 1 : 0)
      const columns = insertAt(old.columns, newColumn, newI)
      const widths = Array(columns.length).fill(100 / columns.length + '%')
      return { columns, widths, ids: insertAt(old.ids, uuid.v4(), newI) }
    })
  }

  return (
    <PaddedBox>
      <ResizableColumns widths={grid.widths} updateWidths={(widths) => setData(JSON.stringify({ ...grid, widths }))}>
        {grid.columns.map((column, i) => (
          <UBlocksSet
            id={grid.ids[i]}
            key={i}
            ids={column}
            setIds={setColumns(i)}
            hideFactory={true}
            createColumn={addColumn}
          />
        ))}
      </ResizableColumns>
    </PaddedBox>
  )
}
