import { mount } from '@cypress/react'
import React from 'react'
import { OuterShell } from '../components/Shell/Shell'
import { str } from './types'

// sometimes it is not possible to assign data-* attribute (e.g. Checkbox)
export const got = (selector: str, type: 'CY' | 'AL' = 'CY') =>
  cy.get(`[${type === 'CY' ? 'data-cy' : 'aria-label'}="${selector}"]`)
export const story = (Component: React.FC) =>
  mount(
    <OuterShell>
      <Component />
    </OuterShell>,
  )
