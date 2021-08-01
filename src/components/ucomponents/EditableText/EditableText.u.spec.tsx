import * as React from 'react'
import { mount } from '@cypress/react'
import { UTextS } from './EditableText.stories'
import {api} from '../../../api/api'

const text = 'div[class*="EditableText"]'

describe('Editable text unit', () => {
  it('Becomes readonly', () => {
    cy.stub(api, 'getStrBlock').returns(Promise.resolve({data: '', type: 'TEXT'}))
    mount(<UTextS.ReadOnlyText />)

    cy.get(text).should('have.attr', 'disabled')
    cy.get(text).should('have.attr', 'contenteditable', 'false')
  })
})
