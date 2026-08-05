'use client'

import { Clock3, ExternalLink, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { STORAGE_KEYS } from '@/lib/constants'
import type { TransactionRecord } from '@/types/transaction'
import { explorerTxUrl } from '@/config/chain'

export default function TransactionsPage() {
  const [records, setRecords] = useState<TransactionRecord[]>([])
  
  useEffect(() => {
    try {
      setRecords(JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) ?? '[]') as TransactionRecord[])
    } catch {
      setRecords([])
    }
  }, [])

  return (
    <div className="flex flex-col w-full">
      {/* Full-Width Header Banner */}
      <section className="w-full border-b border-border/40 bg-gradient-to-b from-white/[0.03] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 max-w-3xl">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Wallet Activity & Audit Trail</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">Transaction History</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            A real-time cryptographic log of strategy interactions, approvals, and vault settlements initiated from this client.
          </p>
        </motion.div>
      </section>

      {/* Centered Compact Transactions List */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 md:py-10 flex flex-col gap-6">
        {records.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center gap-3.5 py-20 border border-border/60 bg-card/30 rounded-2xl text-center backdrop-blur-sm shadow-xs">
            <div className="p-3.5 rounded-full bg-white/[0.04] border border-border/60 text-muted-foreground">
              <Clock3 className="size-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-sm font-bold text-foreground">No Recorded Transactions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deposits, Uniswap v4 rebalances, approvals, and share liquidations initiated in this browser session will appear here in chronological order.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Activity Log ({records.length})</span>
              <span>Status & Value</span>
            </div>
            {records.map((record, idx) => (
              <motion.a
                key={record.hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                href={explorerTxUrl(record.hash)}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:border-primary/40 shadow-xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <ArrowUpRight className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-foreground capitalize group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {record.kind} <ExternalLink className="size-3 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">{new Date(record.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right font-mono ml-auto">
                  <span className="text-sm font-extrabold tabular text-foreground">
                    {record.amount} {record.symbol}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold shadow-xs ${
                      record.status === 'failed'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
