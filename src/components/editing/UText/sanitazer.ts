import { str } from '../../../utils/types'
import { replaceAllCodeToTex } from '../../utils/Selection/htmlAsStr'
import { TexMapRef } from '../types'

export function sanitize(text: str, mapRef: TexMapRef): str {
  const r = replaceAllCodeToTex(text, mapRef.current).replaceAll(/<\/?strong>/gm, '')
  if (r.trim().endsWith('</code>')) return r.trim()
  return r
}
