import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import { styled, Typography, useTheme } from '@mui/material'
import { useDrop } from 'react-dnd'
import { SetStr, str } from '../../../../utils/types'
import { ucast } from '../../../../utils/utils'
import { useMount, useReactiveObject } from '../../../utils/hooks/hooks'
import { useRouter } from '../../../utils/hooks/useRouter'
import { RStack } from '../../../utils/MuiUtils'
import { BlockInfo, DragType } from '../../types'
import { useSelection } from '../../UBlock/useSelection'
import { UPageDataDTO } from '../UPage'

export interface UPageBlock {
  id: str
  data: str
  setData: SetStr
  handleMoveBlocksTo: SetStr
  addInfo?: (id: str, i: BlockInfo) => void
}

export function UPageBlock({ id, data, setData, handleMoveBlocksTo, addInfo }: UPageBlock) {
  const [page] = useReactiveObject(ucast<UPageDataDTO>(data, { ids: [], name: '', color: '' }))
  const { selection, dispatch } = useSelection()
  const { history } = useRouter()

  const theme = useTheme()

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragType.ublock,
      drop: () => {
        setData(JSON.stringify({ ...page, ids: [...page.ids, ...selection.draggingIds] }))
        handleMoveBlocksTo(id)
        dispatch({ a: 'clear' })
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [handleMoveBlocksTo, selection.draggingIds],
  )

  useMount(() => {
    addInfo?.(id, { type: 'page', data: '', i: -1 })
  })

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
