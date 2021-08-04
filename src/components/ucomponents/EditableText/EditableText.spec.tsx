import * as React from 'react'
import { UTextS } from './EditableText.stories'
import { startServer } from '../../../api/fake-api'
import { api } from '../../../api/api'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { configure } from '@testing-library/react'
import { getElementError } from '../../../utils/testUtils'

describe('Editable text', () => {
  it('Gets data from server, edits it, sends it back', async () => {
    const spy = jest.spyOn(api, 'patchStrBlock')
    render(<UTextS.EditsText />)

    const input = await waitFor(() => screen.getByText('initial data'))
    userEvent.type(input, ' 1')
    input.blur()

    await waitFor(() => expect(spy).toHaveBeenCalledWith('data1', { data: 'initial data 1' }))
    spy.mockRestore()
  })

  it('Creates itself if id is empty, changes component', async () => {
    const spy = jest.spyOn(api, 'postStrBlock')
    render(<UTextS.CreatesItself />)
    await waitFor(() => expect(spy).toHaveBeenCalledWith({ type: 'TEXT' }))
    spy.mockRestore()
  })

  it('Changes component', async () => {
    const spy = jest.spyOn(api, 'patchStrBlock')

    render(<UTextS.ChangesComponents />)

    const input = await waitFor(() => screen.getByRole('textbox'))
    userEvent.type(input, '/heading1 ')

    await waitFor(() => expect(spy).toHaveBeenCalledWith('data4', { type: 'HEADING1' }))
    spy.mockRestore()
  })

  it('Is disabled when is readonly', async () => {
    render(<UTextS.ReadOnlyText />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('disabled')
  })
})

configure({ getElementError })
beforeAll(startServer)
