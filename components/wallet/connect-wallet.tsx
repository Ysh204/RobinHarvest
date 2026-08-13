'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AlertTriangle, ChevronDown, Loader2, Wallet } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { shortenAddress } from '@/utils/address'
import { cn } from '@/lib/utils'
import { fadeVariants } from '@/lib/constants/motion'

/**
 * Wallet connect control with animated state transitions.
 */
export function ConnectWallet({ className }: { className?: string }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!ready) {
          return (
            <Button variant="outline" disabled aria-hidden className={cn('min-w-32 gap-2', className)}>
              <Loader2 className="size-3.5 animate-spin" />
              <span className="sr-only">Loading wallet</span>
            </Button>
          )
        }

        return (
          <AnimatePresence mode="wait">
            {!connected ? (
              <motion.div key="disconnected" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
                <Button onClick={openConnectModal} className={cn('gap-2', className)}>
                  <Wallet data-icon="inline-start" />
                  Connect Wallet
                </Button>
              </motion.div>
            ) : chain.unsupported ? (
              <motion.div key="wrong-network" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
                <Button variant="destructive" onClick={openChainModal} className="gap-2">
                  <AlertTriangle data-icon="inline-start" />
                  Wrong Network
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="connected"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" onClick={openAccountModal} className={cn('tabular gap-2', className)}>
                  <motion.span
                    aria-hidden
                    className="size-2 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {account.ensName ?? shortenAddress(account.address)}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )
      }}
    </ConnectButton.Custom>
  )
}
