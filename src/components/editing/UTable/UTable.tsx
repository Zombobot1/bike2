import { TableBody, styled, Box, useTheme } from '@mui/material'
import { useIsSM, useReactiveObject, useToggle } from '../../utils/hooks/hooks'
import { useState } from 'react'
import { bool, num, SetNum, SetStr, str, strs } from '../../../utils/types'
import { UBlockImplementation } from '../types'
import { ucast, getEmptyStrings, prevented } from '../../../utils/utils'
import _ from 'lodash'
import { EditableText } from '../../utils/EditableText/EditableText'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { insertAt, sum } from '../../../utils/algorithms'
import { ResizableWidth } from '../../utils/ResizableWidth/ResizableWidth'
import { PaddedBox } from '../UBlock/PaddedBox'
import { UMenu, UOption, useMenu } from '../../utils/UMenu/UMenu'

export class UTableDTO {
  rows = [getEmptyStrings(2), getEmptyStrings(2)]
  widths = [190, 190]
}

export function UTable(ps: UBlockImplementation) {
  const data = ucast<UTableDTO>(ps.data, new UTableDTO())
  const [widths, setWidths] = useReactiveObject(data.widths)
  const [rows, setRows_] = useReactiveObject(data.rows)
  const [resizingIndex, setResizingIndex] = useState(-1)
  const isSM = useIsSM()
  const setRows = (new_: strs[]) => {
    setRows_(new_)
    ps.setData(JSON.stringify({ rows: new_, widths }))
  }

  const addRow = (underI: num, where: 'above' | 'below') => {
    const i = underI + (where === 'below' ? 1 : 0)
    const r = insertAt(rows, i, getEmptyStrings(rows[0].length))
    setRows(r)
  }

  const deleteRow = (atI: num) => {
    if (rows.length > 1) setRows(rows.filter((_, i) => i !== atI))
    else setRows([getEmptyStrings(rows[0].length)])
  }

  const deleteColumn = (atJ: num) => {
    if (rows[0].length > 1) {
      setRows(rows.map((row) => row.filter((_, j) => j !== atJ)))
      setWidths(widths.filter((_, j) => j !== atJ))
    } else {
      setRows([getEmptyStrings(1)])
      setWidths([190])
    }
  }
  const addColumn = (atJ: num, where: 'left' | 'right') => {
    const j = atJ + (where === 'right' ? 1 : 0)
    setRows(rows.map((row) => insertAt(row, j, '')))
  }

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
                    addColumn={addColumn}
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
      </TableContainer>
    </PaddedBox>
  )
}

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
  ':hover button': { opacity: 1 },
})

interface Cell_ {
  width: num
  i: num
  j: num
  rowLength: num
  data: str
  setData: SetStr
  updateWidth: SetNum
  addRow: (i: num, w: 'above' | 'below') => void
  deleteRow: SetNum
  addColumn: (j: num, w: 'left' | 'right') => void
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
  addColumn,
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
  if (isEditing) bg = theme.apm('info')
  const leftRowMenu = useMenu()
  const rightRowMenu = useMenu()
  const columnMenu = useMenu()

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
      {j === 0 && (
        <>
          <MiniBtnVLeft ref={leftRowMenu.btnRef} onClick={prevented(() => leftRowMenu.toggleOpen())}>
            <MoreVertRoundedIcon />
          </MiniBtnVLeft>
          <UMenu {...leftRowMenu}>
            <UOption text="Insert below" icon={ArrowDownwardRoundedIcon} onClick={() => addRow(i, 'below')} />
            <UOption text="Insert above" icon={ArrowUpwardRoundedIcon} onClick={() => addRow(i, 'above')} />
            <UOption text="Delete row" icon={DeleteRoundedIcon} onClick={() => deleteRow(i)} />
          </UMenu>
        </>
      )}
      {j === rowLength - 1 && (
        <>
          <MiniBtnVRight ref={rightRowMenu.btnRef} onClick={prevented(() => rightRowMenu.toggleOpen())}>
            <MoreVertRoundedIcon />
          </MiniBtnVRight>
          <UMenu {...rightRowMenu}>
            <UOption text="Insert below" icon={ArrowDownwardRoundedIcon} onClick={() => addRow(i, 'below')} />
            <UOption text="Insert above" icon={ArrowUpwardRoundedIcon} onClick={() => addRow(i, 'above')} />
            <UOption text="Delete row" icon={DeleteRoundedIcon} onClick={() => deleteRow(i)} />
          </UMenu>
        </>
      )}
      {i === 0 && (
        <>
          <MiniBtnH ref={columnMenu.btnRef} onClick={prevented(() => columnMenu.toggleOpen())}>
            <MoreHorizRoundedIcon />
          </MiniBtnH>
          <UMenu {...columnMenu}>
            <UOption text="Insert left" icon={ArrowBackRoundedIcon} onClick={() => addColumn(j, 'left')} />
            <UOption text="Insert right" icon={ArrowForwardRoundedIcon} onClick={() => addColumn(j, 'right')} />
            <UOption text="Delete" icon={DeleteRoundedIcon} onClick={() => deleteColumn(j)} />
          </UMenu>
        </>
      )}
    </Cell_>
  )
}

const MiniBtn = styled('button')(({ theme }) => ({
  position: 'absolute',
  transform: 'translate(-50%, -50%)',

  padding: '0.1rem',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.apm('100')}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  overflow: 'hidden',

  opacity: 0,
  transition: theme.tra('opacity'),

  ':focus': {
    outline: 'none',
    // backgroundColor: apm(theme, '200'), doesn't look good
  },

  ':hover:after': {
    backgroundColor: theme.apm('200'),
  },

  ':active:after': {
    backgroundColor: theme.apm('400'),
  },

  '.MuiSvgIcon-root': {
    width: '16px',
    height: '16px',
    color: theme.apm('800'),
  },

  ':after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
}))

const MiniBtnVLeft = styled(MiniBtn)({
  top: '50%',
  left: 0,
  height: '1.5rem',
  width: '1rem',

  '.MuiSvgIcon-root': {
    transform: 'translate(-10%, 12%)',
  },
})

const MiniBtnVRight = styled(MiniBtnVLeft)({
  left: 'unset',
  right: 0,
  transform: 'translate(50%, -50%)',
})

const MiniBtnH = styled(MiniBtn)({
  top: 0,
  left: '50%',
  height: '1rem',
  width: '1.5rem',

  '.MuiSvgIcon-root': {
    transform: 'translate(0, -12%)',
  },
})

const Cell_ = styled('td', { label: 'Cell' })(({ theme }) => ({
  position: 'relative',
  border: theme.bd(),
  borderStyle: 'none solid solid none',
  fontSize: '1rem',
}))
