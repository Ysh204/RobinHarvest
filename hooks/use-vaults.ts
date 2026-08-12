'use client'

import { useMemo } from 'react'
import { formatUnits, type Address } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'
import { VAULTS, type VaultConfig } from '@/config/contracts'
import { robinVaultAbi } from '@/lib/abis/robin-vault'

export interface VaultSnapshot {
  vault: VaultConfig
  totalAssets?: number
  totalSupply?: number
  depositCap?: number
  shareBalance?: number
  assetBalance?: number
  lifecycleState?: number
  paused: boolean
  apyAvailable: boolean
  apy?: number
  pricePerShare?: number
}

function numeric(value: unknown, decimals = 18) {
  return typeof value === 'bigint' ? Number(formatUnits(value, decimals)) : undefined
}

/** LifecycleState.Active = 0, Paused = 1, Shutdown = 2 */
function isPausedFromLifecycle(state: unknown): boolean {
  return typeof state === 'number' ? state === 1 : typeof state === 'bigint' ? state === 1n : false
}

export function useVaults(addressOverride?: Address) {
  const account = useAccount()
  const user = addressOverride ?? account.address
  const contracts = useMemo(
    () =>
      VAULTS.flatMap((vault) => [
        { address: vault.address, abi: robinVaultAbi, functionName: 'totalAssets' as const },
        { address: vault.address, abi: robinVaultAbi, functionName: 'totalSupply' as const },
        { address: vault.address, abi: robinVaultAbi, functionName: 'depositCap' as const },
        { address: vault.address, abi: robinVaultAbi, functionName: 'lifecycleState' as const },
        { address: vault.address, abi: robinVaultAbi, functionName: 'decimals' as const },
        ...(user
          ? [
              {
                address: vault.address,
                abi: robinVaultAbi,
                functionName: 'balanceOf' as const,
                args: [user],
              },
            ]
          : []),
      ]),
    [user],
  )

  const query = useReadContracts({
    contracts,
    allowFailure: true,
    query: { refetchInterval: 12_000 },
  })

  const snapshots = useMemo(() => {
    const stride = user ? 6 : 5
    return VAULTS.map((vault, index): VaultSnapshot => {
      const offset = index * stride
      const decimals = (query.data?.[offset + 4]?.result as number) ?? 18
      const totalAssets = numeric(query.data?.[offset]?.result, 18)
      const totalSupply = numeric(query.data?.[offset + 1]?.result, decimals)
      const shareBalance = user ? numeric(query.data?.[offset + 5]?.result, decimals) : undefined
      const lifecycleState = query.data?.[offset + 3]?.result
      const pricePerShare = totalAssets && totalSupply ? totalAssets / totalSupply : 1

      return {
        vault,
        totalAssets,
        totalSupply,
        depositCap: numeric(query.data?.[offset + 2]?.result, 18),
        lifecycleState: typeof lifecycleState === 'bigint' ? Number(lifecycleState) : (lifecycleState as number | undefined),
        paused: isPausedFromLifecycle(lifecycleState),
        shareBalance,
        pricePerShare,
        apyAvailable: false,
        apy: undefined,
      }
    })
  }, [query.data, user])

  return { ...query, snapshots, connected: account.isConnected }
}

export function useVault(address: string) {
  const result = useVaults()
  const snapshot = result.snapshots.find(
    (item) => item.vault.address.toLowerCase() === address.toLowerCase(),
  )
  return { ...result, snapshot }
}
