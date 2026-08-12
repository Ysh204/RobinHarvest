import type { Address, Hash } from 'viem'

export type TransactionKind =
  | 'approve'
  | 'deposit'
  | 'mint'
  | 'withdraw'
  | 'redeem'
  | 'redeemInKind'
  | 'rebalance'
  | 'harvest'
  | 'tend'

export type TransactionStatus = 'pending' | 'confirmed' | 'failed'

/** A locally-persisted transaction record (per chainId + wallet). */
export interface TransactionRecord {
  hash: Hash
  kind: TransactionKind
  status: TransactionStatus
  /** Vault this tx concerns (approve stores the vault being approved for). */
  vault: Address
  /** Raw amount in the unit of the tx (assets or shares depending on kind). */
  amount: string
  /** Display symbol for the amount. */
  symbol: string
  timestamp: number
}

/** Shared write-transaction lifecycle. */
export type TxFlowStatus =
  | 'idle'
  | 'simulating'
  | 'awaiting-signature'
  | 'broadcasting'
  | 'pending'
  | 'confirmed'
  | 'failed'
