import { useUFormSubmit } from './useUForm'
import { Stack, Button, styled, Box } from '@material-ui/core'
import { UForm } from './UForm'
import { UBlockB } from '../editing/types'

function T(props: UBlockB) {
  const { submit } = useUFormSubmit()

  return (
    <Box sx={{ width: '400px' }}>
      <UForm {...props} />
      <Panel direction="row" justifyContent="flex-end">
        <Button onClick={() => submit(() => ({}))} data-cy="submit-btn">
          Submit
        </Button>
      </Panel>
    </Box>
  )
}

const Panel = styled(Stack)({
  marginTop: 20,
})

const emptyQ: UBlockB = {
  _id: 'emptyQ',
}

const withoutAnswer: UBlockB = {
  _id: 'withoutAnswer',
  readonly: true,
}

export const SubmittingAnswer = () => <T {...withoutAnswer} /> // check validation error disappearance and feedback and readOnlyAfterSubmit
export const EmptyQuestion = () => <T {...emptyQ} /> // check no factory is shown

// export const Composite = () => <T {...composite} />

export default {
  title: 'UForms/UForm',
  component: UForm,
}
