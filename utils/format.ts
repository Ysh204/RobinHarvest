import { formatUnits } from 'viem'
import type { DisplayCurrency } from '@/types/settings'

/**
 * Formats a raw bigint token amount for display with adaptive precision:
 * large values get fewer decimals, dust gets a "<" floor.
 */
export function formatTokenAmount(
  value: bigint,
  decimals: number,
  maxFractionDigits = 4,
): string {
  if (value === 0n) return '0'
  const asNumber = Number(formatUnits(value, decimals))
  if (asNumber !== 0 && Math.abs(asNumber) < 10 ** -maxFractionDigits) {
    return `<${(10 ** -maxFractionDigits).toFixed(maxFractionDigits)}`
  }
  const digits =
    Math.abs(asNumber) >= 10_000 ? 2 : Math.abs(asNumber) >= 1 ? Math.min(4, maxFractionDigits) : maxFractionDigits
  return asNumber.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

/** Formats a bigint as a compact figure, e.g. 1.24M. */
export function formatCompact(value: bigint, decimals: number): string {
  const asNumber = Number(formatUnits(value, decimals))
  return asNumber.toLocaleString('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  })
}

const CURRENCY_LOCALE: Record<DisplayCurrency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
}

/** Formats a numeric value in the user's display currency. */
export function formatCurrency(value: number, currency: DisplayCurrency): string {
  return value.toLocaleString(CURRENCY_LOCALE[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })
}

/** Formats a 0–1 ratio or a plain number as a percentage. */
export function formatPercent(value: number, fractionDigits = 2): string {
  return `${(value * 100).toFixed(fractionDigits)}%`
}

/** APY given as decimal (0.0523 → "5.23%"). */
export function formatApy(apy: number): string {
  if (!Number.isFinite(apy) || apy < 0) return '—'
  return formatPercent(apy)
}

/** Basis points → "0.50%". */
export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`
}
