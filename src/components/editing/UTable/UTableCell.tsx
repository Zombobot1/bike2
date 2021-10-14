import TableCell from '@mui/material/TableCell'
import { TextField, useTheme, Typography } from '@mui/material'
import { useCell } from './useTable'
import { useEventListener } from '../../utils/hooks/useEventListener'

interface UTableCell {
  i: number
  j: number
  isLast?: boolean
}

export function UTableCell({ i, j, isLast = false }: UTableCell) {
  const { data, isInFocus, isEditing, setData, startEditing, finishEditing, setDataFromClipboard, unfocus } = useCell(
    i,
    j,
    isLast,
  )
  const theme = useTheme()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isEditing) {
      finishEditing()
      ref.current.focus()
    } else if (e.key === 'Escape' && !isEditing) unfocus()
    else if (e.ctrlKey && e.key === 'v' && !isEditing) {
      navigator.clipboard
        .readText()
        .then(setDataFromClipboard)
        .catch((err) => console.error('Failed to read clipboard contents: ', err))
    }
  }

  const ref = useEventListener('keydown', handleKeyDown)

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
              paddingTop: data || isLast ? '17px' : '39px',
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
