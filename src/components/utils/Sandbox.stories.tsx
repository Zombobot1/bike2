import { Box, styled } from '@mui/material'
import { gen } from '../../utils/algorithms'

export function T() {
  return <TestGrid />
}

function TestGrid() {
  const fill = false
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid>
        <Box className="history" onClick={(e) => e.stopPropagation()}>
          <Box sx={{ backgroundColor: 'blue', minHeight: '2rem' }}>
            History
            {fill && gen(12, (i) => <div style={{ height: '5rem' }}>{i}</div>)}
          </Box>
        </Box>
        <Box className="editor" onClick={(e) => e.stopPropagation()}>
          <Box sx={{ backgroundColor: 'yellow', height: '100%' }}>Editor</Box>
        </Box>
        <Box className="ucards-and-stats" onClick={(e) => e.stopPropagation()}>
          <Box className="ucards">
            <Box sx={{ backgroundColor: 'green', minHeight: '2rem' }}>
              Cards
              {fill && gen(12, (i) => <div style={{ height: '5rem' }}>{i}</div>)}
            </Box>
          </Box>
          <Box className="stats">
            <Box sx={{ backgroundColor: 'red', minHeight: '2rem' }}>
              Stats
              {fill && gen(12, (i) => <div style={{ height: '5rem' }}>{i}</div>)}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  )
}

const Grid = styled(Box, { label: 'IdeaEditor' })(({ theme }) => ({
  minHeight: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 32rem)',
  gridTemplateRows: 'auto auto auto', // % leads to weird overflow
  gap: '1rem',
  justifyContent: 'center',
  alignContent: 'center',
  padding: '1rem',
  overflowX: 'hidden',

  '.editor': { minHeight: '32rem' }, // minHeight 32rem instead of minHeight: 90, because if grid is in parent with height 100% it doesn't work
  '.history': { gridRow: '3 / 4' },

  '.ucards-and-stats': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1rem',
  },

  [`${theme.breakpoints.up('md')}`]: {
    gridTemplateColumns: '35% 45%',
    gridTemplateRows: '60vh 20vh', // % leads to weird overflow
    padding: 0,

    '.history': {
      gridColumn: '1 / 2',
      gridRow: '2 / 3',
      overflow: 'auto',
    },

    '.editor': {
      height: 'auto',
      gridColumn: '2 / 3',
      gridRow: '1 / 3',
    },

    '.ucards-and-stats': {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
      overflow: 'auto',
      justifyContent: 'start',

      '.ucards, .stats': {
        maxHeight: '50%',
        overflow: 'auto',
      },
    },
  },

  [`${theme.breakpoints.up('lg')}`]: {
    gridTemplateColumns: '25% 35% minmax(20rem, 25%)',
    gridTemplateRows: '80vh', // % leads to weird overflow

    '.history': {
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
    },

    '.editor': {
      gridColumn: '2 / 3',
      gridRow: '1 / 1',
    },

    '.ucards-and-stats': {
      gridColumn: '3 / 4',
      gridRow: '1 / 1',
      justifyContent: 'center',
    },
  },
}))

export default {
  title: 'Sandbox/Sandbox',
}
