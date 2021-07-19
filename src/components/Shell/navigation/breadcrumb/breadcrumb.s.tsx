import { Breadcrumb } from './breadcrumb'
import { Box, Button } from '@material-ui/core'
import { COLORS } from '../../../../theme'
import { MemoryRouter, useHistory } from 'react-router-dom'
import { useUserPosition } from './user-position-provider'
import { useMount } from '../../../../utils/hooks-utils'

function Template_() {
  const { setPath } = useUserPosition()
  useMount(() => setPath([{ name: 'Deck name' }]))
  const history = useHistory()
  return (
    <Box sx={{ maxWidth: 400, backgroundColor: COLORS.light, padding: 2 }}>
      <Breadcrumb />
      <Button
        onClick={() => {
          history.push('/study/Deck name')
          setPath([{ name: 'Deck name' }])
        }}
      >
        Go to deck
      </Button>
    </Box>
  )
}

const Template = () => (
  <MemoryRouter initialEntries={['/study/Deck name']}>
    <Template_ />
  </MemoryRouter>
)

export const GoToDeck = () => <Template />
export const GoToStudy = () => <Template />
