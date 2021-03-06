import { Box, Collapse, Stack, styled, Typography, useTheme } from '@mui/material'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import { JSObject, num, SetStr, str } from '../../../../utils/types'
import { prevented } from '../../../../utils/utils'
import { useURouter } from '../../../utils/hooks/useRouter'
import { ReactNode } from 'react'
import { sslugify } from '../../../../utils/sslugify'
import { _apm } from '../../theming/theme'
import { UPageNode, UPageNodes } from '../../Workspace/types'

export interface NavTree {
  nodes: UPageNodes
  onOpen: SetStr
}

export function NavTree({ nodes, onOpen }: NavTree) {
  return (
    <>
      {nodes.map((n) => (
        <NavNode key={n.id} {...n} depth={0} onOpen={onOpen} />
      ))}
    </>
  )
}

export interface NavNode extends UPageNode {
  depth: num
  onOpen: SetStr
}

function NavNode({ id, name, _isOpen: isOpen, onOpen, depth, children }: NavNode) {
  const { location, navigate } = useURouter()
  const theme = useTheme()

  return (
    <NavNode_>
      <li>
        <NavNodeLabel
          onClick={() => navigate('/' + id)}
          direction="row"
          alignItems="center"
          sx={location.pathname === '/' + id ? { backgroundColor: _apm(theme, '400') } : {}}
        >
          <Box sx={{ width: 16 * depth }} />
          {children && isOpen && (
            <IconBox onClick={prevented(() => onOpen(id))}>
              <ArrowDropDownRoundedIcon />
            </IconBox>
          )}
          {children && !isOpen && (
            <IconBox onClick={prevented(() => onOpen(id))}>
              <ArrowRightRoundedIcon />
            </IconBox>
          )}
          {!children && (
            <Stack sx={{ width: '23px', height: '23px' }} justifyContent="center" alignItems="center">
              <Dot />
            </Stack>
          )}
          <Typography sx={{ marginLeft: '0.25rem' }}>{name || 'Untitled'}</Typography>
        </NavNodeLabel>
        <Collapse in={isOpen}>
          {children?.map((c) => (
            <NavNode key={c.id} {...c} depth={depth + 1} onOpen={onOpen} />
          ))}
        </Collapse>
      </li>
    </NavNode_>
  )
}

const IconBox = styled(Box)(({ theme }: JSObject) => ({
  width: '23px',
  height: '23px',
  borderRadius: '4px',
  transition: 'background-color 0.1s ease-in-out',
  color: _apm(theme, 'secondary'),

  ':hover': {
    backgroundColor: _apm(theme, '200'),
  },

  '.MuiSvgIcon-root': {
    width: '23px',
    height: '23px',
    transform: 'scale(1.3)',
  },
}))

const NavNode_ = styled('ul')({
  margin: 0,
  paddingLeft: 0,
  listStyleType: 'none',
})

const NavNodeLabel = styled(Stack)(({ theme }) => ({
  position: 'relative',
  paddingLeft: '0.25rem',
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  cursor: 'pointer',
  borderRadius: '0.5rem',

  '&:hover::before': {
    backgroundColor: _apm(theme, '200'),
  },

  ':before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '0.5rem',
  },
}))

const Dot = styled(FiberManualRecordRoundedIcon)(({ theme }) => ({
  width: '8px',
  height: '8px',
  color: _apm(theme, 'secondary'),
}))

export interface NavLink {
  name: str
  icon: ReactNode
}
export function NavLink({ name, icon }: NavLink) {
  const { navigate, location } = useURouter()
  const theme = useTheme()
  const id = sslugify(name)
  return (
    <NavNodeLabel
      onClick={() => navigate('/' + id)}
      direction="row"
      alignItems="center"
      spacing={1}
      sx={location.pathname === '/' + id ? { backgroundColor: _apm(theme, '400') } : {}}
    >
      {icon}
      <Typography sx={{ marginLeft: '0.25rem' }}>{name}</Typography>
    </NavNodeLabel>
  )
}
