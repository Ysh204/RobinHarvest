'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowDownRight, ArrowUpRight, Coins, Gauge, Sparkles, TrendingUp, Wallet } from 'lucide-react'
import type { Address } from 'viem'
import { mockApyHistory, mockSharePriceHistory, mockTvlHistory } from '@/lib/mock/history'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export type ChartMetric = 'APY' | 'TVL' | 'SHARE_PRICE'
export type ChartTimeframe = '7D' | '30D' | '90D' | '1Y' | 'ALL'

interface PerformanceChartProps {
  address: Address
  currentTvl: number
  defaultApy?: number
  currentSharePrice?: number
  assetSymbol?: string
  shareSymbol?: string
}

const TIMEFRAME_DAYS: Record<ChartTimeframe, number> = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
  '1Y': 365,
  ALL: 500,
}

export function PerformanceChart({
  address,
  currentTvl,
  defaultApy = 18.4,
  currentSharePrice = 1.042,
  assetSymbol = 'INDEX',
  shareSymbol = 'rhINDEX',
}: PerformanceChartProps) {
  const reduced = useReducedMotion()
  const [metric, setMetric] = useState<ChartMetric>('APY')
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('30D')
  const [activeHoverPoint, setActiveHoverPoint] = useState<{
    date: string
    value: number
    deltaPercent: number
  } | null>(null)

  const days = TIMEFRAME_DAYS[timeframe]

  // Generate historical data based on active metric & timeframe
  const rawData = useMemo(() => {
    if (metric === 'APY') {
      return mockApyHistory(address, defaultApy, days)
    }
    if (metric === 'TVL') {
      return mockTvlHistory(address, Math.max(currentTvl, 14250), days)
    }
    return mockSharePriceHistory(address, currentSharePrice, days)
  }, [address, defaultApy, currentTvl, currentSharePrice, metric, days])

  const chartData = useMemo(() => {
    const firstVal = rawData[0]?.value || 1
    return rawData.map((pt) => {
      const d = new Date(pt.time)
      const dateLabel =
        days <= 30
          ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

      const deltaPercent = ((pt.value - firstVal) / firstVal) * 100
      return {
        ...pt,
        date: dateLabel,
        fullDate: d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        deltaPercent,
      }
    })
  }, [rawData, days])

  const startValue = chartData[0]?.value ?? 0
  const latestValue = chartData[chartData.length - 1]?.value ?? 0
  const overallDeltaPercent = startValue ? ((latestValue - startValue) / startValue) * 100 : 0

  // Active display values (hovered point or latest)
  const displayVal = activeHoverPoint?.value ?? latestValue
  const displayDelta = activeHoverPoint?.deltaPercent ?? overallDeltaPercent
  const displayDate = activeHoverPoint?.date ?? 'Past ' + timeframe

  // Metric styling configurations
  const metricConfig = {
    APY: {
      label: 'Est. APY',
      icon: Gauge,
      unit: '%',
      color: '#10B981', // Emerald
      gradientId: 'apyGrad',
      format: (n: number) => `${n.toFixed(2)}%`,
    },
    TVL: {
      label: 'Total Value Locked',
      icon: Wallet,
      unit: ` ${assetSymbol}`,
      color: '#38BDF8', // Sky Blue
      gradientId: 'tvlGrad',
      format: (n: number) => `${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${assetSymbol}`,
    },
    SHARE_PRICE: {
      label: 'Share Price',
      icon: Coins,
      unit: ` ${assetSymbol}`,
      color: '#F59E0B', // Amber
      gradientId: 'shareGrad',
      format: (n: number) => `${n.toFixed(4)} ${assetSymbol}`,
    },
  }[metric]

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header Controls: Metrics & Timeframe Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-4">
        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-border/50 w-fit">
          {(
            [
              { key: 'APY', label: 'Vault APY', icon: Gauge },
              { key: 'TVL', label: 'TVL', icon: Wallet },
              { key: 'SHARE_PRICE', label: 'Share Price', icon: Coins },
            ] as const
          ).map((tab) => {
            const isSelected = metric === tab.key
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setMetric(tab.key)
                  setActiveHoverPoint(null)
                }}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none ${
                  isSelected
                    ? 'text-foreground font-extrabold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.02]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeMetricPill"
                    className="absolute inset-0 bg-white/[0.08] border border-border/80 rounded-xl shadow-xs"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <Icon className="size-3.5 relative z-10 text-primary" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-border/50 w-fit">
          {(['7D', '30D', '90D', '1Y', 'ALL'] as const).map((tf) => {
            const isSelected = timeframe === tf
            return (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setTimeframe(tf)
                  setActiveHoverPoint(null)
                }}
                className={`relative px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all select-none ${
                  isSelected
                    ? 'text-primary font-extrabold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.02]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeTimeframePill"
                    className="absolute inset-0 bg-primary/15 border border-primary/30 rounded-xl shadow-xs"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{tf}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dynamic Summary Banner */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 px-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono tabular">
            {metricConfig.format(displayVal)}
          </span>
          <div
            className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              displayDelta >= 0
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}
          >
            {displayDelta >= 0 ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {displayDelta >= 0 ? '+' : ''}
            {displayDelta.toFixed(2)}%
          </div>
        </div>

        <span className="text-xs font-mono text-muted-foreground font-medium">
          {displayDate}
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full select-none pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const pt = state.activePayload[0].payload
                setActiveHoverPoint({
                  date: pt.fullDate,
                  value: pt.value,
                  deltaPercent: pt.deltaPercent,
                })
              }
            }}
            onMouseLeave={() => setActiveHoverPoint(null)}
          >
            <defs>
              <linearGradient id="chartMetricGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metricConfig.color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={metricConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" opacity={0.5} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'ui-monospace, monospace' }}
              minTickGap={35}
            />

            <YAxis hide domain={['dataMin * 0.96', 'dataMax * 1.04']} />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="p-3 rounded-xl bg-card/95 border border-border/80 shadow-2xl backdrop-blur-md flex flex-col gap-1 text-xs font-mono">
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        {data.fullDate}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm">
                          {metricConfig.format(data.value)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            data.deltaPercent >= 0 ? 'text-emerald-400 bg-emerald-500/15' : 'text-rose-400 bg-rose-500/15'
                          }`}
                        >
                          {data.deltaPercent >= 0 ? '+' : ''}
                          {data.deltaPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={metricConfig.color}
              strokeWidth={2.2}
              fill="url(#chartMetricGrad)"
              isAnimationActive={!reduced}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
