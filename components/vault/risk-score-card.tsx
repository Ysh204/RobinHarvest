'use client'

import { AlertTriangle, Shield, TrendingDown, Waves } from 'lucide-react'
import type { VaultConfig } from '@/config/contracts'

export function RiskScoreCard({ vault }: { vault: VaultConfig }) {
  const getRatingColor = (level: number) => {
    if (level <= 2) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (level === 3) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    if (level === 4) return 'text-orange-400 border-orange-500/30 bg-orange-500/10'
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  }

  const getMeterDotColor = (dotIndex: number, level: number) => {
    if (dotIndex > level) return 'bg-white/[0.08]'
    if (level <= 2) return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
    if (level === 3) return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]'
    if (level === 4) return 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'
    return 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
  }

  return (
    <div className="flex flex-col gap-5 pt-1">
      {/* Risk Rating Pill + Meter */}
      <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-border/40 w-fit">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Risk Rating</span>
        <span
          className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getRatingColor(
            vault.riskLevel,
          )}`}
        >
          {vault.riskRating}
        </span>
        <div className="flex items-center gap-1.5 pl-2">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`size-2 rounded-full transition-all duration-300 ${getMeterDotColor(
                dot,
                vault.riskLevel,
              )}`}
            />
          ))}
        </div>
      </div>

      {/* Risk Factor Breakdown */}
      <div className="grid gap-3 sm:grid-cols-2">
        {vault.riskFactors.map((factor, i) => (
          <div
            key={factor.title}
            className="p-3.5 rounded-xl bg-white/[0.015] border border-border/30 flex flex-col gap-1.5 hover:border-border/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              {i === 0 ? (
                <Shield className="size-3.5 text-primary" />
              ) : i === 1 ? (
                <TrendingDown className="size-3.5 text-warning" />
              ) : i === 2 ? (
                <Waves className="size-3.5 text-accent" />
              ) : (
                <AlertTriangle className="size-3.5 text-rose-400" />
              )}
              {factor.title}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {factor.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
