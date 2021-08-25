import { useEffect, useState } from 'react'

export function useIsPageVisible() {
  const isDocumentHidden = (): boolean => !document['hidden']
  const [isVisible, setIsVisible] = useState(isDocumentHidden())
  const onVisibilityChange = () => setIsVisible(isDocumentHidden())

  useEffect(() => {
    const visibilityChange = 'visibilitychange'
    document.addEventListener(visibilityChange, onVisibilityChange, false)
    return () => document.removeEventListener(visibilityChange, onVisibilityChange)
  }, [])

  return isVisible
}
