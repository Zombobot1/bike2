import { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface FetchData {
  children: ReactNode
}

export function FetchData({ children }: FetchData) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div>
          There was an error!
          <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
        </div>
      )}
    >
      <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
    </ErrorBoundary>
  )
}
