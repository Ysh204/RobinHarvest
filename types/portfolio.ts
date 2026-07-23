import type { Address } from 'viem'

/** A user's position in one vault, aggregated for the Portfolio page. */
export interface VaultPosition {
  vault: Address
  shares: bigint
  assetValue: bigint
  decimals: number
  apy: number
}

export interface PortfolioSummary {
  positions: VaultPosition[]
  /** Sum of all position values, normalized to 18 decimals for display. */
  totalValue: bigint
  /** Weighted-average APY across positions. */
  weightedApy: number
  /** Projected monthly earnings from current positions at current APY. */
  estimatedMonthly: bigint
}
