import { Box } from '@mui/material'
import { UBlock } from '../../UBlock/UBlock'

const T = (props: UBlock) => () => {
  return (
    <Box sx={{ width: 500 }}>
      <UBlock {...props} />
    </Box>
  )
}

const data: UBlock = {
  id: 'newVideo',
  initialData: { data: '', type: 'video' },
}

const readonly: UBlock = {
  id: 'new&readonlyVideo',
  initialData: { data: '', type: 'video' },
  readonly: true,
}

const resizable: UBlock = {
  id: 'catVideo',
}

export const AwaitsLink = T(data)
export const NewAndReadonly = T(readonly)
export const Resizable = T(resizable)

export default {
  title: 'Editing/UVideoFile',
}
