import { Box, Button, Modal } from '@mui/material'
import { useState } from 'react'
import { _ideaDTOs, _ideaTrainingDTOs } from '../../../../content/ideas'
import { TrainingIdAndDTO } from '../../../../fb/FSSchema'
import { _get } from '../../../../utils/algorithms'
import { useMount } from '../../../utils/hooks/hooks'
import { useTestIdeaState_, _ideaFromDTO } from '../../IdeaState'
import { IdeaData } from '../../types'
import { IdeaEditor_ } from './IdeaEditor'

type T = { idea: IdeaData; trainingDTO?: TrainingIdAndDTO }
const T = ({ idea, trainingDTO }: T) => {
  const [show, setShow] = useState(false) // Sorybook nav is open on page reload if true is initial value
  const { data, changer, training } = useTestIdeaState_(idea, trainingDTO)
  const closeTriggerS = useState(0)
  const [_, setCloseTrigger] = closeTriggerS

  useMount(() => setShow(true))

  return (
    <Box>
      <Modal open={show} onClose={() => setCloseTrigger((o) => o + 1)}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'scroll' }}>
          <IdeaEditor_
            data={data}
            changer={changer}
            training={training}
            close={() => {
              setShow(false)
              setCloseTrigger(0)
            }}
            closeTriggerS={closeTriggerS}
          />
        </Box>
      </Modal>
      <Button onClick={() => setShow(true)}>Show</Button>
    </Box>
  )
}

const create: T = {
  idea: { ublocks: [] },
}

const editSAQ: T = {
  idea: _ideaFromDTO(_get(_ideaDTOs, 'q3')),
  trainingDTO: { ..._get(_ideaTrainingDTOs, 'q3'), id: 'q3' },
}

const editIE: T = {
  idea: _ideaFromDTO(_get(_ideaDTOs, 'q4')),
  trainingDTO: { ..._get(_ideaTrainingDTOs, 'q4'), id: 'q4' },
}

export const Create = () => T(create)
export const EditShortAnswer = () => T(editSAQ)
export const EditInlineExercise = () => T(editIE)

export default {
  title: 'Ideas/IdeaEditor',
}
