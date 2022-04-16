import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { q } from '../../../../fb/q'
import { useCollectionData } from '../../../../fb/useData'
import { str } from '../../../../utils/types'
import { IdeaEditor } from './IdeaEditor'

const T = (ideaId: str) => {
  const [show, setShow] = useState(true)
  const trainings = useCollectionData(q('trainings').where('userId', '==', 'cat-lover'))
  const training = trainings.find((t) => t.ideaId === ideaId)

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {show && <IdeaEditor id={ideaId} training={training} upageId="" close={() => setShow(false)} />}
      {!show && <Button onClick={() => setShow(true)}>Show</Button>}
    </Box>
  )
}

export const Create = () => T('newIdea')
export const EditShortAnswer = () => T('q3')

export default {
  title: 'Ideas/IdeaEditor',
}
