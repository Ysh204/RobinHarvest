import type { Address } from 'viem'

/** Live on-chain stats for a single vault, refreshed each block via multicall. */
export interface VaultStats {
  totalAssets: bigint
  totalSupply: bigint
  /** convertToAssets(10^decimals) — assets per 1 share. */
  pricePerShare: bigint
  depositCap: bigint
  totalIdle: bigint
  strategyDebt: bigint
  unlockedProfit: bigint
  profitUnlockingRate: bigint
  profitMaxUnlockTime: bigint
  lastReportedLossBps: bigint
  defaultMaxLossBps: bigint
  paused: boolean
  strategy: Address
  proposedStrategy: Address
  strategyMigrationExecutableAt: bigint
  decimals: number
}

/** Client-derived display metrics computed from VaultStats. */
export interface VaultDerivedStats {
  /** Annualized APY derived from profitUnlockingRate / totalAssets. */
  apy: number
  /** 0–1 utilization of depositCap (0 when cap is 0 / unlimited). */
  capacityUsed: number
  hasCap: boolean
  migrationPending: boolean
}

/** Per-wallet balances and limits for a vault. */
export interface VaultUserBalances {
  shares: bigint
  /** convertToAssets(shares). */
  assetValue: bigint
  assetBalance: bigint
  allowance: bigint
  maxDeposit: bigint
  maxMint: bigint
  maxWithdraw: bigint
  maxRedeem: bigint
}

export interface TokenMeta {
  address: Address
  symbol: string
  name: string
  decimals: number
}
