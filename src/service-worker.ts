/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope

clientsClaim()

self.skipWaiting()

precacheAndRoute(self.__WB_MANIFEST)

// CRA: Set up App Shell-style routing, so that all navigation requests are fulfilled with your index.html shell.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(({ request, url }: { request: Request; url: URL }) => {
  if (request.mode !== 'navigate') return false // If this isn't a navigation, skip.
  if (url.pathname.startsWith('/_')) return false // If this is a URL that starts with /_, skip.
  if (url.pathname.match(fileExtensionRegexp)) return false // If this looks like a URL for a resource, because it contains a file extension, skip.
  return true
}, createHandlerBoundToURL('/index.html'))

// https://developers.google.com/web/tools/workbox/guides/common-recipes#caching_images
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
)

// @see https://developers.google.com/web/tools/workbox/guides/common-recipes#cache_css_and_javascript_files
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
)
