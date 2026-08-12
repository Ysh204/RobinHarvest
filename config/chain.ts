import { defineChain } from 'viem'
import { APP_ENV, getChainId, getExplorerUrl, getRpcUrl, IS_PRODUCTION, IS_STAGING } from './env'

const rpcUrl = getRpcUrl()
const explorerUrl = getExplorerUrl()
export const ROBINHOOD_CHAIN_ID = getChainId() as typeof getChainId extends () => infer R ? R : number

export const robinhoodChain = defineChain({
  id: ROBINHOOD_CHAIN_ID,
  name: IS_PRODUCTION ? 'Robinhood Chain' : IS_STAGING ? 'Robinhood Chain (Staging)' : 'Robinhood Chain (Dev)',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'Robinhood Explorer', url: explorerUrl },
  },
  testnet: !IS_PRODUCTION,
})

export function explorerTxUrl(hash: string): string {
  return `${explorerUrl}/tx/${hash}`
}

export function explorerAddressUrl(address: string): string {
  return `${explorerUrl}/address/${address}`
}

export { APP_ENV }
