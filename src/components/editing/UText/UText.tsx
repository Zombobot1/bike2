import { alpha, Box, styled } from '@mui/material'
import { useDrop } from 'react-dnd'
import { Fn } from '../../../utils/types'
import { DragType, isUListBlock } from '../types'
import { Callout } from './Callout/Callout'
import { Code } from './Code/Code'
import { Quote } from './Quote/Quote'
import { UText as UTextP } from './types' // P for easier navigation
import { UList } from './UList/UList'
import { UText_ } from './UText_'

export function UText(props: UTextP) {
  const { type } = props
  return (
    <>
      {type === 'text' && <UParagraph {...props} />}
      {type === 'heading-0' && <UHeading1 {...props} />}
      {type === 'heading-1' && <UHeading1 {...props} />}
      {type === 'heading-2' && <UHeading2 {...props} />}
      {type === 'heading-3' && <UHeading3 {...props} />}
      {type === 'quote' && <Quote {...props} />}
      {type === 'callout' && <Callout {...props} />}
      {type === 'code' && <Code {...props} />}
      {isUListBlock(type) && <UList {...props} />}
    </>
  )
}

export function UParagraph(props: UTextP) {
  return <UText_ {...props} component="pre" placeholder="Type '/' for commands" hidePlaceholder={true} />
}

export interface UPageTitle extends UTextP {
  onDrop: Fn
}
export function UPageTitle(ps: UPageTitle) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragType.ublock,
      drop: ps.onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [ps.onDrop],
  )
  return (
    <Box ref={drop} sx={{ position: 'relative' }}>
      <UText_ {...ps} component="h1" placeholder="Untitled" hideMenus={true} />
      {isOver && <Dropbox />}
    </Box>
  )
}

const Dropbox = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  bottom: 0,
  right: 0,
  left: 0,
  height: '1rem',
  backgroundColor: alpha(theme.palette.info.main, 0.25),
  marginTop: '0.25rem',
}))

export const UHeading1 = (props: UTextP) => <UText_ {...props} component="h2" placeholder="Heading 1" />
export const UHeading2 = (props: UTextP) => <UText_ {...props} component="h3" placeholder="Heading 2" />
export const UHeading3 = (props: UTextP) => <UText_ {...props} component="h4" placeholder="Heading 3" />
