import { isUListComponent } from '../types'
import { Callout } from './Callout/Callout'
import { Code } from './Code/Code'
import { Quote } from './Quote/Quote'
import { UText as UTextP } from './types'
import { UList } from './UList/UList'
import { UText_ } from './UText_'

export function UText(props: UTextP) {
  const { type } = props
  return (
    <>
      {type === 'text' && <UParagraph {...props} />}
      {type === 'heading0' && <UHeading1 {...props} />}
      {type === 'heading1' && <UHeading1 {...props} />}
      {type === 'heading2' && <UHeading2 {...props} />}
      {type === 'heading3' && <UHeading3 {...props} />}
      {type === 'quote' && <Quote {...props} />}
      {type === 'callout' && <Callout {...props} />}
      {type === 'code' && <Code {...props} />}
      {isUListComponent(type) && <UList {...props} />}
    </>
  )
}

export function UParagraph(props: UTextP) {
  return (
    <UText_
      {...props}
      component="pre"
      placeholder={props.placeholder || "Type '/' for commands"}
      alwaysShowPlaceholder={Boolean(props.placeholder)}
    />
  )
}

export const UHeading0 = (props: UTextP) => <UText_ {...props} component="h1" placeholder="Untitled" />

export const UHeading1 = (props: UTextP) => <UText_ {...props} component="h2" placeholder="Heading 1" />
export const UHeading2 = (props: UTextP) => <UText_ {...props} component="h3" placeholder="Heading 2" />
export const UHeading3 = (props: UTextP) => <UText_ {...props} component="h4" placeholder="Heading 3" />
