import { ReactNode, Suspense } from 'react'
import { QueryErrorResetBoundary } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Btn } from './controls'

interface FetchData {
  children: ReactNode
}

export function FetchData({ children }: FetchData) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              There was an error! <Btn text="Try again" onClick={() => resetErrorBoundary()} />
              <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
            </div>
          )}
          onReset={reset}
        >
          <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
