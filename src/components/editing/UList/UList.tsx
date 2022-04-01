import { bool, Children, num, SetStr } from '../../../utils/types'
import { UBlockContent } from '../types'
import { UBlockType, UListData, UListItem } from '../UPage/ublockTypes'
import { Box, Stack, Typography, styled } from '@mui/material'
import { RStack } from '../../utils/MuiUtils'
import { UBlock } from '../UPage/UBlock/UBlock'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'

export interface UList extends UBlockContent {
  toggleOpen: SetStr
}

export function UList({ readonly, type, data: d, toggleOpen }: UList) {
  const data = d as UListData
  return (
    <Root>
      {data.map((node, i) => (
        <Node key={node.ublock.id} i={i} node={node} type={type} toggleOpen={toggleOpen} readonly={readonly} />
      ))}
    </Root>
  )
}

interface Node {
  i: num
  type: UBlockType
  node: UListItem
  toggleOpen: SetStr
  readonly?: bool
  depth?: num
}

function Node({ i, node, readonly, type, toggleOpen, depth = 0 }: Node) {
  const { ublock, $isOpen, children, unmarked } = node
  const isOpen = $isOpen === undefined || $isOpen === true
  return (
    <Box sx={{ width: '100%' }}>
      <RStack>
        {unmarked && <Box sx={{ minWidth: 2 * (depth + 1) + 'rem' }} />}
        {type === 'bullet-list' && !unmarked && (
          <LeftPartContainer depth={depth}>
            <FiberManualRecordRounded />
          </LeftPartContainer>
        )}
        {type === 'numbered-list' && !unmarked && (
          <LeftPartContainer depth={depth}>
            <Number>{i + 1 + '.'}</Number>
          </LeftPartContainer>
        )}
        {type === 'toggle-list' && !unmarked && (
          <LeftPartContainer depth={depth} isToggle={true}>
            <IconBox onClick={() => toggleOpen(ublock.id)}>
              {isOpen ? <ArrowDropDownRoundedIcon /> : <ArrowRightRoundedIcon />}
            </IconBox>
          </LeftPartContainer>
        )}
        <UBlock block={ublock} inList={true} />
      </RStack>
      {isOpen && children && (
        <>
          {children.map((node, i) => (
            <Node
              key={node.ublock.id}
              i={i}
              node={node}
              type={type}
              toggleOpen={toggleOpen}
              readonly={readonly}
              depth={depth + 1}
            />
          ))}
        </>
      )}
    </Box>
  )
}

const Root = styled(Stack, { label: 'UListBlocksSet' })({})

interface LeftPartContainer_ {
  children: Children
  depth: num
  isToggle?: bool
}

function LeftPartContainer({ children, depth, isToggle }: LeftPartContainer_) {
  const padding = isToggle ? 0.5 : 0.75
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ paddingLeft: padding + 2 * depth + 'rem', paddingRight: padding + 'rem' }}
    >
      {children}
    </Stack>
  )
}

const FiberManualRecordRounded = styled(FiberManualRecordRoundedIcon)(({ theme }) => ({
  width: '0.5rem',
  height: '0.5rem',
  [`${theme.breakpoints.up('sm')}`]: { width: '0.65rem', height: '0.65rem' },
}))

const Number = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  [`${theme.breakpoints.up('sm')}`]: { fontSize: '1.25rem' },
}))

const IconBox = styled(Box)(({ theme }) => ({
  width: '23px',
  height: '23px',
  borderRadius: '4px',
  transition: 'background-color 0.1s ease-in-out',
  color: theme.apm('secondary'),
  cursor: 'pointer',

  ':hover': {
    backgroundColor: theme.apm('200'),
  },

  '.MuiSvgIcon-root': {
    width: '23px',
    height: '23px',
    transform: 'scale(1.3)',
  },
}))
