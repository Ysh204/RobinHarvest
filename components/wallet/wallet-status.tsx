'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useChainStatus } from '@/hooks/use-chain-status'

export function WalletStatus() {
  const { blockNumber, isStalled } = useChainStatus()

  if (blockNumber === undefined) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Badge variant="outline" className="tabular hidden gap-1.5 md:inline-flex rounded-lg" />}
      >
        <motion.span
          aria-hidden
          className={isStalled ? 'size-1.5 rounded-full bg-warning' : 'size-1.5 rounded-full bg-primary'}
          animate={isStalled ? undefined : { opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
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
