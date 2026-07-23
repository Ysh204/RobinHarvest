import { isAddress, getAddress } from 'viem'
import type { Address } from 'viem'

/** Truncates an address for display: 0x1234…AbCd */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

/** Validates and checksums a route param; returns null when invalid. */
export function toChecksummedAddress(value: string): Address | null {
  if (!isAddress(value)) return null
  return getAddress(value)
}
