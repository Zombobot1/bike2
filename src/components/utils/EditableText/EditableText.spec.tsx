import { got, utext, show, saw, expectCSSPlaceholder } from '../../../utils/testUtils'
import * as EditableText from './EditableText.stories'

const etext = () => got('etext')

describe('EditableText', () => {
  it('edits text', () => {
    show(EditableText.EditsText)

    etext().click().type('{leftarrow}{backspace}s').blur()
    saw('test')

    etext().click().type('{selectall}{backspace}')
    expectCSSPlaceholder('Untitled')
  })
})
