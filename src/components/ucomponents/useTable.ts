import { atom, useAtom } from 'jotai'

import { useMount } from '../../utils/hooks-utils'

export type TableData = string[][]

const rowsA = atom<TableData>([])
const focusedCellA = atom({ i: -1, j: -1 })

function useRows_(initialRows?: TableData) {
  const [rows, setRows] = useAtom(rowsA)
  const [focusedCell, setFocusedCell] = useAtom(focusedCellA)

  useMount(() => {
    if (initialRows) setRows(initialRows)
  })

  return { rows, setRows, focusedCell, setFocusedCell }
}

export function useRows(initialRows?: TableData) {
  const { rows, setFocusedCell } = useRows_(initialRows)

  const unfocus = () => setFocusedCell({ i: -1, j: -1 })

  return { rows, unfocus }
}

export function useCell(i: number, j: number) {
  const { rows, setRows, focusedCell, setFocusedCell } = useRows_()

  const setData = (data: string) => {
    setRows((rs) => rs.map((r, rowI) => (i !== rowI ? r : r.map((c, cellJ) => (j !== cellJ ? c : data)))))
  }

  const setFocus = () => setFocusedCell({ i, j })

  return {
    data: rows[i][j],
    setData,
    isInFocus: focusedCell.i === i && focusedCell.j === j,
    setFocus,
  }
}
