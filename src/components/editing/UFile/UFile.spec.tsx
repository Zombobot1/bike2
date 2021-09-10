export const a = 1

// describe('UFile', () => {
//   it('Shows uploaded file', async () => {
//     render(<UFileS.ShowsFile />)
//     const file = await waitFor(() => screen.getByText('complex--name.pdf'))
//     expect(file).toBeVisible()
//   })
//   it('Deletes file', async () => {
//     const spy = jest.spyOn(api, 'deleteFile')

//     render(<UFileS.ShowsFile />)

//     const btn = await waitFor(() => screen.getByRole('button'))
//     userEvent.click(btn)

//     await waitFor(() => expect(spy).toHaveBeenCalledWith('complex--name--uuid.pdf'))
//     spy.mockRestore()
//   })

//   it('Forbids removal if readonly', async () => {
//     render(<UFileS.ReadOnly />)
//     await waitFor(() => screen.getByText('complex--name.pdf'))
//     expect(screen.queryByRole('button')).not.toBeInTheDocument()
//   })

//   it('Uploads file', async () => {
//     const file = new File(['hello'], 'complex--name.pdf', { type: 'image/png' })
//     const spy = jest.spyOn(api, 'uploadFile')

//     render(<UFileS.UploadsFile />)

//     const input = await waitFor(() => screen.getByLabelText('Drop file here, or click to select'))
//     userEvent.upload(input, file)

//     await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
//     await waitFor(() => screen.getByText('complex--name.pdf'))
//     spy.mockRestore()
//   })
// })

// configure({ getElementError })
// beforeAll(startServer)
