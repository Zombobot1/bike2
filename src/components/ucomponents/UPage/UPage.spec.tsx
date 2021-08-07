import { UPageS } from './UPage.stories'
import { startServer } from '../../../api/fapi'
import { api } from '../../../api/api'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { configure } from '@testing-library/react'
import { getElementError } from '../../../utils/testUtils'

describe('UPage', () => {
  it('Adds new block using factory', async () => {
    const spy = jest.spyOn(api, 'patchStrBlock')
    render(<UPageS.CreatesBlocks />)

    const input = await waitFor(() => screen.getByRole('textbox'))
    userEvent.type(input, '/')

    await waitFor(() => expect(spy).toHaveBeenCalledWith('page1', { data: JSON.stringify(['id']) }))
    expect(screen.getAllByRole('textbox').length).toEqual(2)
    spy.mockRestore()
  })

  it('Adds new block using another block', async () => {
    render(<UPageS.CreatesBlocks />)

    const input = await waitFor(() => screen.getByRole('textbox'))
    userEvent.type(input, '/{enter}')

    const spy = jest.spyOn(api, 'patchStrBlock')
    await waitFor(() => expect(spy).toHaveBeenCalledWith('page1', { data: JSON.stringify(['id', 'id']) }))
    expect(screen.getAllByRole('textbox').length).toEqual(3)
    spy.mockRestore()
  })

  it('Deletes blocks', async () => {
    render(<UPageS.DeletesBlocks />)

    const input = await waitFor(() => screen.getByText('d'))
    userEvent.type(input, '{backspace}')
    const spy = jest.spyOn(api, 'patchStrBlock')
    userEvent.type(input, '{backspace}')

    await waitFor(() => expect(spy).toHaveBeenCalledWith('page2', { data: JSON.stringify([]) }))
    expect(screen.getAllByRole('textbox').length).toEqual(1)
    spy.mockRestore()
  })
})

configure({ getElementError })
beforeAll(startServer)
