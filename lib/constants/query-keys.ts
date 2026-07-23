import type { Address } from 'viem'

/**
 * Central query-key factory. Wagmi manages its own keys internally;
 * these scope keys are used with queryClient.invalidateQueries via the
 * `scopeKey` option on wagmi read hooks so per-block and post-transaction
 * invalidation stays precise.
 */
export const SCOPE_KEYS = {
  vaultStats: (vault: Address) => `vault-stats:${vault.toLowerCase()}`,
  allVaultStats: 'vault-stats',
  userBalances: (user: Address) => `user-balances:${user.toLowerCase()}`,
  allUserBalances: 'user-balances',
  metadata: 'token-metadata',
  eligibility: (vault: Address, user: Address) =>
    `eligibility:${vault.toLowerCase()}:${user.toLowerCase()}`,
  preview: (vault: Address) => `preview:${vault.toLowerCase()}`,
} as const
