import { Callout } from './Callout/Callout'
import { Code } from './Code/Code'
import { Quote } from './Quote/Quote'
import { UText as UTextP } from './types' // P for easier navigation
import { UText_ } from './UText_'

export function UText(ps: UTextP) {
  const { type } = ps

  return (
    <>
      {type === 'text' && <UParagraph {...ps} />}
      {type === 'heading-0' && <UHeading1 {...ps} />}
      {type === 'heading-1' && <UHeading1 {...ps} />}
      {type === 'heading-2' && <UHeading2 {...ps} />}
      {type === 'heading-3' && <UHeading3 {...ps} />}
      {type === 'quote' && <Quote {...ps} />}
      {type === 'callout' && <Callout {...ps} />}
      {type === 'code' && <Code {...ps} />}
    </>
  )
}

export function UParagraph(ps: UTextP) {
  return <UText_ {...ps} component="pre" placeholder="Type '/' for commands" hidePlaceholder={true} />
}

export const UHeading1 = (props: UTextP) => <UText_ {...props} component="h2" placeholder="Heading 1" />
export const UHeading2 = (props: UTextP) => <UText_ {...props} component="h3" placeholder="Heading 2" />
export const UHeading3 = (props: UTextP) => <UText_ {...props} component="h4" placeholder="Heading 3" />
