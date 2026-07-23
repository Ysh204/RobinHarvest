'use client'

import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useBlockNumber } from 'wagmi'
import { ROBINHOOD_CHAIN_ID } from '@/config/chain'

/**
 * Invalidates the given query key whenever a new block is produced.
 * Queries keep previous data during refetch so the UI never flickers.
 */
export function useInvalidateOnBlock(queryKey: QueryKey | undefined) {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: ROBINHOOD_CHAIN_ID,
  })

  useEffect(() => {
    if (!queryKey || blockNumber === undefined) return
    void queryClient.invalidateQueries({ queryKey })
  }, [blockNumber, queryClient, queryKey])
}
