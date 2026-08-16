'use client'

import { ArrowRight, Layers, RefreshCw, Repeat, ShieldCheck, Zap } from 'lucide-react'
import type { VaultConfig } from '@/config/contracts'
import { StockTicker } from './stock-ticker'

export function StrategyEngineVisual({ vault }: { vault: VaultConfig }) {
  if (vault.id === 'rhindex-core') {
    return (
      <div className="flex flex-col gap-6 pt-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Zap className="size-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground">100% Reward Liquidation</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every tokenized stock reward received by the vault is automatically sold and compounded into INDEX.
          </p>

          {/* Flow Diagram */}
          <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-border/40 w-fit">
            <StockTicker widthClass="w-20" />
            <div className="flex items-center text-primary animate-pulse">
              <ArrowRight className="size-3.5" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground px-2 py-1 rounded-lg bg-white/[0.03]">
              Sell
            </span>
            <div className="flex items-center text-primary animate-pulse">
              <ArrowRight className="size-3.5" />
            </div>
            <span className="text-xs font-bold font-mono text-foreground px-2.5 py-1 rounded-lg bg-white/[0.06] border border-border/50">
              ETH
            </span>
            <div className="flex items-center text-primary animate-pulse">
              <ArrowRight className="size-3.5" />
            </div>
            <span className="text-xs font-extrabold font-mono text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 shadow-sm">
              Buy INDEX
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/30 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <Repeat className="size-3.5 text-primary" /> Auto Compounding
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Newly acquired INDEX is deposited back into the vault, increasing total INDEX share value.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/30 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <Layers className="size-3.5 text-primary" /> Batch Execution
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Reward assets from all participants are aggregated before swaps to reduce gas and slippage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/30 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <RefreshCw className="size-3.5 text-primary" /> Smart Rebalancing
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              The vault continuously scales future stock distributions alongside growing principal.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (vault.id === 'rhindex-growth') {
    return (
      <div className="flex flex-col gap-6 pt-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-warning/10 text-warning">
              <Zap className="size-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Dynamic Reward Allocation & Partial Compounding</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Each tokenized equity reward is split: a configurable percentage is held for equity upside, while the rest is sold to compound INDEX.
          </p>

          {/* Growth Flow Diagram */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-border/40 w-fit">
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1 border border-border/40">
              <StockTicker prefix="100 " widthClass="w-24" />
            </div>
            <div className="flex flex-col gap-1 text-primary">
              <ArrowRight className="size-3 -rotate-12" />
              <ArrowRight className="size-3 rotate-12" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono font-bold text-foreground bg-white/[0.06] px-2.5 py-0.5 rounded-full border border-border/50">
                70% Hold (Equities)
              </span>
              <span className="text-[11px] font-mono font-bold text-muted-foreground bg-white/[0.03] px-2.5 py-0.5 rounded-full">
                30% Sell
              </span>
            </div>
            <div className="flex items-center text-primary animate-pulse">
              <ArrowRight className="size-3.5" />
            </div>
            <span className="text-xs font-extrabold font-mono text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 shadow-sm">
              Buy INDEX
            </span>
          </div>
        </div>

        {/* Configurable Allocation Bands */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-border/40 flex flex-col gap-2 max-w-sm">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Configurable Allocation Limits
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-border/20">
              <span className="text-muted-foreground">Minimum Sell</span>
              <span className="font-mono font-bold text-foreground">10%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-border/20">
              <span className="text-muted-foreground">Maximum Sell</span>
              <span className="font-mono font-bold text-foreground">50%</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            The strategy guarantees controlled liquidation bounds so equity exposure is preserved.
          </p>
        </div>
      </div>
    )
  }

  // Uniswap v4 CL Vault
  return (
    <div className="flex flex-col gap-6 pt-1">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Zap className="size-4" />
          </div>
          <h4 className="text-sm font-bold text-foreground">Uniswap v4 Concentrated Liquidity & EIP-1153</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Automated market making engine deploys active capital across optimal tick bands with transient storage flash rebalancing.
        </p>

        {/* CL Flow Diagram */}
        <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-border/40 w-fit">
          <span className="text-xs font-bold font-mono text-foreground px-2.5 py-1 rounded-lg bg-white/[0.06] border border-border/50">
            Trading Fees (0.30%)
          </span>
          <div className="flex items-center text-primary animate-pulse">
            <ArrowRight className="size-3.5" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground px-2 py-1 rounded-lg bg-white/[0.03]">
            Auto-Compound
          </span>
          <div className="flex items-center text-primary animate-pulse">
            <ArrowRight className="size-3.5" />
          </div>
          <span className="text-xs font-extrabold font-mono text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 shadow-sm">
            + LP Position
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/30 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
            <RefreshCw className="size-3.5 text-primary" /> Dynamic Tick Rebalancing
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Monitors spot price and automatically adjusts bounds within Tick Spacing 60 to maximize fee capture.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/30 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
            <ShieldCheck className="size-3.5 text-primary" /> EIP-1153 Flash Accounting
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Gas-optimized single-transaction settlement with transient storage for minimal protocol overhead.
          </p>
        </div>
      </div>
    </div>
  )
}
