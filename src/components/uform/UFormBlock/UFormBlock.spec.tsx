import { UFormBlockS } from './UFormBlock.stories'
import { startServer } from '../../../api/fapi'
import { api } from '../../../api/api'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { configure } from '@testing-library/react'
import { getElementError } from '../../../utils/testUtils'
import { qS } from '../../ucomponents/stubs'

describe('UFormBlock', () => {
  it('Edits input', async () => {
    render(<UFormBlockS.InputEditing />)

    const question = screen.getByRole('textbox', { name: 'question' })
    userEvent.type(question, 'question')
    question.blur()

    const answer = screen.getByRole('textbox', { name: 'correct answer' })
    userEvent.type(answer, 'answer')
    answer.blur()

    const spy = jest.spyOn(api, 'patchStrBlock')

    const explanation = screen.getByRole('textbox', { name: 'explanation' })
    userEvent.type(explanation, 'explanation')
    explanation.blur()

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith('input1', { data: qS(['answer'], 'explanation', [], 'question') }),
    )
    spy.mockRestore()
  })

  it('Edits text area', async () => {
    render(<UFormBlockS.TextAreaEditing />)

    const spy = jest.spyOn(api, 'patchStrBlock')

    const explanation = screen.getByRole('textbox', { name: 'explanation' })
    userEvent.type(explanation, 'explanation')
    explanation.blur()

    await waitFor(() => expect(spy).toHaveBeenCalledWith('textarea1', { data: qS([], 'explanation', [], '') }))
    spy.mockRestore()
  })

  it('Edits radio', async () => {
    render(<UFormBlockS.RadioEditing />)

    const options = screen.getAllByRole('textbox', { name: 'option' })
    userEvent.type(options[1], 'changed')
    options[1].blur()

    expect(screen.queryByText('Select correct answer')).toBeVisible()

    const spy = jest.spyOn(api, 'patchStrBlock')

    const optionTicks = screen.getAllByRole('radio', { name: 'option tick' })
    userEvent.click(optionTicks[1])

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith('radio1', {
        data: qS(['Option 2changed'], '', ['Option 1', 'Option 2changed'], ''),
      }),
    )

    expect(screen.queryByText('Select correct answer')).not.toBeInTheDocument()
    spy.mockRestore()
  })

  it('Change in option leads to change in answer', async () => {
    render(<UFormBlockS.RadioEditing />)

    const optionTicks = screen.getAllByRole('radio', { name: 'option tick' })
    userEvent.click(optionTicks[1])

    const spy = jest.spyOn(api, 'patchStrBlock')

    const options = screen.getAllByRole('textbox', { name: 'option' })
    userEvent.type(options[1], 'changed')
    options[1].blur()

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith('radio1', {
        data: qS(['Option 2changed'], '', ['Option 1', 'Option 2changed'], ''),
      }),
    )
    spy.mockRestore()
  })

  it('Creates new options', async () => {
    render(<UFormBlockS.ChecksEditing />)

    const spy = jest.spyOn(api, 'patchStrBlock')

    let options = screen.getAllByRole('textbox', { name: 'option' })
    expect(options.length).toEqual(2)

    const newOption = screen.getByRole('textbox', { name: 'new option' })
    userEvent.type(newOption, 'O')

    options = screen.getAllByRole('textbox', { name: 'option' })
    expect(options.length).toEqual(3)

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith('checks1', {
        data: qS([], '', ['Option 1', 'Option 2', 'O'], ''),
      }),
    )
    spy.mockRestore()
  })

  it('Deletes options', async () => {
    render(<UFormBlockS.ChecksEditing />)

    const spy = jest.spyOn(api, 'patchStrBlock')

    let options = screen.getAllByRole('textbox', { name: 'option' })
    expect(options.length).toEqual(2)

    userEvent.clear(options[1])
    options[1].blur()

    options = screen.getAllByRole('textbox', { name: 'option' })
    expect(options.length).toEqual(1)

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith('checks1', {
        data: qS([], '', ['Option 1'], ''),
      }),
    )
    spy.mockRestore()
  })
})

configure({ getElementError })
beforeAll(startServer)
