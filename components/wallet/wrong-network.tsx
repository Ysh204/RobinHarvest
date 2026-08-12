'use client'

import { AlertTriangle } from 'lucide-react'
import { useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { ROBINHOOD_CHAIN_ID } from '@/config/chain'
import { useChainStatus } from '@/hooks/use-chain-status'

/**
 * Global modal shown whenever the connected wallet is on the wrong chain.
 * Non-dismissable by design: every contract interaction targets 46630.
 */
export function WrongNetwork() {
  const { isWrongNetwork } = useChainStatus()
  const { switchChain, isPending } = useSwitchChain()

  return (
    <Dialog open={isWrongNetwork}>
      {/* Controlled `open` with no onOpenChange: cannot be dismissed by Esc or outside click. */}
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="bg-warning/10 text-warning flex size-12 items-center justify-center rounded-xl">
            <AlertTriangle className="size-6" aria-hidden />
          </div>
          <DialogTitle>Wrong network</DialogTitle>
          <DialogDescription>
            Robin Harvest runs on Robinhood Chain (ID {ROBINHOOD_CHAIN_ID}). Switch your wallet&apos;s network to
            continue.
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => switchChain({ chainId: ROBINHOOD_CHAIN_ID })}
          disabled={isPending}
          className="w-full"
        >
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Confirm in wallet…' : 'Switch to Robinhood Chain'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
