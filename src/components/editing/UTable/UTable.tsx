import { TableBody, styled, Box, useTheme, alpha, Button } from '@mui/material'
import { useIsSM, useReactiveObject, useToggle } from '../../utils/hooks/hooks'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useState } from 'react'
import { bool, num, SetNum, SetStr, str, strs } from '../../../utils/types'
import { UBlockComponentB } from '../types'
import { cast, getEmptyStrings, prevented } from '../../../utils/utils'
import _ from 'lodash'
import { EditableText } from '../../utils/EditableText/EditableText'
import { IBtn } from '../../utils/MuiUtils'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { sum } from '../../../utils/algorithms'
import { ResizableWidth } from '../../utils/ResizableWidth/ResizableWidth'
import { PaddedBox } from '../UBlock/PaddedBox'

export class UTableDTO {
  rows = [getEmptyStrings(2), getEmptyStrings(2)]
  widths = [190, 190]
}

export function UTable(ps: UBlockComponentB) {
  const data = cast<UTableDTO>(ps.data, new UTableDTO())
  const [widths, setWidths] = useReactiveObject(data.widths)
  const [rows, setRows_] = useReactiveObject(data.rows)
  const [resizingIndex, setResizingIndex] = useState(-1)
  const isSM = useIsSM()
  const setRows = (new_: strs[]) => {
    setRows_(new_)
    ps.setData(JSON.stringify({ rows: new_, widths }))
  }

  const addRow = (underI: num) =>
    setRows([...rows.slice(0, underI + 1), getEmptyStrings(rows[0].length), ...rows.slice(underI + 1)])
  const deleteRow = (atI: num) => setRows(rows.filter((_, i) => i !== atI))
  const deleteColumn = (atJ: num) => setRows(rows.map((row) => row.filter((_, j) => j !== atJ)))
  const addColumn = () => setRows(rows.map((row) => [...row, '']))

  return (
    <PaddedBox p={0.85} sx={{ overflowX: !isSM ? 'scroll' : undefined }}>
      <TableContainer sx={{ width: sum(widths, (a, c) => a + c) }}>
        <Table_ width="100%">
          <TableBody>
            {rows.map((row, i) => (
              <Row key={i}>
                {row.map((cell, j) => (
                  <Cell
                    key={`${i} ${j}`}
                    width={widths[j]}
                    data={cell}
                    i={i}
                    j={j}
                    rowLength={row.length}
                    setData={(d) => {
                      const newRows = _.cloneDeep(rows)
                      newRows[i][j] = d
                      setRows(newRows)
                    }}
                    updateWidth={(w) => {
                      const newWidth = _.cloneDeep(widths)
                      newWidth[j] = w
                      setWidths(newWidth)
                      setResizingIndex(-1)
                      ps.setData(JSON.stringify({ rows, widths: newWidth }))
                    }}
                    addRow={addRow}
                    deleteRow={deleteRow}
                    deleteColumn={deleteColumn}
                    isResizing={resizingIndex === j}
                    onWidthChange={(w) => {
                      const newWidth = _.cloneDeep(widths)
                      newWidth[j] = w
                      setWidths(newWidth)
                    }}
                  />
                ))}
              </Row>
            ))}
          </TableBody>
        </Table_>
        {isSM && (
          <AddColumnBtn size="small" className="add-column" onClick={addColumn}>
            + Column
          </AddColumnBtn>
        )}
      </TableContainer>
    </PaddedBox>
  )
}

const AddColumnBtn = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  transform: 'translate(120%, -60%)',
  opacity: 0,
  transition: theme.tra('opacity'),
}))

const TableContainer = styled(Box)({
  position: 'relative',
  ':hover .add-column': { opacity: 1 },
})

const Table_ = styled('table')(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
  'tr:first-of-type td:first-of-type': { borderTopLeftRadius: theme.shape.borderRadius },
  'tr:first-of-type td:last-child': { borderTopRightRadius: theme.shape.borderRadius },
  'tr:last-child td:first-of-type': { borderBottomLeftRadius: theme.shape.borderRadius },
  'tr:last-child td:last-child': { borderBottomRightRadius: theme.shape.borderRadius },
  'tr:first-of-type td': { borderTopStyle: 'solid' },
  'tr td:first-of-type': { borderLeftStyle: 'solid' },
}))

const Row = styled('tr')({
  ':hover .MuiIconButton-root': { opacity: 1 },
})

interface Cell_ {
  width: num
  i: num
  j: num
  rowLength: num
  data: str
  setData: SetStr
  updateWidth: SetNum
  addRow: SetNum
  deleteRow: SetNum
  deleteColumn: SetNum
  isResizing: bool
  onWidthChange: SetNum
}

function Cell({
  i,
  j,
  data,
  width,
  setData,
  addRow,
  rowLength,
  deleteRow,
  deleteColumn,
  updateWidth,
  isResizing,
}: Cell_) {
  const theme = useTheme()
  const needBG = i === 0
  const [isEditing, toggleIsEditing] = useToggle()
  const [clicksCount, setClicksCount] = useState(0)
  let bg: str | undefined = undefined
  if (needBG && !isEditing) bg = theme.apm('bg')
  if (isEditing) bg = alpha(theme.palette.info.main, 0.25)

  const sx = i === 0 && j === 0 ? { transform: 'translate(-120%, -10%)' } : {}

  return (
    <Cell_
      sx={{
        fontWeight: needBG ? 'bold' : undefined,
        backgroundColor: bg,
      }}
    >
      <ResizableWidth
        width={width}
        maxWidth={190 * 2}
        updateWidth={updateWidth}
        rightOnly={true}
        hiddenHandler={i !== 0}
        stretch={isResizing}
        stretchHandler={true}
      >
        <Box sx={{ padding: '0.5rem' }} onClick={() => setClicksCount((old) => old + 1)}>
          <EditableText
            text={data}
            setText={setData}
            tag="p"
            onBlur={toggleIsEditing}
            onFocus={toggleIsEditing}
            focus={clicksCount}
          />
        </Box>
      </ResizableWidth>
      {j === 0 && <AddRowBtn sx={sx} icon={AddRoundedIcon} size="small" onClick={prevented(() => addRow(i))} />}
      {i === 0 && <DeleteColumn icon={DeleteRoundedIcon} size="small" onClick={prevented(() => deleteColumn(i))} />}
      {j === rowLength - 1 && (
        <DeleteRowBtn icon={DeleteRoundedIcon} size="small" onClick={prevented(() => deleteRow(i))} />
      )}
    </Cell_>
  )
}

const Cell_ = styled('td')(({ theme }) => ({
  position: 'relative',
  border: theme.bd(),
  borderStyle: 'none solid solid none',
  fontSize: '1rem',
}))

const AddRowBtn = styled(IBtn)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translate(-120%, -50%)',
  opacity: 0,
  transition: theme.tra('opacity'),
}))

const DeleteRowBtn = styled(IBtn)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translate(120%, -50%)',
  opacity: 0,
  transition: theme.tra('opacity'),
}))

const DeleteColumn = styled(IBtn)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translate(-50%,-110%)',
  opacity: 0,
  transition: theme.tra('opacity'),
}))
