import { useMount } from '../../../utils/hooks/hooks'
import { UPageState } from '../UPageState/UPageState'

export function useUserKeyDownForSelection(changer: UPageState) {
  useMount(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault() // otherwise new block will contain div with br
        e.stopImmediatePropagation()
        changer.onSelectionEnter()
      } else if (e.key === 'Backspace') changer.deleteSelected()
      else if ((e.metaKey || e.ctrlKey) && e.key === 'c') navigator.clipboard.writeText(changer.getSelectedData())
      else if ((e.metaKey || e.ctrlKey) && e.key === 'a') changer.selectAll()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })
}
