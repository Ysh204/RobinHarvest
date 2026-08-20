'use client'

import { useState } from 'react'
import { ArrowRight, Calculator, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface StrategyOption {
  name: string
  apy: number
  tag: string
  color: string
}

const STRATEGIES: StrategyOption[] = [
  { name: 'rhINDEX-Core', apy: 18.4, tag: '100% Compound', color: 'text-primary' },
  { name: 'rhINDEX-Growth', apy: 32.15, tag: 'Equities + INDEX', color: 'text-warning' },
  { name: 'rhINDEX-CL (v4)', apy: 68.5, tag: 'Uniswap v4 LP', color: 'text-accent' },
]

const TIMEFRAMES = [
  { label: '1 Month', months: 1 },
  { label: '6 Months', months: 6 },
  { label: '1 Year', months: 12 },
  { label: '3 Years', months: 36 },
]

export function YieldCalculator() {
  const [depositAmount, setDepositAmount] = useState<number>(5000)
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyOption>(STRATEGIES[0])
  const [selectedMonths, setSelectedMonths] = useState<number>(12)

  // Compound interest formula: A = P * (1 + r/n)^(n*t) with daily compounding (n = 365)
  const rate = selectedStrategy.apy / 100
  const years = selectedMonths / 12
  const compoundFrequency = 365
  const futureValue = depositAmount * Math.pow(1 + rate / compoundFrequency, compoundFrequency * years)
  const profit = futureValue - depositAmount
  const percentageGain = (profit / depositAmount) * 100

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-card/60 border border-border/60 backdrop-blur-md shadow-xl w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Calculator className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Interactive Compounding Simulator</h3>
            <p className="text-xs text-muted-foreground">Project your wealth growth with continuous on-chain compounding.</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/25 w-fit">
          <Sparkles className="size-3.5" /> Daily Reinvested
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-center">
        {/* Controls */}
        <div className="flex flex-col gap-6">
          {/* Strategy Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Strategy Vault
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STRATEGIES.map((strat) => {
                const isSelected = selectedStrategy.name === strat.name
                return (
                  <button
                    key={strat.name}
                    type="button"
                    onClick={() => setSelectedStrategy(strat)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-white/[0.06] border-primary/40 shadow-sm'
                        : 'bg-white/[0.015] border-border/40 hover:border-border/80 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-xs font-bold text-foreground truncate">{strat.name}</span>
                    <span className={`text-xs font-mono font-extrabold ${strat.color}`}>
                      {strat.apy.toFixed(1)}% APY
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Deposit Slider */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Initial Deposit
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] border border-border/50">
                <span className="font-mono text-sm font-extrabold text-foreground">
                  {depositAmount.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-primary font-mono">INDEX</span>
              </div>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>500 INDEX</span>
              <span>25,000 INDEX</span>
              <span>50,000 INDEX</span>
            </div>
          </div>

          {/* Timeframe Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Investment Horizon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIMEFRAMES.map((tf) => {
                const isSelected = selectedMonths === tf.months
                return (
                  <button
                    key={tf.label}
                    type="button"
                    onClick={() => setSelectedMonths(tf.months)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white/[0.02] border-border/40 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                    }`}
                  >
                    {tf.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.02] border border-border/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Zap className="size-32 text-primary" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Projected Total Value
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono tabular">
                {futureValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-bold text-primary font-mono">INDEX</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/25">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-border/30 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Projected Profit</span>
              <span className="text-base font-extrabold text-primary font-mono tabular flex items-center gap-1">
                <TrendingUp className="size-3.5" /> +{profit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-border/30 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Return</span>
              <span className="text-base font-extrabold text-foreground font-mono tabular">
                +{percentageGain.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs">
            <span className="text-muted-foreground font-medium">Underlying Strategy</span>
            <span className="font-bold text-primary font-mono">{selectedStrategy.name} ({selectedStrategy.apy}% APY)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
