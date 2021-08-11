export const a = 1

// describe('UAudioFile', () => {
//   it('Shows audio', async () => {
//     render(<UAudioFileS.ShowsAudio />)
//     const play = await waitFor(() => screen.getByRole('button', { name: 'play' }))
//     expect(play).toBeVisible()
//     userEvent.click(play)
//     const stop = await waitFor(() => screen.getByRole('button', { name: 'stop' }))
//     expect(stop).toBeVisible()
//   })
//   it('Deletes audio', async () => {
//     render(<UAudioFileS.DeletesAudio />)
//     const delete_ = await waitFor(() => screen.getByRole('button', { name: 'delete' }))
//     userEvent.click(delete_)
//     const stop = await waitFor(() => screen.getByLabelText('Drop audio here, or click to select'))
//     expect(stop).toBeInTheDocument()
//   })

//   it('Forbids removal if readonly', async () => {
//     render(<UAudioFileS.ReadOnly />)
//     const play = await waitFor(() => screen.getByRole('button', { name: 'play' }))
//     expect(play).toBeVisible()
//     expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument()
//   })

//   it('Uploads audio', async () => {
//     global.URL.createObjectURL = jest.fn(() => '/audio.mp3')
//     const m = jest.spyOn(api, 'uploadFile') // form data doesn't exist in node -> no file name
//     m.mockReturnValueOnce(Promise.resolve({ data: '/audio.mp3' }))
//     const file = new File(['hello'], 'audio.mp3', { type: 'audio/mp3' })

//     render(<UAudioFileS.UploadsAudio />)
//     const input = await waitFor(() => screen.getByLabelText('Drop audio here, or click to select'))
//     userEvent.upload(input, file)
//     const play = await waitFor(() => screen.getByRole('button', { name: 'play' }))
//     expect(play).toBeVisible()

//     m.mockRestore()
//   })
// })

// configure({ getElementError })
// beforeAll(startServer)
