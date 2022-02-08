import { Box } from '@mui/system'
import { useRef } from 'react'
import { f } from '../../../../utils/types'
import { UTextOptions } from './UTextOptions'

const T = (type: 'tex' | 'link' | 'options') => () => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <Box width={500} ref={ref} sx={{ position: 'relative' }}>
      <UTextOptions
        textRef={ref}
        alwaysShow={true}
        linkEditorPs={{
          activeLink: { x: 0, b: 0, address: '' },
          isActive: type === 'link',
          onLinkKeyDown: f,
          saveLink: f,
          toggleLink: f,
          updateLink: f,
        }}
        texEditorPs={{
          activeTex: { x: 0, b: 0, id: '', tex: '' },
          isActive: type === 'tex',
          readonly: false,
          saveTex: f,
          toggleTex: f,
          updateTex: f,
        }}
      />
    </Box>
  )
}

export const Styles = T('options')
export const Link = T('link')
export const Tex = T('tex')

export default {
  title: 'Editing/UTextOptions',
}
