import { STORAGE_KEYS } from '@/lib/constants'
import type { TransactionRecord } from '@/types/transaction'

export function saveTransaction(tx: Omit<TransactionRecord, 'timestamp'> & { timestamp?: number }): void {
  try {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(STORAGE_KEYS.transactions) ?? '[]'
    const list: TransactionRecord[] = JSON.parse(raw)
    const newRecord: TransactionRecord = {
      ...tx,
      timestamp: tx.timestamp ?? Date.now(),
    }
    // Prepend newest transaction to the top of the history list
    const updated = [newRecord, ...list.filter(item => item.hash !== tx.hash)]
    window.localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save transaction to localStorage:', error)
  }
}
