import { Workbox } from 'workbox-window'

export function registerServiceWorker(onUpdate: () => void, onInit: () => void) {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return

  const wb = new Workbox('service-worker.js')

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) onUpdate()
  })

  wb.register().then(onInit)
}
