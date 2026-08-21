import type { Address } from 'viem'

export interface HistoryPoint {
  time: number
  value: number
}

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

function generateSeries(
  address: Address,
  salt: number,
  endValue: number,
  days: number,
  volatility: number,
  drift: number,
  minValueRatio = 0.05,
): HistoryPoint[] {
  const rand = mulberry32(seedFromAddress(address, salt))
  const values: number[] = new Array<number>(days)
  values[days - 1] = endValue
  for (let i = days - 2; i >= 0; i--) {
    const shock = (rand() - 0.5) * 2 * volatility * endValue
    const next = values[i + 1] - drift * endValue + shock
    values[i] = Math.max(next, endValue * minValueRatio)
  }
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const end = today.getTime()
  return values.map((value, i) => ({
    time: end - (days - 1 - i) * DAY_MS,
    value,
  }))
}

export function mockTvlHistory(address: Address, currentTvl: number, days = 30): HistoryPoint[] {
  const baseline = Math.max(currentTvl, 12500)
  return generateSeries(address, 1, baseline, days, 0.02, 0.003)
}

export function mockApyHistory(address: Address, currentApy: number, days = 30): HistoryPoint[] {
  const baseline = Math.max(currentApy, 12)
  return generateSeries(address, 2, baseline, days, 0.03, 0.001, 0.5)
}

export function mockSharePriceHistory(address: Address, currentPrice: number, days = 30): HistoryPoint[] {
  const baseline = Math.max(currentPrice, 1.0)
  // Share price strictly grows upward over time with small random harvest increments
  return generateSeries(address, 4, baseline, days, 0.005, 0.002, 0.8)
}

export function mockYieldHistory(address: Address, currentValue: number, days = 30): HistoryPoint[] {
  return generateSeries(address, 3, currentValue, days, 0.015, 0.01)
}
