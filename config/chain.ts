import { defineChain } from 'viem'

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? 'https://rpc.testnet.chain.robinhood.com'
const explorerUrl =
  process.env.NEXT_PUBLIC_EXPLORER_URL ?? 'https://explorer.testnet.chain.robinhood.com'

export const ROBINHOOD_CHAIN_ID = 46630 as const

export const robinhoodChain = defineChain({
  id: ROBINHOOD_CHAIN_ID,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'Robinhood Explorer', url: explorerUrl },
  },
  testnet: true,
})

export function explorerTxUrl(hash: string): string {
  return `${explorerUrl}/tx/${hash}`
}

export function explorerAddressUrl(address: string): string {
  return `${explorerUrl}/address/${address}`
}
