'use client'

import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AlertTriangle } from 'lucide-react'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            {error.message || 'An unexpected error occurred. Your funds are unaffected.'}
          </EmptyDescription>
        </EmptyHeader>
        <Button onClick={reset}>
          <RefreshCcw data-icon="inline-start" />
          Try again
        </Button>
      </Empty>
    </div>
  )
}
