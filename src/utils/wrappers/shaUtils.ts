import { sha256 } from 'js-sha256'
import { str } from '../types'

export const getSha = (bytes: Uint8Array): str => sha256(bytes).slice(0, 6)
