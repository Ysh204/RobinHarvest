'use client'

import {
  Clock3,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  RefreshCcw,
  ShieldCheck,
  Droplets,
  Copy,
  Check,
  Activity,
  Search,
  Trash2,
  Layers,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { STORAGE_KEYS } from '@/lib/constants'
import type { TransactionRecord, TransactionKind } from '@/types/transaction'
import { explorerTxUrl } from '@/config/chain'
import { getVaultByAddress } from '@/config/contracts'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FilterCategory = 'all' | 'flows' | 'strategy' | 'approves'

export default function TransactionsPage() {
  const [records, setRecords] = useState<TransactionRecord[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<FilterCategory>('all')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  useEffect(() => {
    try {
      setRecords(JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) ?? '[]') as TransactionRecord[])
    } catch {
      setRecords([])
    }
  }, [])

  function clearHistory() {
    localStorage.setItem(STORAGE_KEYS.transactions, '[]')
    setRecords([])
    toast.success('Transaction history cleared from local client')
  }

  function copyToClipboard(hash: string, event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    toast.success('Transaction hash copied to clipboard')
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Category filter
      if (category === 'flows' && !['deposit', 'withdraw', 'mint', 'redeem'].includes(rec.kind)) return false
      if (category === 'strategy' && !['rebalance', 'harvest', 'tend'].includes(rec.kind)) return false
      if (category === 'approves' && !['approve', 'faucet'].includes(rec.kind)) return false

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const vaultConfig = getVaultByAddress(rec.vault)
        const matchesHash = rec.hash.toLowerCase().includes(q)
        const matchesKind = rec.kind.toLowerCase().includes(q)
        const matchesSymbol = rec.symbol.toLowerCase().includes(q)
        const matchesVault = vaultConfig?.name.toLowerCase().includes(q)
        return matchesHash || matchesKind || matchesSymbol || matchesVault
      }

      return true
    })
  }, [records, category, search])

  const stats = useMemo(() => {
    const total = records.length
    const confirmed = records.filter((r) => r.status === 'confirmed').length
    const successRate = total > 0 ? Math.round((confirmed / total) * 100) : 100
    return { total, successRate }
  }, [records])

  function getTxVisuals(kind: TransactionKind) {
    switch (kind) {
      case 'deposit':
      case 'mint':
        return {
          label: 'Capital Deposit',
          icon: <ArrowDownLeft className="size-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          gradient: 'from-emerald-500/10 via-transparent to-transparent',
        }
      case 'withdraw':
      case 'redeem':
      case 'redeemInKind':
        return {
          label: 'Share Redemption',
          icon: <ArrowUpRight className="size-4 text-amber-400" />,
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          gradient: 'from-amber-500/10 via-transparent to-transparent',
        }
      case 'harvest':
        return {
          label: 'v4 Yield Harvest',
          icon: <Sparkles className="size-4 text-lime-400" />,
          bg: 'bg-lime-500/10 border-lime-500/20 text-lime-400',
          gradient: 'from-lime-500/10 via-transparent to-transparent',
        }
      case 'rebalance':
        return {
          label: 'v4 Flash Rebalance',
          icon: <RefreshCcw className="size-4 text-purple-400" />,
          bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
          gradient: 'from-purple-500/10 via-transparent to-transparent',
        }
      case 'tend':
        return {
          label: 'Strategy Maintenance',
          icon: <Activity className="size-4 text-cyan-400" />,
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          gradient: 'from-cyan-500/10 via-transparent to-transparent',
        }
      case 'faucet':
        return {
          label: 'Testnet Faucet Claim',
          icon: <Droplets className="size-4 text-blue-400" />,
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          gradient: 'from-blue-500/10 via-transparent to-transparent',
        }
      case 'approve':
        return {
          label: 'Token Approval',
          icon: <ShieldCheck className="size-4 text-slate-300" />,
          bg: 'bg-slate-500/10 border-slate-500/20 text-slate-300',
          gradient: 'from-slate-500/10 via-transparent to-transparent',
        }
      default:
        return {
          label: kind,
          icon: <Activity className="size-4 text-primary" />,
          bg: 'bg-primary/10 border-primary/20 text-primary',
          gradient: 'from-primary/10 via-transparent to-transparent',
        }
    }
  }

  return (
    <div className="flex flex-col w-full min-h-full">
      {/* Full-Width Institutional Header Banner */}
      <section className="w-full border-b border-border/50 bg-gradient-to-b from-white/[0.04] via-white/[0.015] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 shadow-xs">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Live Audit Trail
              </span>
              <span className="text-xs font-mono font-medium text-muted-foreground">Chain ID: 46630</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Transaction & Strategy Logs
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Real-time cryptographic verification of capital deposits, share redemptions, automated Uniswap v4 rebalances, and harvest events executed on Robinhood Chain.
            </p>
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Layers className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Logged Events</span>
                <span className="text-sm font-extrabold font-mono text-foreground tabular">{stats.total} Txs</span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Success Rate</span>
                <span className="text-sm font-extrabold font-mono text-emerald-400 tabular">{stats.successRate}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Centered Main Activity Body */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10 flex flex-col gap-6">
        {/* Search and Filtering Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-border/60">
            {[
              { id: 'all', label: 'All Activity' },
              { id: 'flows', label: 'Capital Flows' },
              { id: 'strategy', label: 'Strategy Ops' },
              { id: 'approves', label: 'Approvals & Faucet' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as FilterCategory)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  category === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search tx hash, type or token..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 text-xs bg-card/50 border-border/80 focus-visible:border-primary/40 rounded-xl"
              />
            </div>

            {records.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="h-9 text-xs text-rose-400 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 hover:text-rose-300 gap-1.5 px-3 rounded-xl transition-all"
              >
                <Trash2 className="size-3.5" />
                <span className="hidden sm:inline">Clear Log</span>
              </Button>
            )}
          </div>
        </div>

        {/* Transactions Record Cards */}
        {filteredRecords.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center gap-4 py-24 border border-border/50 bg-card/30 rounded-2xl text-center backdrop-blur-md shadow-sm">
            <div className="p-4 rounded-full bg-white/[0.03] border border-border/60 text-muted-foreground relative">
              <Clock3 className="size-8 text-primary/70" />
              <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-primary/20 border border-primary animate-ping" />
            </div>
            <div className="flex flex-col gap-1.5 max-w-md px-4">
              <h3 className="text-base font-extrabold text-foreground">
                {records.length === 0 ? 'No Cryptographic Activity Logged' : 'No Matching Transactions Found'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {records.length === 0
                  ? 'Your wallet interactions on Robinhood Chain Testnet—including faucet claims, token deposits, share redemptions, and Uniswap v4 rebalances—will appear here instantly with full on-chain verifiability.'
                  : `No transactions matched your active search query "${search}". Try switching tabs or clearing your filters.`}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <AnimatePresence>
              {filteredRecords.map((record, idx) => {
                const visuals = getTxVisuals(record.kind)
                const vaultConfig = getVaultByAddress(record.vault)
                const isStrategyOp = ['rebalance', 'harvest', 'tend'].includes(record.kind)
                const shortHash = `${record.hash.slice(0, 10)}...${record.hash.slice(-8)}`

                return (
                  <motion.a
                    key={record.hash + idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: idx * 0.04 }}
                    href={explorerTxUrl(record.hash)}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md transition-all duration-200 hover:bg-card/90 hover:border-primary/50 shadow-sm hover:shadow-[0_0_25px_rgba(16,185,129,0.07)] overflow-hidden"
                  >
                    {/* Subtle Radial Kind Gradient Accent */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b ${visuals.gradient} group-hover:w-1.5 transition-all`} />

                    {/* Left Column: Icon & Action Data */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      <div className={`p-3 rounded-xl border ${visuals.bg} shadow-xs shrink-0 flex items-center justify-center`}>
                        {visuals.icon}
                      </div>

                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                            {visuals.label} <ExternalLink className="size-3.5 opacity-60 group-hover:opacity-100 transition-opacity text-primary" />
                          </span>

                          {vaultConfig && (
                            <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-border/60 text-[11px] font-bold text-muted-foreground truncate max-w-[200px]">
                              {vaultConfig.name}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-mono">
                          <div className="flex items-center gap-1.5">
                            <Clock3 className="size-3 text-muted-foreground/80" />
                            <span>{new Date(record.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </div>

                          <span className="text-border/60">•</span>

                          <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded border border-white/[0.05]">
                            <span className="text-[11px] font-mono font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                              {shortHash}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => copyToClipboard(record.hash, e)}
                              className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
                              title="Copy full transaction hash"
                            >
                              {copiedHash === record.hash ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Financial Impact & On-Chain Status */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-border/30 md:text-right shrink-0">
                      <div className="flex flex-col md:items-end">
                        {isStrategyOp ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary shadow-xs">
                            <Sparkles className="size-3 text-primary" />
                            <span>Automated v4 Execution</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1.5 font-mono">
                            <span className="text-sm sm:text-base font-extrabold tabular text-foreground tracking-tight">
                              {['deposit', 'mint', 'faucet'].includes(record.kind) ? '+' : ['withdraw', 'redeem'].includes(record.kind) ? '-' : ''} {record.amount}
                            </span>
                            <span className="text-xs font-bold font-mono text-primary">{record.symbol}</span>
                          </div>
                        )}

                        <span className="text-[11px] text-muted-foreground hidden md:block mt-0.5">
                          {isStrategyOp ? `Yield target: ${record.symbol}` : 'Settled on testnet'}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider border shadow-xs ${
                          record.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {record.status === 'failed' ? <XCircle className="size-3" /> : <CheckCircle2 className="size-3" />}
                        {record.status}
                      </span>
                    </div>
                  </motion.a>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
