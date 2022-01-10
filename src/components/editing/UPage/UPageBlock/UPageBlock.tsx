import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import { styled, Typography, useTheme } from '@mui/material'
import { useDrop } from 'react-dnd'
import { SetStr, str } from '../../../../utils/types'
import { ucast } from '../../../../utils/utils'
import { useReactiveObject } from '../../../utils/hooks/hooks'
import { useRouter } from '../../../utils/hooks/useRouter'
import { RStack } from '../../../utils/MuiUtils'
import { DragType } from '../../types'
import { currentSelection } from '../hooks/useUpageSelection'
import { UPageDTO } from '../UPage'

export interface UPageBlock {
  id: str
  data: str
  setData: SetStr
  handleMoveBlocksTo: SetStr
}

export function UPageBlock({ id, data, setData, handleMoveBlocksTo }: UPageBlock) {
  const [page] = useReactiveObject(ucast<UPageDTO>(data, { ids: [], name: '', color: '' }))
  const { history } = useRouter()

  const theme = useTheme()

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragType.ublock,
      drop: () => {
        setData(JSON.stringify({ ...page, ids: [...page.ids, ...currentSelection.draggingIds] }))
        handleMoveBlocksTo(id)
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [page],
  )

  return (
    <Container onClick={() => history.push(id)}>
      <RStack spacing={1} justifyContent="start">
        <InsertDriveFileRoundedIcon />
        <PageName ref={drop} sx={isOver ? { backgroundColor: theme.apm('info') } : {}}>
          {page.name}
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
