'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AlertTriangle, ChevronDown, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { shortenAddress } from '@/utils/address'

/**
 * Wallet connect control built on RainbowKit's headless ConnectButton.Custom
 * so the trigger uses the app's own Button primitive and tokens.
 */
export function ConnectWallet({ className }: { className?: string }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!ready) {
          return <Button variant="outline" disabled aria-hidden className="min-w-32" />
        }

        if (!connected) {
          return (
            <Button onClick={openConnectModal} className={className}>
              <Wallet data-icon="inline-start" />
              Connect Wallet
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button variant="destructive" onClick={openChainModal}>
              <AlertTriangle data-icon="inline-start" />
              Wrong Network
            </Button>
          )
        }

        return (
          <Button variant="outline" onClick={openAccountModal} className="tabular">
            <span aria-hidden className="size-2 rounded-full bg-primary" />
            {account.ensName ?? shortenAddress(account.address)}
            <ChevronDown data-icon="inline-end" />
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
