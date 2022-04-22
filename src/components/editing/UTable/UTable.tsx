import { TableBody, styled, Box, useTheme } from '@mui/material'
import { useIsSM, useToggle } from '../../utils/hooks/hooks'
import { useState } from 'react'
import { bool, num, SetNum, str, strs } from '../../../utils/types'
import { UBlockContent } from '../types'
import { prevented } from '../../../utils/utils'
import { EditableText } from '../../utils/EditableText/EditableText'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { gen, sum } from '../../../utils/algorithms'
import { ResizableWidth } from '../../utils/ResizableWidth/ResizableWidth'
import { PaddedBox } from '../UPage/UBlock/PaddedBox'
import { UMenu, UOption, useMenu } from '../../utils/UMenu/UMenu'
import { UTableData } from '../UPage/ublockTypes'
import { UTableChanger } from './useUTable'

export function UTable({ id, data: d, setData }: UBlockContent) {
  const rawData = d as UTableData
  const changer = new UTableChanger(rawData, (d) => setData(id, d))
  const [tmpWidth, setTmpWidth] = useState({ j: -1, w: 0 })
  const [resizingIndex, setResizingIndex] = useState(-1)
  const data = rotateTable(rawData)
  // const rows = gen(rawData[0].rows.length)
  const isSM = useIsSM()

  // TODO: navigate by keys
  // overflowX cuts buttons (in 1st column it's really noticeable) - cannot find a fix
  return (
    <PaddedBox p={0.85} sx={{ overflowX: !isSM ? 'scroll' : undefined }}>
      <TableContainer sx={{ width: sum(rawData, (a, col) => a + col.width) }}>
        <Table_ width="100%">
          <TableBody>
            {data.map((row, i) => (
              <Row key={i}>
                {row.map((value, j) => (
                  <Cell
                    key={`${i} ${j}`}
                    width={tmpWidth.j === j ? tmpWidth.w : rawData[j].width}
                    data={value}
                    i={i}
                    j={j}
                    rowLength={row.length}
                    isResizing={resizingIndex === j}
                    onWidthChange={(w) => setTmpWidth({ j, w })}
                    setData={changer.setCell}
                    addRow={changer.addRow}
                    deleteRow={changer.removeRow}
                    addColumn={changer.addColumn}
                    deleteColumn={changer.removeColumn}
                    updateWidth={(w) => {
                      setTmpWidth({ j: -1, w: 0 })
                      setResizingIndex(-1)
                      changer.updateWidth(j, w)
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

function rotateTable(table: UTableData): strs[] {
  const iMax = table[0].rows.length
  const jMax = table.length
  const r = gen(iMax, () => gen(jMax, () => ''))
  for (let i = 0; i < table[0].rows.length; i++) {
    for (let j = 0; j < table.length; j++) {
      r[i][j] = table[j].rows[i]
    }
  }
  return r
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
  setData: (i: num, j: num, d: str) => void
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
        minWidth={50}
        updateWidth={updateWidth}
        rightOnly={true}
        hiddenHandler={i !== 0}
        stretch={isResizing}
        stretchHandler={true}
      >
        <Box sx={{ padding: '0.5rem' }} onClick={() => setClicksCount((old) => old + 1)}>
          <EditableText
            text={data}
            setText={(d) => setData(i, j, d)}
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

  // padding: '0.1rem', // causes strange icon offsets depending on rows count (even / not even)
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
}))

const MiniBtnVLeft = styled(MiniBtn)({
  top: '50%',
  left: 0,
  height: '1.5rem',
  width: '1rem',

  '.MuiSvgIcon-root': {
    transform: 'translate(-6.5px, 1.5px)',
  },
})

const MiniBtnVRight = styled(MiniBtnVLeft)({
  left: 'unset',
  right: 0,
  transform: 'translate(50%, -50%)',
})

const MiniBtnH = styled(MiniBtn)(({ theme }) => ({
  top: 0,
  left: '50%',
  height: '1rem',
  width: '1.5rem',

  '.MuiSvgIcon-root': {
    transform: 'translate(0, -18%)',
  },

  [`${theme.breakpoints.up('sm')}`]: {
    '.MuiSvgIcon-root': {
      transform: 'translate(-3px, -2px)',
    },
  },
}))

const Cell_ = styled('td', { label: 'Cell' })(({ theme }) => ({
  position: 'relative',
  border: theme.bd(),
  borderStyle: 'none solid solid none',
  fontSize: '1rem',
}))
