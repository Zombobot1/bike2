import { startServer } from '../../../../api/fapi'
import { api } from '../../../../api/api'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { configure } from '@testing-library/react'
import { getElementError } from '../../../../utils/testUtils'
import { UImageFileS } from './UImageFile.stories'

describe('UImageFile', () => {
  it('Shows image', async () => {
    render(<UImageFileS.ShowsImage />)
    const img = await waitFor(() => screen.getByRole('img'))
    expect(img).toBeVisible()
  })
  it('Uploads image', async () => {
    global.URL.createObjectURL = jest.fn(() => '/audio.mp3')
    const m = jest.spyOn(api, 'uploadFile') // form data doesn't exist in node -> no file name
    m.mockReturnValueOnce(Promise.resolve({ data: '/audio.mp3' }))
    const file = new File(['hello'], 'audio.mp3', { type: 'audio/mp3' })

    render(<UImageFileS.UploadsImage />)
    const input = await waitFor(() => screen.getByLabelText('Drop image here, or click to select'))
    userEvent.upload(input, file)
    const img = await waitFor(() => screen.getByRole('img'))
    expect(img).toBeVisible()

    m.mockRestore()
  })
})

configure({ getElementError })
beforeAll(startServer)
