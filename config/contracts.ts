import type { Address } from 'viem'

/** Deployed contract addresses on Robinhood Chain (46630). */
export const ADDRESSES = {
  // Core Vaults
  coreVault: '0x638aDcd5755C9536fc5B9F9D5Ae4a8b2f21b3243',
  growthVault: '0x5e4bD34247e8b05fF4B1E2cce42a9100F8AF7112',
  lpVault: '0x7AD1006de431483B61122E9d3Ed0E83bE34fbc3F', // Uniswap v4 CL Vault

  // Deployed Strategies
  coreStrategy: '0xA41ce79456Db87b6ec6f983B98F9c93C199C16fD',
  growthStrategy: '0x119939fe285264afF1E419290dbA1D6b53BceE03',
  clStrategy: '0x876da3b278963521018e0Bb39188C67d612cB171',
  clPolicy: '0x969828B73bB90c955BFE14CB735aB67006625a84',

  // Tokens & Dependencies
  index: '0xA76EC50C0512F0cB53B5b11DE112D8A485f69950',
  indexFinance: '0x08BA25c1c3A1ceDD066Eb79DAA2d9c9b8984Ae85',
  weth: '0xEFcD98cD22F8e890dc05dCbAFcc451d611c4a1ca', // V4 Paired Token (ETH/USDG)
  indexWethLp: '0xA76EC50C0512F0cB53B5b11DE112D8A485f69950', // Underlying asset representation for v4 CL vault

  // Uniswap v4 & Core Infrastructure
  v4PoolManager: '0x9dDcb4eC5b535d7FF1Cc8FF1366d565E56EaD489',
  v4PositionManager: '0xCf764208B3A3C5BAA0cca1eBfD3894260982232f',
  swapAdapter: '0x2b2A1A684f063253a66B308bC05076B2065458B8',
  router: '0x3917b7E6acb5E11DD709FE89A7d5091399196095',
  accessManager: '0xAf159487801A0D06857a632c272937E08eCd363e',
  oracleRegistry: '0x0fecFCCB48798819Dc5762543991AccE4CFe64C7',
  rewardRegistry: '0x0dc0C52ee487eeF2245A26E9a02AC7652da984b6',
} as const satisfies Record<string, Address>

export type VaultRisk = 'low' | 'medium' | 'high'

export interface VaultConfig {
  /** Vault contract address — canonical route param. */
  readonly address: Address
  /** Underlying ERC-20 asset the vault accepts. */
  readonly asset: Address
  readonly strategy: Address
  readonly name: string
  readonly shareSymbol: string
  readonly assetSymbol: string
  readonly strategyLabel: string
  readonly protocolLabel: string
  readonly description: string
  readonly risk: VaultRisk
  readonly isV4?: boolean
  readonly v4Details?: {
    readonly poolManager: Address
    readonly positionManager: Address
    readonly feeTier: string
    readonly tickSpacing: number
    readonly policy: Address
  }
}

export const VAULTS: readonly VaultConfig[] = [
  {
    address: ADDRESSES.coreVault,
    asset: ADDRESSES.index,
    strategy: ADDRESSES.coreStrategy,
    name: 'Core Vault',
    shareSymbol: 'rhINDEX-Core',
    assetSymbol: 'INDEX',
    strategyLabel: '100% Auto-Compounding',
    protocolLabel: 'Index Finance',
    description:
      'Automatically liquidates tokenized stock distributions to maximize INDEX accumulation with gas-efficient batch execution.',
    risk: 'low',
  },
  {
    address: ADDRESSES.growthVault,
    asset: ADDRESSES.index,
    strategy: ADDRESSES.growthStrategy,
    name: 'Growth Vault',
    shareSymbol: 'rhINDEX-Growth',
    assetSymbol: 'INDEX',
    strategyLabel: 'Dynamic Allocation',
    protocolLabel: 'Index Finance + Equities',
    description:
      'Retains a dynamic basket of tokenized equities while compounding a configurable percentage of rewards back into INDEX.',
    risk: 'medium',
  },
  {
    address: ADDRESSES.lpVault,
    asset: ADDRESSES.indexWethLp,
    strategy: ADDRESSES.clStrategy,
    name: 'Concentrated LP Vault',
    shareSymbol: 'rhINDEX-LP',
    assetSymbol: 'INDEX / ETH / USDG',
    strategyLabel: 'Uniswap v4 Concentrated Liquidity',
    protocolLabel: 'Uniswap v4 (EIP-1153)',
    description:
      'Deploys capital into Uniswap v4 concentrated liquidity pools with Flash accounting, automated rebalancing across ticks, and fee auto-compounding.',
    risk: 'high',
    isV4: true,
    v4Details: {
      poolManager: ADDRESSES.v4PoolManager,
      positionManager: ADDRESSES.v4PositionManager,
      feeTier: '0.30% (3000)',
      tickSpacing: 60,
      policy: ADDRESSES.clPolicy,
    },
  },
] as const

const vaultsByAddress = new Map<string, VaultConfig>(
  VAULTS.map((v) => [v.address.toLowerCase(), v]),
)

export function getVaultByAddress(address: string): VaultConfig | undefined {
  return vaultsByAddress.get(address.toLowerCase())
}
