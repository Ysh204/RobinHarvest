import { SearchX } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export default function NotFound() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            This page doesn&apos;t exist — the vault address may be invalid or the link outdated.
          </EmptyDescription>
        </EmptyHeader>
        <Button render={<Link href="/" />} nativeButton={false}>
          Back to Dashboard
        </Button>
      </Empty>
    </div>
  )
}
