import { str } from '../../../utils/types'
import { replaceAllCodeToTex } from '../../utils/Selection/htmlAsStr'
import { TexMapRef } from '../types'

export const sanitize = (text: str, mapRef: TexMapRef) =>
  replaceAllCodeToTex(text, mapRef.current).replaceAll(/<\/?strong>/gm, '')
