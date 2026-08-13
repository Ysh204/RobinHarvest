'use client'

import { ArrowUpRight, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedNumber } from '@/components/motion/animated-number'
import { PointerCard } from '@/components/motion/pointer-card'
import { VaultStrategyVisual } from '@/components/motion/vault-strategy-visual'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { VaultSnapshot } from '@/hooks/use-vaults'
import { getVaultKind } from '@/lib/utils/vault-kind'

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })

interface VaultCardProps {
  item: VaultSnapshot
  loading: boolean
  index: number
}

export function VaultCard({ item, loading, index }: VaultCardProps) {
  const { vault, totalAssets, apy, apyAvailable } = item
  const kind = getVaultKind(vault)
  const apyLabel = apyAvailable && apy !== undefined ? `${apy.toFixed(2)}%` : 'Unavailable'

  return (
    <PointerCard delay={index * 0.08} layoutId={`vault-card-${vault.address}`}>
      <div className="flex flex-col gap-4 p-5">
        {/* Strategy visual */}
        <VaultStrategyVisual kind={kind} />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5">
              <h3 className="font-bold text-base text-foreground tracking-tight group-hover:text-primary transition-colors">
                {vault.name}
              </h3>
              {vault.isCl && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20"
                >
                  <Zap className="size-2.5 fill-primary" /> v4 CL
                </motion.span>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{vault.strategyLabel}</p>
          </div>
          <span
            className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
              vault.risk === 'low'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : vault.risk === 'medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {vault.risk.toUpperCase()}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Est. APY
            </span>
            <span className="text-sm font-bold text-primary tabular font-mono flex items-center gap-1">
              <TrendingUp className="size-3 text-primary" /> {apyLabel}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              TVL
            </span>
            {loading ? (
              <Skeleton className="h-5 w-20" />
            ) : totalAssets === undefined ? (
              <span className="text-sm font-bold text-foreground tabular font-mono">—</span>
            ) : (
              <AnimatedNumber
                value={totalAssets}
                format={(n) => compact.format(n)}
                highlightOnChange
                className="text-sm font-bold text-foreground font-mono"
              />
            )}
          </div>
        </div>

        {/* Protocol & action */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/30">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] text-muted-foreground font-mono truncate">
              {vault.protocolLabel || 'Index Finance'} · {vault.assetSymbol}
            </span>
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
    </PointerCard>
  )
}
