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
  paused?: boolean
  apy: number
  pricePerShare?: number
}

const apys = [6.84, 12.42, 9.17]

function numeric(value: unknown, decimals = 18) {
  return typeof value === 'bigint' ? Number(formatUnits(value, decimals)) : undefined
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
        { address: vault.address, abi: robinVaultAbi, functionName: 'paused' as const },
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
      const totalAssets = numeric(query.data?.[offset]?.result, 18) // Underlying assets are always 18 decimals (INDEX/WETH)
      const totalSupply = numeric(query.data?.[offset + 1]?.result, decimals)
      const shareBalance = user ? numeric(query.data?.[offset + 5]?.result, decimals) : undefined
      const pricePerShare = totalAssets && totalSupply ? totalAssets / totalSupply : 1
      
      return {
        vault,
        totalAssets,
        totalSupply,
        depositCap: numeric(query.data?.[offset + 2]?.result, 18),
        paused: query.data?.[offset + 3]?.result as boolean | undefined,
        shareBalance,
        pricePerShare,
        apy: apys[index],
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
