'use client'

import { useEffect, useState } from 'react'
import { useAccount, useBlockNumber } from 'wagmi'
import { ROBINHOOD_CHAIN_ID } from '@/config/chain'
import { BLOCK_STALL_TIMEOUT_MS } from '@/lib/constants'

export interface ChainStatus {
  isConnected: boolean
  address: `0x${string}` | undefined
  /** Connected to a chain other than Robinhood Chain. */
  isWrongNetwork: boolean
  blockNumber: bigint | undefined
  /** No new block within the stall timeout — degraded RPC connection. */
  isStalled: boolean
}

export function useChainStatus(): ChainStatus {
  const { address, isConnected, chainId } = useAccount()
  const { data: blockNumber, dataUpdatedAt } = useBlockNumber({
    watch: true,
    chainId: ROBINHOOD_CHAIN_ID,
  })
  const [isStalled, setIsStalled] = useState(false)

  useEffect(() => {
    if (!dataUpdatedAt) return
    setIsStalled(false)
    const timer = window.setTimeout(() => setIsStalled(true), BLOCK_STALL_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [dataUpdatedAt])

  return {
    isConnected,
    address,
    isWrongNetwork: isConnected && chainId !== ROBINHOOD_CHAIN_ID,
    blockNumber,
    isStalled,
  }
}
