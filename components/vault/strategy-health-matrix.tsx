'use client'

import { Activity, CheckCircle2, Flame, Layers } from 'lucide-react'
import type { VaultConfig } from '@/config/contracts'

export function StrategyHealthMatrix({ vault }: { vault: VaultConfig }) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.02] border border-border/40">
      <div className="flex items-center justify-between border-b border-border/30 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Strategy Telemetry & Health
          </h4>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-primary" />
          </span>
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Execution Status</span>
          <span className="font-mono font-bold text-foreground">99.85% (Optimal)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Allocation</span>
          <span className="font-mono font-bold text-foreground truncate">{vault.allocation}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Compounding Model</span>
          <span className="font-mono font-bold text-foreground truncate">{vault.compounding}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Performance Fee</span>
          <span className="font-mono font-bold text-primary">{vault.performanceFee}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">In-Kind Redeem</span>
          <span className="font-mono font-bold text-foreground">
            {vault.supportsInKindRedeem ? 'Enabled (Raw Assets)' : 'Disabled (Single Asset)'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Contract Security</span>
          <span className="font-mono font-bold text-emerald-400">Verified Access Control</span>
        </div>
      </div>
    </div>
  )
}
