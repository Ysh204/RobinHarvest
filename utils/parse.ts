import { parseUnits } from 'viem'

/**
 * Parses user text input into a bigint token amount.
 * Returns null for empty/invalid input instead of throwing.
 */
export function parseTokenInput(input: string, decimals: number): bigint | null {
  const trimmed = input.trim().replace(/,/g, '')
  if (trimmed === '' || trimmed === '.') return null
  if (!/^\d*\.?\d*$/.test(trimmed)) return null
  const [, fraction = ''] = trimmed.split('.')
  if (fraction.length > decimals) return null
  try {
    return parseUnits(trimmed, decimals)
  } catch {
    return null
  }
}

/** Applies slippage (bps) as a minimum-received floor. */
export function applySlippageFloor(value: bigint, slippageBps: number): bigint {
  return (value * BigInt(10_000 - slippageBps)) / 10_000n
}

/** Applies slippage (bps) as a maximum-paid ceiling. */
export function applySlippageCeiling(value: bigint, slippageBps: number): bigint {
  return (value * BigInt(10_000 + slippageBps)) / 10_000n
}
