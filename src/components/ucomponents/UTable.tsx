/* eslint-disable react/jsx-key */
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { TextField, ClickAwayListener, useTheme, Typography } from '@material-ui/core'
import { useCell, useRows, TableData } from './useTable'

interface Cell {
  i: number
  j: number
}

function Cell({ i, j }: Cell) {
  const { data, isInFocus, setData, setFocus } = useCell(i, j)
  const theme = useTheme()
  return (
    <TableCell
      key={j}
      component="td"
      width="250px"
      scope="row"
      onClick={() => setFocus()}
      sx={
        isInFocus
          ? { padding: 0, paddingLeft: '2px', backgroundColor: `${theme.palette.grey[100]}` }
          : { paddingTop: '17px' }
      }
    >
      {!isInFocus && data}
      {isInFocus && (
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
  const { rows, unfocus } = useRows(data)

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
            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {row.map((_, j) => (
                <Cell key={j} i={i} j={j} />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ClickAwayListener>
  )
}
