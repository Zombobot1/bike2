import { Box } from '@material-ui/core'
import { UComponent } from '../UComponent'

function Template(props: UComponent) {
  return (
    <Box sx={{ width: 500 }}>
      <UComponent {...props} />
    </Box>
  )
}

export const EditsText = () => <Template initialData="initial data" initialType={'TEXT'} />
export const ChangesComponents = () => <Template initialData="" initialType={'TEXT'} />
