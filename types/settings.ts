export type ThemePreference = 'dark' | 'system'
export type DisplayCurrency = 'USD' | 'EUR' | 'GBP'

export interface AppSettings {
  theme: ThemePreference
  currency: DisplayCurrency
  /** Slippage tolerance in basis points. */
  slippageBps: number
  /** Transaction deadline in minutes. */
  deadlineMinutes: number
  /** Optional user-supplied RPC URL override; empty string = default. */
  customRpcUrl: string
}
