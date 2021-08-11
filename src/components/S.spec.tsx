import { mount } from '@cypress/react'

it('Button', () => {
  mount(<p>1</p>)
  expect(1).equal(1)
})
