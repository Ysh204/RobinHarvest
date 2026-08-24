'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Copy,
  ExternalLink,
  Filter,
  Layers,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Vault,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { explorerTxUrl } from '@/config/chain'
import { VAULTS } from '@/config/contracts'
import { STORAGE_KEYS } from '@/lib/constants'
import type { TransactionRecord } from '@/types/transaction'

export type EventType = 'all' | 'harvest' | 'rebalance' | 'deposit' | 'withdraw' | 'in_kind'

export interface ProtocolEvent {
  id: string
  type: 'harvest' | 'rebalance' | 'deposit' | 'withdraw' | 'in_kind' | 'tend'
  vaultId: string
  vaultName: string
  title: string
  description: string
  amount?: string
  txHash: string
  timestamp: number
  gasUsed: string
  executor: string
}

const INITIAL_EVENTS: ProtocolEvent[] = [
  {
    id: 'evt-1',
    type: 'harvest',
    vaultId: 'rhindex-core',
    vaultName: 'rhINDEX-Core',
    title: 'Batch Reward Compounded',
    description: 'Liquidated AAPL, NVDA, TSLA rewards ➔ +48.50 INDEX injected into vault pool',
    amount: '+48.50 INDEX',
    txHash: '0xbe01ebbf9dbe338e74f745ac097c52a4a695c793c9aa67f78e1e6dde43b8195d',
    timestamp: Date.now() - 1000 * 25,
    gasUsed: '43.9k gas',
    executor: '0x3894...d160 (Keeper)',
  },
  {
    id: 'evt-2',
    type: 'rebalance',
    vaultId: 'rhindex-cl',
    vaultName: 'rhINDEX-CL (v4)',
    title: 'Uniswap v4 Tick Repositioned',
    description: 'Adjusted concentrated range to [1980 ➔ 2040]. EIP-1153 flash accounting settled.',
    amount: 'Pool Rebalance',
    txHash: '0x7a3f81e0129bc41235de98762f2190334812398ab7612c4489123019842189ac',
    timestamp: Date.now() - 1000 * 75,
    gasUsed: '51.2k gas',
    executor: '0x3894...d160 (Keeper)',
  },
  {
    id: 'evt-3',
    type: 'in_kind',
    vaultId: 'rhindex-growth',
    vaultName: 'rhINDEX-Growth',
    title: 'In-Kind Equity Redemption',
    description: 'User redeemed 2,500 shares for direct tokenized basket (1.5 AAPL, 0.9 NVDA, 1.2 TSLA)',
    amount: '2,500 rhINDEX',
    txHash: '0x431289fe12984abce98124018247012985172039840192840192834019283401',
    timestamp: Date.now() - 1000 * 180,
    gasUsed: '64.0k gas',
    executor: '0x71C9...8921 (User)',
  },
  {
    id: 'evt-4',
    type: 'deposit',
    vaultId: 'rhindex-core',
    vaultName: 'rhINDEX-Core',
    title: 'Vault Deposit Executed',
    description: '10,000 INDEX deposited ➔ 9,615.38 rhINDEX-Core shares minted',
    amount: '10,000 INDEX',
    txHash: '0x9918237401928340192834019283401928340192834019283401928340192834',
    timestamp: Date.now() - 1000 * 360,
    gasUsed: '38.4k gas',
    executor: '0x9F41...55A2 (User)',
  },
  {
    id: 'evt-5',
    type: 'harvest',
    vaultId: 'rhindex-growth',
    vaultName: 'rhINDEX-Growth',
    title: 'Equities Retained & Compounded',
    description: 'Allocated 70% to stock portfolio reserve, 30% liquidated into +18.20 INDEX',
    amount: '+18.20 INDEX',
    txHash: '0x1283740192834019283401928340192834019283401928340192834019283401',
    timestamp: Date.now() - 1000 * 620,
    gasUsed: '46.1k gas',
    executor: '0x3894...d160 (Keeper)',
  },
]

function getRelativeTime(timestamp: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.floor(diffMin / 60)
  return `${diffHour}h ago`
}

export function LiveActivityFeed() {
  const [events, setEvents] = useState<ProtocolEvent[]>(INITIAL_EVENTS)
  const [filter, setFilter] = useState<EventType>('all')
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true)
  const [currentBlock, setCurrentBlock] = useState<number>(98225080)

  // Load real user transactions from localStorage and prepend
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.transactions)
      if (raw) {
        const localList: TransactionRecord[] = JSON.parse(raw)
        if (localList.length > 0) {
          const userEvents: ProtocolEvent[] = localList.slice(0, 5).map((tx) => {
            const vaultConfig = VAULTS.find((v) => v.address.toLowerCase() === tx.vault.toLowerCase())
            return {
              id: `user-${tx.hash}`,
              type: tx.kind === 'harvest' ? 'harvest' : tx.kind === 'rebalance' ? 'rebalance' : tx.kind === 'redeemInKind' ? 'in_kind' : tx.kind === 'deposit' ? 'deposit' : 'withdraw',
              vaultId: vaultConfig?.id ?? 'rhindex-core',
              vaultName: vaultConfig?.name ?? 'Robin Vault',
              title: tx.kind === 'harvest' ? 'User Triggered Harvest' : tx.kind === 'rebalance' ? 'User Triggered Rebalance' : tx.kind === 'deposit' ? 'User Deposit' : 'User Redemption',
              description: `Executed on Robinhood Chain testnet (amount: ${tx.amount} ${tx.symbol})`,
              amount: `${tx.amount} ${tx.symbol}`,
              txHash: tx.hash,
              timestamp: tx.timestamp,
              gasUsed: '42.8k gas',
              executor: 'You (Connected Wallet)',
            }
          })
          setEvents((prev) => {
            const merged = [...userEvents, ...prev.filter((p) => !userEvents.some((u) => u.txHash === p.txHash))]
            return merged.sort((a, b) => b.timestamp - a.timestamp)
          })
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Live Keeper Stream Simulation
  useEffect(() => {
    if (!isLiveStreaming) return

    const interval = setInterval(() => {
      setCurrentBlock((prev) => prev + Math.floor(Math.random() * 2) + 1)

      const generators: Array<() => ProtocolEvent> = [
        () => {
          const earned = (Math.random() * 40 + 10).toFixed(2)
          return {
            id: `evt-${Date.now()}`,
            type: 'harvest',
            vaultId: 'rhindex-core',
            vaultName: 'rhINDEX-Core',
            title: 'Auto-Compound Harvest Executed',
            description: `Sold equity dividends ➔ +${earned} INDEX added to vault`,
            amount: `+${earned} INDEX`,
            txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            timestamp: Date.now(),
            gasUsed: `${(Math.random() * 8 + 38).toFixed(1)}k gas`,
            executor: '0x3894...d160 (Keeper)',
          }
        },
        () => {
          const lower = Math.floor(Math.random() * 20 + 1970)
          const upper = lower + 60
          return {
            id: `evt-${Date.now()}`,
            type: 'rebalance',
            vaultId: 'rhindex-cl',
            vaultName: 'rhINDEX-CL (v4)',
            title: 'Uniswap v4 Tick Range Adjusted',
            description: `Concentrated LP repositioned to range [${lower} ➔ ${upper}]`,
            amount: 'Tick Rebalance',
            txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            timestamp: Date.now(),
            gasUsed: `${(Math.random() * 10 + 45).toFixed(1)}k gas`,
            executor: '0x3894...d160 (Keeper)',
          }
        },
        () => {
          const dep = Math.floor(Math.random() * 5000 + 1000)
          return {
            id: `evt-${Date.now()}`,
            type: 'deposit',
            vaultId: 'rhindex-growth',
            vaultName: 'rhINDEX-Growth',
            title: 'New Vault Deposit',
            description: `${dep.toLocaleString()} INDEX deposited by investor`,
            amount: `${dep.toLocaleString()} INDEX`,
            txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            timestamp: Date.now(),
            gasUsed: '39.1k gas',
            executor: '0x' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(4, '0').toUpperCase() + '...User',
          }
        },
      ]

      const nextEvent = generators[Math.floor(Math.random() * generators.length)]()
      setEvents((prev) => [nextEvent, ...prev.slice(0, 19)])
    }, 18000)

    return () => clearInterval(interval)
  }, [isLiveStreaming])

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events
    return events.filter((e) => {
      if (filter === 'harvest') return e.type === 'harvest'
      if (filter === 'rebalance') return e.type === 'rebalance'
      if (filter === 'in_kind') return e.type === 'in_kind'
      if (filter === 'deposit' || filter === 'withdraw') return e.type === 'deposit' || e.type === 'withdraw'
      return true
    })
  }, [events, filter])

  const copyTx = (hash: string) => {
    navigator.clipboard.writeText(hash)
    toast.success('Transaction Hash Copied', { description: hash })
  }

  return (
    <div className="flex flex-col gap-5 w-full p-5 sm:p-7 rounded-3xl bg-card/45 border border-border/60 backdrop-blur-md shadow-lg relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 size-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-2xl bg-primary/10 border border-primary/25 text-primary">
            <Activity className="size-5" />
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Live Protocol Heartbeat
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time on-chain keeper executions, automated harvests & strategy rebalances.
            </p>
          </div>
        </div>

        {/* Telemetry Controls & Live Block */}
        <div className="flex items-center gap-2.5 w-fit">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-border/50 text-[11px] font-mono text-muted-foreground">
            <Radio className="size-3 text-primary animate-pulse" />
            <span>Block #{currentBlock.toLocaleString()}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isLiveStreaming
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-white/[0.02] border-border/50 text-muted-foreground hover:text-foreground'
            }`}
            title={isLiveStreaming ? 'Pause live stream' : 'Resume live stream'}
          >
            {isLiveStreaming ? (
              <>
                <Pause className="size-3" /> Streaming
              </>
            ) : (
              <>
                <Play className="size-3" /> Paused
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'all', label: 'All Activity' },
            { id: 'harvest', label: '🌾 Auto-Harvests' },
            { id: 'rebalance', label: '⚡ v4 Rebalances' },
            { id: 'in_kind', label: '🔄 In-Kind Redemptions' },
            { id: 'deposit', label: '📥 Deposits' },
          ] as const
        ).map((chip) => {
          const isSelected = filter === chip.id
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-white/[0.08] text-foreground border-primary/40 font-bold shadow-xs'
                  : 'bg-white/[0.015] text-muted-foreground border-border/40 hover:text-foreground hover:bg-white/[0.03]'
              }`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* Activity Event List */}
      <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {filteredEvents.map((evt) => {
            const isHarvest = evt.type === 'harvest'
            const isRebalance = evt.type === 'rebalance'
            const isInKind = evt.type === 'in_kind'
            const isDeposit = evt.type === 'deposit'

            const badgeColor = isHarvest
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
              : isRebalance
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
                : isInKind
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                  : 'bg-primary/10 text-primary border-primary/25'

            const Icon = isHarvest
              ? TrendingUp
              : isRebalance
                ? Zap
                : isInKind
                  ? Sparkles
                  : ArrowDownRight

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.015] border border-border/40 hover:border-primary/25 hover:bg-white/[0.03] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left Info */}
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl border shrink-0 ${badgeColor}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {evt.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.03] border border-border/50 text-muted-foreground">
                        {evt.vaultName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight truncate">
                      {evt.description}
                    </p>
                  </div>
                </div>

                {/* Right Meta & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 border-border/20 pt-2 sm:pt-0">
                  <div className="flex flex-col sm:items-end gap-0.5 font-mono text-xs">
                    {evt.amount && (
                      <span className="font-extrabold text-foreground">{evt.amount}</span>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{getRelativeTime(evt.timestamp)}</span>
                      <span>·</span>
                      <span>{evt.gasUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyTx(evt.txHash)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
                      title="Copy transaction hash"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    <a
                      href={explorerTxUrl(evt.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/[0.05] transition-colors"
                      title="Inspect on Robinhood Chain Explorer"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
