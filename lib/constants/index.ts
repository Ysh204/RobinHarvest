/** localStorage keys — UI preferences and local tx history only, never chain state. */
export const STORAGE_KEYS = {
  settings: 'robin-harvest:settings',
  transactions: 'robin-harvest:transactions',
} as const

export const SLIPPAGE_PRESETS_BPS = [10, 50, 100] as const
export const DEFAULT_SLIPPAGE_BPS = 50
export const MAX_SLIPPAGE_BPS = 1000

export const DEFAULT_DEADLINE_MINUTES = 20
export const MAX_DEADLINE_MINUTES = 120

/** Debounce for preview* reads driven by form input. */
export const PREVIEW_DEBOUNCE_MS = 300

/** If no new block arrives within this window, show the degraded-connection banner. */
export const BLOCK_STALL_TIMEOUT_MS = 30_000

export const SECONDS_PER_YEAR = 31_536_000

/** Max rows per page in transaction history. */
export const TX_PAGE_SIZE = 10
