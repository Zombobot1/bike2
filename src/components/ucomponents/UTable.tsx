/* eslint-disable react/jsx-key */
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { TextField, ClickAwayListener, useTheme, Typography } from '@material-ui/core'
import { useCell, useRows, TableData } from './useTable'
import { useMount } from '../../utils/hooks-utils'
import { useEventListener } from '../../components/utils/hooks/use-event-listener'
import { range } from 'lodash'
import { KeyboardEvent } from 'react'

interface Cell {
  i: number
  j: number
  isLast?: boolean
}

function Cell({ i, j, isLast = false }: Cell) {
  const { data, isInFocus, isEditing, setData, startEditing, finishEditing, setDataFromClipboard, unfocus } = useCell(
    i,
    j,
    isLast,
  )
  const theme = useTheme()

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Escape' && isEditing) {
      finishEditing()
      ref.current.focus()
    } else if (e.key == 'Escape' && !isEditing) unfocus()
    else if (e.ctrlKey && e.key === 'v' && !isEditing) {
      navigator.clipboard
        .readText()
        .then(setDataFromClipboard)
        .catch((err) => console.error('Failed to read clipboard contents: ', err))
    }
  }

  const ref = useEventListener('keydown', handleKeyDown, isEditing)

  return (
    <TableCell
      ref={ref}
      key={j}
      component="td"
      width="250px"
      scope="row"
      onClick={startEditing}
      tabIndex={i * 100 + j}
      sx={
        isEditing
          ? { padding: 0, paddingLeft: '2px', backgroundColor: `${theme.palette.grey[100]}` }
          : {
              paddingTop: data || isLast ? '17px' : '39px', // anomaly: cannot specify minHeight for row with no data
              backgroundColor: isInFocus ? `${theme.palette.grey[100]}` : `${theme.palette.common.white}`,
              outline: 'none',
            }
      }
    >
      {!isEditing && !isLast && data}
      {!isEditing && isLast && j === 0 && (
        <Typography color="text.secondary" sx={{ height: '22px' }}>
          New row...
        </Typography>
      )}
      {isEditing && (
        <TextField
          defaultValue={data}
          autoFocus
          onFocus={(event) => {
            event.target.select()
          }}
          onBlur={(event) => setData(event.target.value)}
          inputProps={{ style: { fontSize: 16, lineHeight: 1.4 } }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}
          multiline
        />
      )}
    </TableCell>
  )
}

interface UTable {
  data?: TableData
}
export function UTable({ data }: UTable) {
  const { rows, unfocus, reset } = useRows(2, data)

  useMount(() => reset)

  return (
    <ClickAwayListener onClickAway={unfocus}>
      <Table sx={{ width: 'unset' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontSize="large" fontWeight="bold">
                Phrase
              </Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize="large" fontWeight="bold">
                Meaning
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((_, j) => (
                <Cell key={j} i={i} j={j} />
              ))}
            </TableRow>
          ))}
          <TableRow key={rows.length}>
            {range(2).map((_, j) => (
              <Cell key={j} i={rows.length} j={j} isLast={true} />
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </ClickAwayListener>
  )
}
