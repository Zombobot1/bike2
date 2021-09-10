import { FetchingState } from './FetchingState'

const T = FetchingState

const message = `storage/cannot-slice-blob
Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.`
const data1 = { message }

export const SpinsWhenLoading = T

export const ShowsMessageOnFail = () => T(data1)

export default {
  title: 'Utils/FetchingState',
}
