'use client'

import { ArrowLeft, ExternalLink, Gauge, Info, ShieldCheck, WalletCards } from 'lucide-react'
import Link from 'next/link'
import type { VaultConfig } from '@/config/contracts'
import { explorerAddressUrl } from '@/config/chain'
import { useVault } from '@/hooks/use-vaults'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PerformanceChart } from './performance-chart'
import { VaultActionPanel } from './vault-action-panel'

export function VaultDetail({ vault }: { vault: VaultConfig }) {
  const { snapshot, isLoading } = useVault(vault.address)
  const tvl = snapshot?.totalAssets ?? 0
  const cap = snapshot?.depositCap ?? 0
  const capacity = cap ? Math.min((tvl / cap) * 100, 100) : 0
  return <div className="flex flex-col gap-8">
    <Button nativeButton={false} render={<Link href="/" />} variant="ghost" className="w-fit"><ArrowLeft data-icon="inline-start" />All vaults</Button>
    <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-3xl flex-col gap-4"><div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{snapshot?.paused ? 'Paused' : 'Active'}</Badge><Badge variant="outline">{vault.risk} risk</Badge><Badge variant="outline">ERC-4626</Badge></div><h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">{vault.name}</h1><p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{vault.description}</p></div>
      <Button nativeButton={false} render={<a href={explorerAddressUrl(vault.address)} target="_blank" rel="noreferrer" />} variant="outline">View contract <ExternalLink data-icon="inline-end" /></Button>
    </section>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex min-w-0 flex-col gap-6">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">{[
          ['Est. APY', `${snapshot?.apy.toFixed(2) ?? '—'}%`, Gauge],
          ['Total assets', isLoading ? 'Loading' : `${tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${vault.assetSymbol}`, WalletCards],
          ['Share price', `${snapshot?.pricePerShare?.toFixed(4) ?? '—'} ${vault.assetSymbol}`, Info],
          ['Risk profile', vault.risk, ShieldCheck],
        ].map(([label, value, Icon]) => <Card key={label as string}><CardContent className="flex flex-col gap-3 p-5"><Icon className="text-primary" aria-hidden /><span className="text-xs uppercase tracking-wider text-muted-foreground">{label as string}</span><strong className="text-base capitalize tabular">{value as string}</strong></CardContent></Card>)}</section>
        <Card><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>Vault performance</CardTitle><CardDescription>30-day indicative history anchored to current onchain TVL.</CardDescription></div><Badge variant="outline">30D</Badge></div></CardHeader><CardContent><PerformanceChart address={vault.address} currentTvl={tvl} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Capacity & strategy</CardTitle><CardDescription>How this vault deploys deposited capital.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6"><div className="flex flex-col gap-2"><div className="flex items-center justify-between gap-4 text-sm"><span>Capacity used</span><span className="tabular text-muted-foreground">{cap ? `${capacity.toFixed(1)}%` : 'Cap unavailable'}</span></div><Progress value={capacity} /></div><div className="grid gap-4 md:grid-cols-3">{[['Strategy', vault.strategyLabel], ['Asset', vault.assetSymbol], ['Compounding', 'Automated']].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 font-medium">{value}</p></div>)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Know the risks</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted-foreground">Smart contracts, underlying strategies, liquidity, and testnet infrastructure can fail. Estimated APY is variable and not guaranteed. Only deposit assets you can afford to keep exposed to these risks.</p></CardContent></Card>
      </div>
      <VaultActionPanel vault={vault} paused={snapshot?.paused} />
    </div>
  </div>
}
