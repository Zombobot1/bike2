import { useAtom } from 'jotai'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useMount } from '../../utils/hooks/hooks'
import { getEmptyStrings } from '../../../utils/utils'
import { safeSplit } from '../../../utils/algorithms'

export type TableData = string[][]

const rowsA = atomWithReset<TableData>([])
const focusedCellA = atomWithReset({ i: -1, j: -1 })
const columnsNumberA = atomWithReset(0)
const isEditingA = atomWithReset(false)

function parseData(data: string): TableData {
  return safeSplit(data, '\n').map((row) => safeSplit(row, ' - '))
}

export function useRows() {
  const [rows] = useAtom(rowsA)
  const [_fc, setFocusedCell] = useAtom(focusedCellA)
  const unfocus = () => setFocusedCell({ i: -1, j: -1 })

  return { rows, unfocus }
}

export function useUTable(columnsNumber: number, initialRows?: TableData) {
  const [_rows, setRows] = useAtom(rowsA)
  const [_, setColumnsNumber] = useAtom(columnsNumberA)

  useMount(() => {
    if (initialRows) setRows(initialRows)
    else setRows([getEmptyStrings(columnsNumber)])
    setColumnsNumber(columnsNumber)
  })

  const resetRows = useResetAtom(rowsA)
  const resetFocus = useResetAtom(focusedCellA)
  const resetColumnsNumber = useResetAtom(columnsNumberA)
  const resetIsEditing = useResetAtom(isEditingA)

  return () => {
    resetRows()
    resetFocus()
    resetColumnsNumber()
    resetIsEditing()
  }
}

export function useCell(i: number, j: number, isLast: boolean) {
  const [rows, setRows] = useAtom(rowsA)
  const [focusedCell, setFocusedCell] = useAtom(focusedCellA)
  const [columnsNumber] = useAtom(columnsNumberA)
  const [isEditing_, setIsEditing_] = useAtom(isEditingA)

  const setLastRowData = (data: string) => {
    if (!data) return
    setRows((rs) => [...rs, getEmptyStrings(columnsNumber).map((c, cellJ) => (j !== cellJ ? c : data))])
  }

  const setData = (data: string) => {
    setRows((rs) => rs.map((r, rowI) => (i !== rowI ? r : r.map((c, cellJ) => (j !== cellJ ? c : data)))))
  }

  const setFocus = () => setFocusedCell({ i, j })
  const startEditing = () => {
    setFocus()
    setIsEditing_(true)
  }
  const finishEditing = () => setIsEditing_(false)

  const unfocus = () => setFocusedCell({ i: -1, j: -1 })

  const isInFocus = focusedCell.i === i && focusedCell.j === j
  const isEditing = isInFocus && isEditing_

  return {
    data: isLast ? '' : rows[i][j],
    setData: isLast ? setLastRowData : setData,
    setDataFromClipboard: (data: string) => setRows(parseData(data)),
    isInFocus,
    isEditing,
    setFocus,
    startEditing,
    finishEditing,
    unfocus,
  }
}
