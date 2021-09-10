import { Box } from '@material-ui/system'
import { useState } from 'react'
import { MemoryRouter } from 'react-router'
import { useUser } from 'reactfire'
import { safe } from '../../../../utils/utils'
import { useWorkspace } from '../workspace'
import { NavBar } from './NavBar'

function T() {
  const { data } = useUser()
  const workspace = useWorkspace(data?.uid || '')
  const openS = useState(false)
  return (
    <MemoryRouter initialEntries={['/study']}>
      <Box
        sx={{
          width: '20rem',
          height: '100%',
          '.MuiPaper-root': {
            transform: 'translateX(0) !important',
          },
        }}
      >
        <NavBar user={safe(data)} workspace={workspace} isNavBarOpenS={openS} />
      </Box>
    </MemoryRouter>
  )
}

// check sub-page 1 is visible
export const FoldsAndUnfolds = T

export default {
  title: 'Utils/NavBar',
}
