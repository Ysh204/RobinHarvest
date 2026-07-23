'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useChainStatus } from '@/hooks/use-chain-status'

/**
 * Compact live chain indicator: block height + connection health.
 * Rendered in the navbar on md+ screens.
 */
export function WalletStatus() {
  const { blockNumber, isStalled } = useChainStatus()

  if (blockNumber === undefined) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Badge variant="outline" className="tabular hidden gap-1.5 md:inline-flex" />}
      >
        <span
          aria-hidden
          className={
            isStalled ? 'size-1.5 rounded-full bg-warning' : 'size-1.5 rounded-full bg-primary'
          }
        />
        <span className="sr-only">{isStalled ? 'Connection degraded, ' : 'Live, '}</span>
        {blockNumber.toString()}
      </TooltipTrigger>
      <TooltipContent>
        {isStalled
          ? 'No new blocks received recently — RPC connection may be degraded.'
          : 'Latest Robinhood Chain block'}
      </TooltipContent>
    </Tooltip>
  )
}
