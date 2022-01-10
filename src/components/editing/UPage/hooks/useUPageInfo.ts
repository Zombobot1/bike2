import { atom } from 'jotai'
import { useAtomTrigger } from '../../../utils/hooks/useAtomTrigger'

const openTOCTriggerA = atom(0)
const triggerFullWidthA = atom(0)

// will include security info
export function useUPageInfo() {
  const [openTOCTrigger, triggerOpenTOC] = useAtomTrigger(openTOCTriggerA)
  const [fullWidthTrigger, triggerFullWidth] = useAtomTrigger(triggerFullWidthA)
  const [turnOffTOCTrigger, triggerTurnOffTOC] = useAtomTrigger(triggerFullWidthA)

  return { fullWidthTrigger, triggerOpenTOC, openTOCTrigger, triggerFullWidth, turnOffTOCTrigger, triggerTurnOffTOC }
}
