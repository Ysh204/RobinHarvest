import type { VaultConfig } from '@/config/contracts'

export type VaultKind = 'core' | 'growth' | 'cl'

export function getVaultKind(vault: VaultConfig): VaultKind {
  if (vault.isCl) return 'cl'
  if (vault.supportsInKindRedeem) return 'growth'
  return 'core'
}
