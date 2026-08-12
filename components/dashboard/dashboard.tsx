'use client'

import { ArrowUpRight, CircleDollarSign, Layers3, Radio, ShieldCheck, Sparkles, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useVaults, type VaultSnapshot } from '@/hooks/use-vaults'

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })

function VaultRow({ item, loading, index }: { item: VaultSnapshot; loading: boolean; index: number }) {
  const { vault, totalAssets, apy, apyAvailable } = item
  const apyLabel = apyAvailable && apy !== undefined ? `${apy.toFixed(2)}%` : 'Unavailable'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
      className="group border-b border-border/40 hover:bg-white/[0.02] transition-all duration-200 last:border-none"
    >
      {/* Desktop Terminal Row (Visible only on md+ screens) */}
      <div className="hidden md:grid md:grid-cols-12 items-center gap-4 py-4 px-5">
        {/* Vault & Strategy Name */}
        <div className="col-span-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground tracking-tight flex items-center gap-1.5 group-hover:text-primary transition-colors">
              {vault.name}
              {vault.isCl && (
                <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary border border-primary/30 shadow-xs">
                  <Zap className="size-2.5 fill-primary" /> v4 CL
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground font-mono">({vault.shareSymbol})</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{vault.strategyLabel}</p>
        </div>

        {/* Protocol / Underlying */}
        <div className="col-span-3 flex flex-col gap-0.5">
          <span className="text-xs text-foreground font-medium">{vault.protocolLabel || 'Index Finance'}</span>
          <span className="text-[11px] text-muted-foreground font-mono">{vault.assetSymbol}</span>
        </div>

        {/* Risk Profile */}
        <div className="col-span-1 flex items-center">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
            vault.risk === 'low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            vault.risk === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {vault.risk.toUpperCase()}
          </span>
        </div>

        {/* APY */}
        <div className="col-span-2 flex flex-col">
          <span className="text-sm font-bold text-primary tabular font-mono flex items-center gap-1">
            <TrendingUp className="size-3 text-primary" /> {apyLabel}
          </span>
        </div>

        {/* TVL & Action Button */}
        <div className="col-span-2 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {loading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-sm font-semibold text-foreground tabular font-mono">
                {totalAssets === undefined ? '—' : `${compact.format(totalAssets)}`}
              </span>
            )}
          </div>
          <Link href={`/vaults/${vault.address}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-medium px-3 gap-1 border-border/80 bg-white/[0.02] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              Manage <ArrowUpRight className="size-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Strategy Card (Visible below md screens for optimal Touch & Reading UX) */}
      <div className="md:hidden flex flex-col gap-3.5 p-4 bg-white/[0.01]">
        <div className="flex items-start justify-between gap-2 border-b border-border/30 pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-bold text-sm text-foreground">{vault.name}</span>
              {vault.isCl && (
                <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary border border-primary/30">
                  <Zap className="size-2.5 fill-primary" /> v4
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">{vault.strategyLabel} · {vault.assetSymbol}</span>
          </div>
          <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
            vault.risk === 'low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            vault.risk === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {vault.risk.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">Est. APY</span>
            <span className="text-base font-bold text-primary tabular font-mono flex items-center gap-1">
              <TrendingUp className="size-3.5 text-primary" /> {apyLabel}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">Protocol TVL</span>
            {loading ? (
              <Skeleton className="h-5 w-20 mt-1" />
            ) : (
              <span className="text-base font-bold text-foreground tabular font-mono">
                {totalAssets === undefined ? '—' : `${compact.format(totalAssets)}`}
              </span>
            )}
          </div>
        </div>

        <Link href={`/vaults/${vault.address}`} className="w-full mt-1">
          <Button
            className="w-full h-10 text-xs font-semibold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Manage Position <ArrowUpRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

export function Dashboard() {
  const { snapshots, isLoading, isError, refetch } = useVaults()
  const total = snapshots.reduce((sum, item) => sum + (item.totalAssets ?? 0), 0)
  const weightedApy = snapshots.filter((s) => s.apyAvailable && s.apy !== undefined)
  const avgApy = weightedApy.length
    ? weightedApy.reduce((sum, item) => sum + (item.apy ?? 0), 0) / weightedApy.length
    : undefined

  return (
    <div className="flex flex-col w-full">
      {/* Full-Width Executive Hero Banner with Entrance Animations */}
      <section className="w-full border-b border-border/40 bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-12 overflow-hidden relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex max-w-3xl flex-col gap-3.5"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit shadow-xs">
              <Radio className="size-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span>Robinhood Chain · ERC-4626 Vaults</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Yield Optimizer & <span className="text-primary bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Uniswap v4 Strategies</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Institutional-grade ERC-4626 automated vaults. Non-custodial capital compounding, batch reward liquidations, and dynamic concentrated liquidity repositioning.
            </p>
          </motion.div>
          
          {/* Executive statistics with animated slide-up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
            className="flex items-center gap-3 w-full sm:w-auto mt-2 lg:mt-0"
          >
            <div className="flex-1 sm:flex-initial min-w-[150px] p-4 bg-card/60 backdrop-blur-md border border-border/60 rounded-xl flex flex-col gap-1 shadow-sm hover:border-primary/30 transition-all">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CircleDollarSign className="size-4 text-primary" /> Protocol TVL
              </span>
              <strong className="text-lg md:text-xl font-extrabold tabular text-foreground font-mono">
                {isLoading ? '—' : `${compact.format(total)} INDEX`}
              </strong>
            </div>
            <div className="flex-1 sm:flex-initial min-w-[140px] p-4 bg-card/60 backdrop-blur-md border border-border/60 rounded-xl flex flex-col gap-1 shadow-sm hover:border-primary/30 transition-all">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary animate-spin" style={{ animationDuration: '6s' }} /> Avg. APY
              </span>
              <strong className="text-lg md:text-xl font-extrabold tabular text-primary font-mono">
                {avgApy !== undefined ? `${avgApy.toFixed(2)}%` : 'Unavailable'}
              </strong>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Centered Compact Content Area */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-10 flex flex-col gap-8">
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-destructive/40 bg-destructive/10 rounded-xl p-4 flex items-center justify-between text-xs text-rose-300"
          >
            <span>Live vault reads are temporarily unavailable. Showing fallback estimates.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="h-7 text-xs">Retry</Button>
          </motion.div>
        )}

        {/* Minimalist Table & Mobile Card Section */}
        <section id="vaults" className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers3 className="size-4 text-primary" /> Deployed Strategy Vaults ({snapshots.length})
            </h2>
            <span className="text-xs font-semibold text-muted-foreground font-mono bg-white/[0.03] px-2.5 py-1 rounded-md border border-border/40">
              Chain ID: 46630
            </span>
          </div>

          {/* Seamless table container with motion reveal */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card/40 border border-border/60 rounded-xl overflow-hidden shadow-sm backdrop-blur-md"
          >
            {/* Table Header (Desktop only) */}
            <div className="hidden md:grid md:grid-cols-12 items-center gap-4 px-5 py-3.5 bg-white/[0.03] border-b border-border/60 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-4">Vault & Strategy</div>
              <div className="col-span-3">Protocol / Asset</div>
              <div className="col-span-1">Risk</div>
              <div className="col-span-2">Est. APY</div>
              <div className="col-span-2">TVL / Action</div>
            </div>

            {/* Table Rows / Mobile Cards */}
            <div className="flex flex-col divide-y divide-border/20">
              {snapshots.map((item, index) => (
                <VaultRow key={item.vault.address} item={item} loading={isLoading} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Animated Feature Highlights */}
        <section className="grid gap-4 grid-cols-1 md:grid-cols-3 pt-2">
          {[
            ['Uniswap v4 Concentrated Liquidity', 'Automated liquidity repositioning across optimal tick ranges with EIP-1153 transient flash accounting.', Zap],
            ['Non-Custodial & Verified', 'User assets remain in secure ERC-4626 vaults; strategies never take direct token custody.', ShieldCheck],
            ['Gas-Optimized Batch Harvest', 'Aggregate user reward distributions before DEX swaps to maximize compounding yield.', Sparkles],
          ].map(([title, copy, Icon], idx) => (
            <motion.div
              key={title as string}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -3 }}
              transition={{ duration: 0.25, delay: 0.2 + idx * 0.1 }}
              className="p-5 rounded-xl border border-border/50 bg-white/[0.015] backdrop-blur-sm flex flex-col gap-2 transition-colors hover:border-primary/40 hover:bg-card/60 shadow-xs"
            >
              <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <span>{title as string}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-1">{copy as string}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  )
}

