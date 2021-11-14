import katex from 'katex'
import { str } from '../../../utils/types'

export function renderTex(tex: str): str {
  return katex.renderToString(tex || '\\blue{write \\ TeX}', { throwOnError: false })
}
