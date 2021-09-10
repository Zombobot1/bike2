import { UBlockB } from '../editing/types'
import { UBlocksSet } from '../editing/UPage/UBlocksSet/UBlocksSet'

// tests have an intermediate state: waiting for feedback if there are some manually assessable questions -> student is transferred to a page where teacher can leave feedback
// exercises & tests can be redone when feedback was provided, on feedback errors automatically turned into cards and placed in individual decks

export function UForm(props: UBlockB) {
  // return <UBlocksSet {...props} oneBlockOnly={true} factoryPlaceholder="Type /checks or /input etc." />
  return <p>{props.id}</p>
}
