import { styled, Typography } from '@mui/material'

import Masonry from 'react-masonry-css'
import { useIsSM } from '../../utils/hooks/hooks'

const TrainingsMasonry = styled(Masonry)({
  display: 'flex',
  marginLeft: '-20px' /* gutter size offset */,

  '.my-masonry-grid_column': {
    paddingLeft: '20px' /* gutter size */,
    backgroundClip: 'padding-box',
  },
})

const _Trainings_ = () => {
  // const { data } = useTrainings()

  const isSM = useIsSM()
  const columns = isSM ? 4 : 1

  return (
    <TrainingsMasonry
      breakpointCols={columns}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
      // sx={{ width: isSM ? 4 * 320 + 20 * 3 : 'auto' }}
    >
      {/* {data?.map((e, j) => (
        <TrainingDeck {...e} key={j} />
      ))} */}
    </TrainingsMasonry>
  )
}

export function Trainings() {
  return (
    <div style={{ padding: '4rem' }}>
      <Typography fontSize="large" sx={{ fontWeight: 600, marginBottom: 1 }}>
        Regular trainings
      </Typography>
      {/* <IdeasTable /> */}
    </div>
  )
}
