import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { fn, setStr } from '../../../utils/types'
import { UBlock } from '../../editing/UBlock/UBlock'
import { useUForm } from '../useUForm'

const T = (props: UBlock) => () => {
  const { validateNew, submit, wasSubmitted, retry } = useUForm(true)
  const [canSubmit, setCanSubmit] = useState(false)
  const [score, setScore] = useState(0)
  const create = () => setCanSubmit(!validateNew())

  return (
    <Box sx={{ width: 500 }}>
      <Stack>
        <UBlock {...props} readonly={canSubmit} />
        {!canSubmit && (
          <Button onClick={create} data-cy="create">
            Create
          </Button>
        )}
        {canSubmit && !wasSubmitted && (
          <Button onClick={() => submit(setScore)} data-cy="submit">
            Submit
          </Button>
        )}
        {wasSubmitted && (
          <Button onClick={retry} data-cy="retry">
            Retry {score}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

const input1: UBlock = {
  id: 'input1',
  initialData: { data: '', type: 'input' },
}

const text1: UBlock = {
  id: 'textarea1',
  initialData: { data: '', type: 'textarea' },
}

const checks1: UBlock = {
  id: 'checks1',
  initialData: { data: '', type: 'checks' },
}

const radio1: UBlock = {
  id: 'radio1',
  initialData: { data: '', type: 'radio' },
}

export const InputEditing = T(input1)
export const TextAreaEditing = T(text1)
export const RadioEditing = T(radio1)
export const ChecksEditing = T(checks1)

export default {
  title: 'UForms/UFormBlock',
}
