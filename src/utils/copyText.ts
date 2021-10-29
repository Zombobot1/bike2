import { str } from './types'

export function copyText(text: str) {
  if (!navigator.clipboard) return fallbackCopyTextToClipboard(text)
  navigator.clipboard.writeText(text).catch(console.error)
}

function fallbackCopyTextToClipboard(text: str) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}
