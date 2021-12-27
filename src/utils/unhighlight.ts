import { str } from './types'

export function unhighlight(html: str): str {
  return new DOMParser().parseFromString(html, 'text/html').documentElement.textContent || ''
}
