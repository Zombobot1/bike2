export const a = 1
// describe('UPage', () => {
//   it('Factory preserves focus when adding empty blocks', async () => {
//     render(<UPageS.CreatesBlocks />)

//     let input = screen.getByRole('textbox')
//     userEvent.type(input, '{enter}')

//     input = screen.getAllByRole('textbox')[1]

//     expect(input).toHaveFocus()
//     expect(screen.getAllByRole('textbox').length).toEqual(2)
//   })
//   // it('Adds new block using factory', async () => {
//   //   const spy = jest.spyOn(api, 'patchUBlock')
//   //   render(<UPageS.CreatesBlocks />)

//   //   const input = screen.getByRole('textbox')
//   //   userEvent.type(input, '/')
//   //   expect(input).toHaveFocus()
//   //   expect(screen.getAllByRole('textbox').length).toEqual(2)
//   //   // await waitFor(() => expect(spy).toHaveBeenCalledWith('page1', { data: JSON.stringify(['id']) }))
//   //   // expect(screen.getAllByRole('textbox').length).toEqual(2)
//   //   spy.mockRestore()
//   // })

//   // it('Adds new block using another block', async () => {
//   //   render(<UPageS.CreatesBlocks />)

//   //   const input = await waitFor(() => screen.getByRole('textbox'))
//   //   userEvent.type(input, '/{enter}')

//   //   const spy = jest.spyOn(api, 'patchUBlock')
//   //   await waitFor(() => expect(spy).toHaveBeenCalledWith('page1', { data: JSON.stringify(['id', 'id']) }))
//   //   expect(screen.getAllByRole('textbox').length).toEqual(3)
//   //   spy.mockRestore()
//   // })

//   // it('Deletes blocks', async () => {
//   //   render(<UPageS.DeletesBlocks />)

//   //   const input = await waitFor(() => screen.getByText('d'))
//   //   userEvent.type(input, '{backspace}')
//   //   const spy = jest.spyOn(api, 'patchUBlock')
//   //   userEvent.type(input, '{backspace}')

//   //   await waitFor(() => expect(spy).toHaveBeenCalledWith('page2', { data: JSON.stringify([]) }))
//   //   expect(screen.getAllByRole('textbox').length).toEqual(1)
//   //   spy.mockRestore()
//   // })
// })

// configure({ getElementError })
// beforeAll(startServer)
