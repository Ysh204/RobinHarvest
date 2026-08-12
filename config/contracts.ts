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

export interface VaultConfig {
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
    supportsInKindRedeem: false,
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
    supportsInKindRedeem: true,
  },
  {
    address: ADDRESSES.clVault,
    asset: ADDRESSES.index,
    strategy: ADDRESSES.clStrategy,
    name: 'Concentrated Liquidity Vault',
    shareSymbol: 'rhINDEX-CL',
    assetSymbol: 'INDEX',
    strategyLabel: 'Uniswap v4 Concentrated Liquidity',
    protocolLabel: 'Uniswap v4',
    description:
      'Deploys INDEX into a hookless Uniswap v4 concentrated liquidity position with automated rebalancing and fee auto-compounding.',
    risk: 'high',
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
