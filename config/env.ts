import type { Address } from 'viem'

export type AppEnvironment = 'development' | 'staging' | 'production'

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const nodeEnv = process.env.NODE_ENV ?? 'development'
const appEnv = (process.env.NEXT_PUBLIC_APP_ENV ?? (nodeEnv === 'production' ? 'production' : 'development')) as AppEnvironment

export const APP_ENV: AppEnvironment = appEnv
export const IS_PRODUCTION = appEnv === 'production'
export const IS_STAGING = appEnv === 'staging'
export const IS_DEVELOPMENT = appEnv === 'development'

/** Fail loudly in production/staging when RPC is not configured. */
export function getRpcUrl(): string {
  const configured = process.env.NEXT_PUBLIC_RPC_URL
  if (IS_PRODUCTION || IS_STAGING) {
    return required('NEXT_PUBLIC_RPC_URL', configured)
  }
  return configured ?? 'http://127.0.0.1:8545'
}

export function getExplorerUrl(): string {
  const configured = process.env.NEXT_PUBLIC_EXPLORER_URL
  if (IS_PRODUCTION || IS_STAGING) {
    return required('NEXT_PUBLIC_EXPLORER_URL', configured)
  }
  return configured ?? 'https://explorer.testnet.chain.robinhood.com'
}

export function getChainId(): number {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID
  if (IS_PRODUCTION || IS_STAGING) {
    return Number(required('NEXT_PUBLIC_CHAIN_ID', raw))
  }
  return raw ? Number(raw) : 46630
}

export function getManifestPath(): string {
  const configured = process.env.NEXT_PUBLIC_DEPLOYMENT_MANIFEST
  if (IS_PRODUCTION || IS_STAGING) {
    return required('NEXT_PUBLIC_DEPLOYMENT_MANIFEST', configured)
  }
  return configured ?? 'deployments/manifest.testnet.json'
}

export function getWalletConnectProjectId(): string {
  const configured = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  if (IS_PRODUCTION || IS_STAGING) {
    return required('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID', configured)
  }
  return configured ?? '42e1d8b7ccab1bb7bb19c58b59b15e3b'
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
