import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { mockUblock, UBlock } from '../../editing/UBlock/UBlock'
import { useUForm } from '../useUForm'

const T = (props: UBlock) => {
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
  ...mockUblock,
  id: 'input1',
  initialData: { data: '', type: 'short-answer' },
}

const text1: UBlock = {
  ...mockUblock,
  id: 'textarea1',
  initialData: { data: '', type: 'long-answer' },
}

const checks1: UBlock = {
  ...mockUblock,
  id: 'checks1',
  initialData: { data: '', type: 'multiple-choice' },
}

const radio1: UBlock = {
  ...mockUblock,
  id: 'radio1',
  initialData: { data: '', type: 'single-choice' },
}

export const InputEditing = () => T(input1)
export const TextAreaEditing = () => T(text1)
export const RadioEditing = () => T(radio1)
export const ChecksEditing = () => T(checks1)

export default {
  title: 'UForms/UFormBlock',
}
