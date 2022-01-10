import { useTheme, Box, Paper, Stack, styled, Typography, Drawer } from '@mui/material'
import { BoolState, num } from '../../../../utils/types'
import { useIsSM } from '../../../utils/hooks/hooks'
import { useHover } from '../../../utils/hooks/useHover'
import { getBlocksForTOC } from '../blockIdAndInfo'
import { _treefy } from './blocksInfoToTree'
import { TOCItems_, TOCItem_ } from './types'

export interface TableOfContents {
  isOpenS: BoolState
}

export function TableOfContents(ps: TableOfContents) {
  const [open, setOpen] = ps.isOpenS
  const theme = useTheme()
  const data = _treefy(getBlocksForTOC())
  const isSM = useIsSM()
  const { ref, hovered } = useHover()

  const sx = hovered
    ? {
        '.MuiPaper-root': { transform: 'translateX(-17rem)' },
      }
    : { '.MuiPaper-root': {} }

  return (
    <>
      {isSM && (
        <TOCWrapper ref={ref} justifyContent="center" sx={sx}>
          <Paper sx={{ position: 'relative' }} elevation={theme.palette.mode === 'dark' ? 1 : 6}>
            <Section color="text.secondary">Table Of Contents</Section>
            <TOCTree data={data} />
          </Paper>
        </TOCWrapper>
      )}
      {!isSM && (
        <Drawer
          sx={{ '.MuiPaper-root': { overflow: 'hidden !important' } }}
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box sx={{ padding: '1rem' }}>
            <Section color="text.secondary">Table Of Contents</Section>
            <TOCTree data={data} />
          </Box>
        </Drawer>
      )}
    </>
  )
}

const Section = styled(Typography)({
  textTransform: 'uppercase',
  fontWeight: 900,
  fontSize: '1rem',
  letterSpacing: '0.1rem',
  paddingLeft: '0.25rem',
  paddingBottom: '1rem',
  paddingTop: '1rem',
})

const TOCWrapper = styled(Stack, { label: 'TOC' })({
  height: '100%',
  width: '2.5rem',
  zIndex: 2,
  position: 'fixed',
  right: 0,
  top: 0,

  '.MuiPaper-root': {
    height: '80vh',
    width: '20rem',
    padding: '1rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(17rem)',
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
})

interface TOCTree_ {
  data: TOCItems_
}

function TOCTree({ data }: TOCTree_) {
  return (
    <Box sx={{ width: '100%', overflowY: 'auto' }}>
      {data.map((n) => (
        <TOCNode key={n.id} {...n} depth={0} />
      ))}
    </Box>
  )
}

interface TOCNode_ extends TOCItem_ {
  depth: num
}

function TOCNode({ data, scrollTo, depth, children }: TOCNode_) {
  return (
    <TOCNode_>
      <Li
        onClick={() => {
          scrollTo?.()
        }}
        sx={{ paddingLeft: 0 + 1 * depth + 'rem' }}
      >
        <Typography sx={{ padding: '0.5rem 0.5rem', lineHeight: 1.3 }}>{data}</Typography>
      </Li>
      {children?.map((c) => (
        <TOCNode key={c.id} {...c} depth={depth + 1} />
      ))}
    </TOCNode_>
  )
}

const Li = styled('li')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  ':hover': {
    backgroundColor: theme.apm('bg-hover'),
    cursor: 'pointer',
  },
}))

const TOCNode_ = styled('ul')({
  margin: 0,
  paddingLeft: 0,
  listStyleType: 'none',
})
