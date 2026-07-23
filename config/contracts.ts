import type { Address } from 'viem'

/** Deployed contract addresses on Robinhood Chain (46630). */
export const ADDRESSES = {
  coreVault: '0x4d7acCF62C18f8c925E481208F7b3E1100bfEda3',
  growthVault: '0x135790F9B78Cf4C637A520FBd2373403AAA0262F',
  lpVault: '0x6dA96f5D5996f45C5fb5b21aA49F3ba379994937',
  index: '0x082b19F2443cc903Cabd638f65256dDee3590840',
  weth: '0x16837f1777DDF8AbEf9539bC6291976c2ca4ba8c',
  indexWethLp: '0x30d21De90C862d46a6C5042282350D908f790B31',
} as const satisfies Record<string, Address>

export type VaultRisk = 'low' | 'medium' | 'high'

export interface VaultConfig {
  /** Vault contract address — canonical route param. */
  readonly address: Address
  /** Underlying ERC-20 asset the vault accepts. */
  readonly asset: Address
  readonly name: string
  readonly shareSymbol: string
  readonly assetSymbol: string
  readonly strategyLabel: string
  readonly description: string
  readonly risk: VaultRisk
}

export const VAULTS: readonly VaultConfig[] = [
  {
    address: ADDRESSES.coreVault,
    asset: ADDRESSES.index,
    name: 'Core Vault',
    shareSymbol: 'rhINDEX',
    assetSymbol: 'INDEX',
    strategyLabel: 'Low-risk staking',
    description:
      'Deposits INDEX into a conservative staking strategy and auto-compounds rewards.',
    risk: 'low',
  },
  {
    address: ADDRESSES.growthVault,
    asset: ADDRESSES.index,
    name: 'Growth Vault',
    shareSymbol: 'rhINDEX-Growth',
    assetSymbol: 'INDEX',
    strategyLabel: 'Yield optimization',
    description:
      'Deploys INDEX into higher-risk yield opportunities with dynamic compounding.',
    risk: 'high',
  },
  {
    address: ADDRESSES.lpVault,
    asset: ADDRESSES.indexWethLp,
    name: 'LP Vault',
    shareSymbol: 'rhINDEX-LP',
    assetSymbol: 'INDEX/WETH LP',
    strategyLabel: 'LP auto-compounding',
    description:
      'Auto-compounds INDEX/WETH liquidity-pool rewards back into the LP position.',
    risk: 'medium',
  },
] as const

const vaultsByAddress = new Map<string, VaultConfig>(
  VAULTS.map((v) => [v.address.toLowerCase(), v]),
)

export function getVaultByAddress(address: string): VaultConfig | undefined {
  return vaultsByAddress.get(address.toLowerCase())
}
