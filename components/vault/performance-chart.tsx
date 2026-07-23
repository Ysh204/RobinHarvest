'use client'

import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Address } from 'viem'
import { mockTvlHistory } from '@/lib/mock/history'

export function PerformanceChart({ address, currentTvl }: { address: Address; currentTvl: number }) {
  const data = useMemo(() => mockTvlHistory(address, Math.max(currentTvl, 100000), 30).map((point) => ({ ...point, date: new Date(point.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })), [address, currentTvl])
  return <div className="h-72 w-full" aria-label="30 day indicative TVL history chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} minTickGap={30}/><YAxis hide domain={['dataMin', 'dataMax']}/><Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 12 }} formatter={(value) => [`${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'TVL']} /><Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="var(--primary)" fillOpacity={0.08} /></AreaChart></ResponsiveContainer></div>
}
