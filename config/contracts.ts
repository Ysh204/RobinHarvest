import type { Address } from 'viem'
import { loadDeploymentManifest } from './deployments'
import type { DeploymentManifest } from './env'

const deployment = loadDeploymentManifest() as DeploymentManifest

/** Canonical deployed addresses — sourced from config/deployments/manifest.*.json */
export const ADDRESSES = {
  coreVault: deployment.contracts.coreVault as Address,
  growthVault: deployment.contracts.growthVault as Address,
  clVault: deployment.contracts.clVault as Address,
  coreStrategy: deployment.contracts.coreStrategy as Address,
  growthStrategy: deployment.contracts.growthStrategy as Address,
  clStrategy: deployment.contracts.clStrategy as Address,
  clPolicy: deployment.contracts.clPolicy as Address,
  index: deployment.tokens.index as Address,
  indexFinance: deployment.tokens.indexFinance as Address,
  clPairedToken: deployment.tokens.clPairedToken as Address,
  v4PoolManager: deployment.contracts.v4PoolManager as Address,
  v4PositionManager: deployment.contracts.v4PositionManager as Address,
  swapAdapter: deployment.contracts.swapAdapter as Address,
  router: deployment.contracts.executionRouter as Address,
  accessManager: deployment.contracts.accessManager as Address,
  oracleRegistry: deployment.contracts.oracleRegistry as Address,
  rewardRegistry: deployment.contracts.rewardRegistry as Address,
  permit2: deployment.contracts.permit2 as Address,
} as const

export type VaultRisk = 'low' | 'medium' | 'high'

export interface RiskFactor {
  readonly title: string
  readonly description: string
}

export interface VaultConfig {
  readonly id: string
  readonly address: Address
  readonly asset: Address
  readonly strategy: Address
  readonly name: string
  readonly shareSymbol: string
  readonly assetSymbol: string
  readonly strategyLabel: string
  readonly protocolLabel: string
  readonly description: string
  readonly risk: VaultRisk
  readonly tags: readonly string[]
  readonly compounding: string
  readonly rewardSource: string
  readonly rewardFrequency?: string
  readonly suitableFor: string
  readonly performanceFee: string
  readonly deployedDate: string
  readonly riskRating: string
  readonly riskLevel: number
  readonly riskFactors: readonly RiskFactor[]
  readonly allocation: string
  readonly allocationBands?: {
    readonly minSell: string
    readonly maxSell: string
  }
  readonly tokenIcons?: readonly string[]
  readonly supportsInKindRedeem: boolean
  readonly isCl?: boolean
  readonly clDetails?: {
    readonly poolManager: Address
    readonly positionManager: Address
    readonly pairedToken: Address
    readonly feeTier: string
    readonly tickSpacing: number
    readonly policy: Address
  }
}

export const VAULTS: readonly VaultConfig[] = [
  {
    id: 'rhindex-core',
    address: ADDRESSES.coreVault,
    asset: ADDRESSES.index,
    strategy: ADDRESSES.coreStrategy,
    name: 'rhINDEX-Core',
    shareSymbol: 'rhINDEX-Core',
    assetSymbol: 'INDEX',
    strategyLabel: '100% Auto-Compounding',
    protocolLabel: 'Index Finance',
    description:
      'Automatically maximize INDEX accumulation by converting all tokenized stock rewards into additional INDEX with gas-efficient batch execution.',
    risk: 'low',
    tags: ['Stable Yield', 'Single Asset', '100% Compound'],
    compounding: 'Automatic (100%)',
    rewardSource: 'Tokenized stock distributions from Index Finance',
    rewardFrequency: 'Varies based on Index Finance distribution schedule',
    suitableFor: 'Long-term INDEX holders seeking maximum compounding.',
    performanceFee: '10%',
    deployedDate: 'July 3rd, 2026',
    riskRating: 'Medium',
    riskLevel: 3,
    riskFactors: [
      {
        title: 'Smart Contract Risk',
        description: 'Exposure to smart contract vulnerabilities affecting either the vault or integrated protocols.',
      },
      {
        title: 'Market Risk',
        description: 'The value of INDEX may fluctuate with broader market conditions.',
      },
      {
        title: 'Liquidity Risk',
        description: 'Execution prices depend on available market liquidity during automated reward conversion.',
      },
      {
        title: 'Reward Dependency',
        description: 'Vault performance depends on Index Finance continuing to generate and distribute tokenized stock rewards.',
      },
    ],
    allocation: 'INDEX 100% | Stocks 0%',
    tokenIcons: ['INDEX'],
    supportsInKindRedeem: false,
  },
  {
    id: 'rhindex-growth',
    address: ADDRESSES.growthVault,
    asset: ADDRESSES.index,
    strategy: ADDRESSES.growthStrategy,
    name: 'rhINDEX-Growth',
    shareSymbol: 'rhINDEX-Growth',
    assetSymbol: 'INDEX',
    strategyLabel: 'Dynamic Allocation & Growth',
    protocolLabel: 'Index Finance + Equities',
    description:
      'Build long-term exposure to tokenized equities while continuously compounding a configurable portion of rewards back into INDEX.',
    risk: 'medium',
    tags: ['High Growth', 'In-Kind Redeem', 'Dynamic Allocation'],
    compounding: 'Partial (Dynamic)',
    rewardSource: 'Tokenized stock distributions from Index Finance',
    rewardFrequency: 'Varies based on Index Finance distribution schedule',
    suitableFor: 'Users seeking both INDEX growth and exposure to tokenized stocks.',
    performanceFee: '10%',
    deployedDate: 'July 3rd, 2026',
    riskRating: 'Medium-High',
    riskLevel: 4,
    riskFactors: [
      {
        title: 'Smart Contract Risk',
        description: 'Exposure to smart contract vulnerabilities affecting either the vault or integrated protocols.',
      },
      {
        title: 'Market Risk',
        description: 'Exposure to both INDEX and tokenized equity price movements.',
      },
      {
        title: 'Liquidity Risk',
        description: 'Dependent on on-chain liquidity for supported reward assets during rebalancing.',
      },
      {
        title: 'Portfolio Concentration',
        description: 'Retained equity assets may appreciate or depreciate differently than INDEX.',
      },
    ],
    allocation: 'INDEX 65% | Equities 35%',
    allocationBands: {
      minSell: '10%',
      maxSell: '50%',
    },
    tokenIcons: ['INDEX', 'AAPL', 'NVDA'],
    supportsInKindRedeem: true,
  },
  {
    id: 'index-eth',
    address: ADDRESSES.clVault,
    asset: ADDRESSES.index,
    strategy: ADDRESSES.clStrategy,
    name: 'rhINDEX-CL (Uniswap v4)',
    shareSymbol: 'rhINDEX-CL',
    assetSymbol: 'INDEX',
    strategyLabel: 'Uniswap v4 Concentrated Liquidity',
    protocolLabel: 'Uniswap v4',
    description:
      'Automatically optimize and compound INDEX, ETH, and USDG concentrated liquidity positions with EIP-1153 flash accounting and automated tick rebalancing.',
    risk: 'high',
    tags: ['Uniswap v4 CL', 'EIP-1153 Flash', 'Active LP'],
    compounding: 'Automatic Fee Compounding',
    rewardSource: 'Managed trading fees & liquidity incentives',
    rewardFrequency: 'Continuous per block trading volume',
    suitableFor: 'Users seeking automated, managed liquidity provision with maximum capital efficiency.',
    performanceFee: '10%',
    deployedDate: 'July 3rd, 2026',
    riskRating: 'High',
    riskLevel: 5,
    riskFactors: [
      {
        title: 'Smart Contract Risk',
        description: 'Exposure to smart contract vulnerabilities affecting Uniswap v4 PoolManager or strategy hooks.',
      },
      {
        title: 'Impermanent Loss',
        description: 'Managed positions remain exposed to price divergence between INDEX, ETH, and USDG.',
      },
      {
        title: 'Market Risk',
        description: 'Changes in underlying asset prices directly impact the liquidity pool value.',
      },
      {
        title: 'Liquidity Risk',
        description: 'Dependent on available DEX liquidity and trading volume for continuous fee generation.',
      },
    ],
    allocation: 'INDEX-ETH-USDG LP 100%',
    tokenIcons: ['INDEX', 'ETH', 'USDG'],
    supportsInKindRedeem: false,
    isCl: true,
    clDetails: {
      poolManager: ADDRESSES.v4PoolManager,
      positionManager: ADDRESSES.v4PositionManager,
      pairedToken: ADDRESSES.clPairedToken,
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

export const INDEX_FINANCE_INTEGRATION_VERIFIED = deployment.indexFinanceIntegrationVerified
