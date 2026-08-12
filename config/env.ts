import type { Address } from 'viem'

export type AppEnvironment = 'development' | 'staging' | 'production'

const appEnv = (process.env.NEXT_PUBLIC_APP_ENV ?? 'development') as AppEnvironment

export const APP_ENV: AppEnvironment = appEnv
export const IS_PRODUCTION = appEnv === 'production'
export const IS_STAGING = appEnv === 'staging'
export const IS_DEVELOPMENT = appEnv === 'development'

export function getRpcUrl(): string {
  const configured = process.env.NEXT_PUBLIC_RPC_URL
  return configured || 'https://rpc.testnet.chain.robinhood.com'
}

export function getExplorerUrl(): string {
  const configured = process.env.NEXT_PUBLIC_EXPLORER_URL
  return configured || 'https://explorer.testnet.chain.robinhood.com'
}

export function getChainId(): number {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID
  return raw ? Number(raw) : 46630
}

export function getManifestPath(): string {
  const configured = process.env.NEXT_PUBLIC_DEPLOYMENT_MANIFEST
  return configured || 'deployments/manifest.testnet.json'
}

export function getWalletConnectProjectId(): string {
  const configured = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  return configured || '42e1d8b7ccab1bb7bb19c58b59b15e3b'
}

export interface DeploymentManifest {
  network: string
  chainId: number
  environment: string
  indexFinanceIntegrationVerified: boolean
  indexFinanceIntegrationNote?: string
  contracts: Record<string, Address>
  tokens: Record<string, Address>
  governance?: {
    operationalRoleExecutionDelaySeconds?: number
    configFunctionDelaySeconds?: number
  }
}
