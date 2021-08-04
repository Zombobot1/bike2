export function getElementError(message: string | null) {
  const error = new Error(message || '')
  error.name = 'TestingLibraryElementError'
  error.stack = ''
  return error
}
