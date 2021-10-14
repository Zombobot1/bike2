import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { ClickAwayListener, Typography, styled, Button, Box } from '@mui/material'
import { useRows, TableData, useUTable } from './useTable'
import { useMount } from '../../utils/hooks/hooks'
import { range } from 'lodash'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { UTableCell } from './UTableCell'
import { useState } from 'react'
import { Fn } from '../../../utils/types'

interface UTable {
  data?: TableData
}

function Table_({ showCardsGenerator }: { showCardsGenerator: Fn }) {
  const { rows, unfocus } = useRows()

  return (
    <Box sx={{ ':hover .MuiButton-root': { opacity: 1 } }}>
      <Header>
        Words
        <Button startIcon={<AddRoundedIcon />} onClick={showCardsGenerator}>
          Make cards
        </Button>
      </Header>
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
                  <UTableCell key={j} i={i} j={j} />
                ))}
              </TableRow>
            ))}
            <TableRow key={rows.length}>
              {range(2).map((_, j) => (
                <UTableCell key={j} i={rows.length} j={j} isLast={true} />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </ClickAwayListener>
    </Box>
  )
}

function CardsGenerator() {
  return <p>CG</p>
}

export function UTable({ data }: UTable) {
  const [showTable, setShowTable] = useState(true)
  const reset = useUTable(2, data)

  useMount(() => reset)

  return (
    <>
      {showTable && <Table_ showCardsGenerator={() => setShowTable(false)} />}
      {!showTable && <CardsGenerator />}
    </>
  )
}

const Header = styled(Typography)(({ theme }) => ({
  paddingBottom: '0.2em',
  fontSize: '1.5em',
  fontWeight: 600,
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  '.MuiButton-root': {
    transition: '0.2s ease-in-out',
    opacity: 0,
    marginLeft: '0.5em',
    color: theme.palette.grey[500],
  },
}))
