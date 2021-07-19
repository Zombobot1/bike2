import { Fn, fn } from '../../../utils/types'
import { useEventListeners } from './use-event-listener'

function onGesture({ onSwipeLeft = fn, onSwipeRight = fn, onSwipeDown = fn, onSwipeUp = fn, onTap = fn }) {
  let touchstartX = 0
  let touchstartY = 0
  let touchendX = 0
  let touchendY = 0

  function handleGesture() {
    if (touchendX < touchstartX) onSwipeLeft()
    else if (touchendX > touchstartX) onSwipeRight()

    if (touchendY < touchstartY) onSwipeUp()
    else if (touchendY > touchstartY) onSwipeDown()

    if (touchendY === touchstartY) onTap()
  }

  function onTouchStart(event: TouchEvent) {
    touchstartX = event.changedTouches[0].screenX
    touchstartY = event.changedTouches[0].screenY
  }

  function onTouchEnd(event: TouchEvent) {
    touchendX = event.changedTouches[0].screenX
    touchendY = event.changedTouches[0].screenY
    handleGesture()
  }

  return {
    onTouchStart,
    onTouchEnd,
  }
}

export function useSwipeRight(on: Fn, addOneMoreTime = false) {
  const { onTouchStart, onTouchEnd } = onGesture({ onSwipeRight: on })
  const ref = useEventListeners(
    [
      { event: 'touchstart', handler: onTouchStart },
      { event: 'touchend', handler: onTouchEnd },
    ],
    addOneMoreTime,
  )
  return { ref }
}
