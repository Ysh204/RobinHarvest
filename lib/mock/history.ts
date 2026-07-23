import type { Address } from 'viem'

/**
 * Deterministic mock historical series for TVL / APY / yield charts.
 * The chain exposes no historical data and no indexer exists — the spec
 * explicitly permits mock history. Series are seeded per vault address so
 * they are stable across renders and sessions, and are anchored to a live
 * "current" value when supplied so the last point matches on-chain reality.
 */

export interface HistoryPoint {
  /** Unix ms timestamp for the day. */
  time: number
  value: number
}

/** Mulberry32 — tiny deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFromAddress(address: Address, salt: number): number {
  let h = salt
  for (let i = 2; i < 10; i++) {
    h = (h * 31 + address.charCodeAt(i)) | 0
  }
  return h
}

const DAY_MS = 86_400_000

/**
 * Random-walk series ending at `endValue`, `days` points, daily cadence.
 * Volatility is a fraction of endValue applied per step.
 */
function generateSeries(
  address: Address,
  salt: number,
  endValue: number,
  days: number,
  volatility: number,
  drift: number,
): HistoryPoint[] {
  const rand = mulberry32(seedFromAddress(address, salt))
  // Walk backwards from the end value so "today" always matches live data.
  const values: number[] = new Array<number>(days)
  values[days - 1] = endValue
  for (let i = days - 2; i >= 0; i--) {
    const shock = (rand() - 0.5) * 2 * volatility * endValue
    const next = values[i + 1] - drift * endValue + shock
    values[i] = Math.max(next, endValue * 0.05)
  }
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const end = today.getTime()
  return values.map((value, i) => ({
    time: end - (days - 1 - i) * DAY_MS,
    value,
  }))
}

export function mockTvlHistory(address: Address, currentTvl: number, days = 90): HistoryPoint[] {
  return generateSeries(address, 1, currentTvl, days, 0.02, 0.004)
}

export function mockApyHistory(address: Address, currentApy: number, days = 90): HistoryPoint[] {
  return generateSeries(address, 2, currentApy, days, 0.05, 0)
}

export function mockYieldHistory(address: Address, currentValue: number, days = 30): HistoryPoint[] {
  return generateSeries(address, 3, currentValue, days, 0.015, 0.01)
}
