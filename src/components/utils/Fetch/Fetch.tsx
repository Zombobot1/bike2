import { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FetchingState } from './FetchingState/FetchingState'

interface Fetch {
  children: ReactNode
}

export function Fetch({ children }: Fetch) {
  return (
    <ErrorBoundary fallbackRender={({ error }) => <FetchingState message={error.message} />}>
      <Suspense fallback={<FetchingState />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
