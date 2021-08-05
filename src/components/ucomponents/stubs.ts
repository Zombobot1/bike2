import { str } from '../../utils/types'
import { StrBlockGetDTO } from './types'
import hospitalMp3 from '../../content/hospital.mp3'

export const blocksS = new Map<str, StrBlockGetDTO>([
  ['data1', { type: 'TEXT', data: 'initial data' }],
  ['data4', { type: 'TEXT', data: '' }],
  ['file1', { type: 'FILE', data: '' }],
  ['file2', { type: 'FILE', data: 'http://uni.com/static/complex--name--uuid.pdf' }],
  ['audio1', { type: 'AUDIO', data: hospitalMp3 }],
  ['audio2', { type: 'AUDIO', data: '' }],
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blocksFileUploadS(body?: any) {
  if (body?.file?.name.includes('.mp3')) return hospitalMp3
  return 'http://uni.com/static/complex--name--uuid.pdf'
}
