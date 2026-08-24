'use client'

import { CircleDollarSign, Layers3, Radio, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedNumber } from '@/components/motion/animated-number'
import { CapitalFlowVisual } from '@/components/motion/capital-flow-visual'
import { ViewportItem, ViewportSection } from '@/components/motion/viewport-section'
import { VaultCard } from '@/components/vault/vault-card'
import { Button } from '@/components/ui/button'
import { useVaults } from '@/hooks/use-vaults'
import { staggerContainer, staggerItem } from '@/lib/constants/motion'
import { LiveActivityFeed } from './live-activity-feed'

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })

export function Dashboard() {
  const { snapshots, isLoading, isError, refetch } = useVaults()
  const total = snapshots.reduce((sum, item) => sum + (item.totalAssets ?? 0), 0)
  const weightedApy = snapshots.filter((s) => s.apyAvailable && s.apy !== undefined)
  const avgApy = weightedApy.length
    ? weightedApy.reduce((sum, item) => sum + (item.apy ?? 0), 0) / weightedApy.length
    : undefined

  return (
    <div className="flex flex-col w-full">
      {/* Hero with capital flow visual */}
      <section className="relative w-full border-b border-border/40 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-10 md:py-14 overflow-hidden">
        <CapitalFlowVisual className="absolute right-0 top-0 hidden h-full w-[280px] opacity-40 lg:block xl:w-[360px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-3xl flex-col gap-4"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary/90 bg-primary/8 border border-primary/15 px-3 py-1.5 rounded-full w-fit">
              <Radio className="size-3.5 shrink-0 motion-safe:animate-pulse" style={{ animationDuration: '3s' }} />
              <span>Robinhood Chain · ERC-4626 Vaults</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.08]">
              Yield Optimizer &{' '}
              <span className="text-primary">Uniswap v4 Strategies</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Institutional-grade ERC-4626 automated vaults. Non-custodial capital compounding,
              batch reward liquidations, and dynamic concentrated liquidity repositioning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-stretch gap-3 w-full sm:w-auto"
          >
            <div className="flex-1 sm:flex-initial min-w-[150px] p-5 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl flex flex-col gap-1.5 shadow-sm hover:border-primary/20 transition-colors">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CircleDollarSign className="size-4 text-primary" /> Protocol TVL
              </span>
              <strong className="text-xl md:text-2xl font-extrabold tabular text-foreground font-mono">
                {isLoading ? (
                  '—'
                ) : (
                  <>
                    <AnimatedNumber value={total} format={(n) => compact.format(n)} highlightOnChange />{' '}
                    INDEX
                  </>
                )}
              </strong>
            </div>
            <div className="flex-1 sm:flex-initial min-w-[140px] p-5 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl flex flex-col gap-1.5 shadow-sm hover:border-primary/20 transition-colors">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" /> Avg. APY
              </span>
              <strong className="text-xl md:text-2xl font-extrabold tabular text-primary font-mono">
                {avgApy !== undefined ? `${avgApy.toFixed(2)}%` : 'Unavailable'}
              </strong>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 md:py-12 flex flex-col gap-10">
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-destructive/30 bg-destructive/8 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-destructive-foreground"
          >
            <span>Live vault reads are temporarily unavailable.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 text-xs shrink-0">
              Retry
            </Button>
          </motion.div>
        )}

        {/* Vault cards grid */}
        <section id="vaults" className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers3 className="size-4 text-primary" /> Strategy Vaults ({snapshots.length})
            </h2>
            <span className="text-xs font-semibold text-muted-foreground font-mono bg-white/[0.02] px-2.5 py-1 rounded-lg border border-border/40">
              Chain ID: 46630
            </span>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {snapshots.map((item, index) => (
              <motion.div key={item.vault.address} variants={staggerItem}>
                <VaultCard item={item} loading={isLoading} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Live Protocol Activity Feed (Heartbeat) */}
        <section id="activity-feed">
          <LiveActivityFeed />
        </section>

        {/* Feature highlights with scroll reveal */}
        <ViewportSection className="grid gap-4 grid-cols-1 md:grid-cols-3 pt-2">
          {[
            ['Uniswap v4 Concentrated Liquidity', 'Automated liquidity repositioning across optimal tick ranges with EIP-1153 transient flash accounting.', Zap],
            ['Non-Custodial & Verified', 'User assets remain in secure ERC-4626 vaults; strategies never take direct token custody.', ShieldCheck],
            ['Gas-Optimized Batch Harvest', 'Aggregate user reward distributions before DEX swaps to maximize compounding yield.', Sparkles],
          ].map(([title, copy, Icon]) => (
            <ViewportItem key={title as string}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm flex flex-col gap-3 h-full hover:border-primary/25 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                  <div className="p-2 rounded-xl bg-primary/8 border border-primary/15 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <span>{title as string}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{copy as string}</p>
              </motion.div>
            </ViewportItem>
          ))}
        </ViewportSection>
      </div>
    </div>
  )
}
