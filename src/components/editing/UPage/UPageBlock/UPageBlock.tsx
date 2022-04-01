import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import { styled, Typography, useTheme } from '@mui/material'
import { useDrop } from 'react-dnd'
import { useNavigate } from 'react-router'
import { SetStr } from '../../../../utils/types'
import { RStack } from '../../../utils/MuiUtils'
import { DragType, UBlockContent } from '../../types'
import { UPageBlockData } from '../ublockTypes'

export interface UPageBlock extends UBlockContent {
  handleMoveBlocksTo: SetStr
}

export function UPageBlock({ data, handleMoveBlocksTo }: UPageBlock) {
  const { id, $name: name = '' } = data as UPageBlockData
  const navigate = useNavigate()

  const theme = useTheme()

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragType.ublock,
      drop: () => handleMoveBlocksTo(id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [],
  )

  return (
    <Container onClick={() => navigate('/' + id)}>
      <RStack spacing={1} justifyContent="start">
        <InsertDriveFileRoundedIcon />
        <PageName ref={drop} sx={isOver ? { backgroundColor: theme.apm('info') } : {}}>
          {name}
        </PageName>
      </RStack>
    </Container>
  )
}

const PageName = styled(Typography)(({ theme }) => ({
  textDecoration: 'underline',
  textDecorationColor: theme.apm('border'),
  textUnderlineOffset: '0.25rem',
}))

const Container = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: '0.5rem',
  width: '100%',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: theme.apm('bg'),
  },
}))
