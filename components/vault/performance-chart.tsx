'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Address } from 'viem'
import { IS_PRODUCTION } from '@/config/env'
import { mockTvlHistory } from '@/lib/mock/history'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

function ChartSkeleton() {
  return (
    <div className="flex h-72 w-full flex-col justify-end gap-1 rounded-xl border border-border/40 bg-white/[0.01] p-4" aria-hidden>
      <div className="flex items-end gap-1 h-48">
        {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 48, 90].map((h, i) => (
          <div
            key={i}
            className="flex-1 skeleton-shimmer rounded-t-sm"
            style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function AnimatedAreaChart({ data }: { data: Array<{ date: string; value: number }> }) {
  const reduced = useReducedMotion()
  const [revealed, setRevealed] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setRevealed(true)
      return
    }
    const timer = setTimeout(() => setRevealed(true), 100)
    return () => clearTimeout(timer)
  }, [reduced])

  const displayData = revealed ? data : data.map((d, i) => ({ ...d, value: i === 0 ? d.value : data[0].value }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-72 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            minTickGap={30}
          />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              fontSize: 12,
              fontFamily: 'ui-monospace, monospace',
            }}
            formatter={(value) => [
              `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              'TVL',
            ]}
            animationDuration={200}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#tvlGradient)"
            isAnimationActive={!reduced}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function PerformanceChart({ address, currentTvl }: { address: Address; currentTvl: number }) {
  const [loading, setLoading] = useState(true)
  const data = useMemo(
    () =>
      mockTvlHistory(address, Math.max(currentTvl, 0), 30).map((point) => ({
        ...point,
        date: new Date(point.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
    [address, currentTvl],
  )

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [address])

  if (IS_PRODUCTION) {
    return (
      <div
        className="flex h-72 w-full items-center justify-center rounded-xl border border-border/40 bg-white/[0.01] px-6 text-center text-xs text-muted-foreground"
        aria-label="Historical TVL chart unavailable in production"
      >
        Historical TVL chart is unavailable. Use the live TVL figure above.
      </div>
    )
  }

  if (loading) return <ChartSkeleton />

  return (
    <div aria-label="30 day indicative TVL history chart">
      <AnimatedAreaChart data={data} />
    </div>
  )
}
