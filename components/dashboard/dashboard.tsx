'use client'

import { ArrowUpRight, CircleDollarSign, Layers3, Radio, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useVaults, type VaultSnapshot } from '@/hooks/use-vaults'

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })

function VaultCard({ item, loading }: { item: VaultSnapshot; loading: boolean }) {
  const { vault, totalAssets, depositCap, apy, pricePerShare, paused } = item
  const capacity = totalAssets && depositCap ? Math.min((totalAssets / depositCap) * 100, 100) : 0
  return (
    <Card className="group bg-card/80 transition-colors hover:border-primary/40">
      <CardHeader className="gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Layers3 aria-hidden />
            </span>
            <div>
              <CardTitle>{vault.name}</CardTitle>
              <CardDescription>{vault.strategyLabel}</CardDescription>
            </div>
          </div>
          <Badge variant={paused ? 'destructive' : 'secondary'}>{paused ? 'Paused' : 'Active'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Est. APY</p>
            <p className="mt-1 font-display text-2xl font-semibold text-primary tabular">{apy.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">TVL</p>
            {loading ? <Skeleton className="mt-2 h-7 w-24" /> : <p className="mt-1 text-xl font-semibold tabular">{totalAssets === undefined ? 'Unavailable' : `${compact.format(totalAssets)} ${vault.assetSymbol}`}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Vault capacity</span><span className="tabular">{depositCap ? `${capacity.toFixed(0)}%` : 'No cap data'}</span>
          </div>
          <Progress value={capacity} />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">1 share ≈ {pricePerShare?.toFixed(4) ?? '—'} {vault.assetSymbol}</span>
          <Button nativeButton={false} render={<Link href={`/vaults/${vault.address}`} />} variant="ghost" size="sm">
            View vault <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { snapshots, isLoading, isError, refetch } = useVaults()
  const total = snapshots.reduce((sum, item) => sum + (item.totalAssets ?? 0), 0)
  const weightedApy = snapshots.length ? snapshots.reduce((sum, item) => sum + item.apy, 0) / snapshots.length : 0
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-8 py-8 lg:flex-row lg:items-end lg:justify-between lg:py-14">
        <div className="flex max-w-3xl flex-col gap-5">
          <Badge variant="outline" className="w-fit"><Radio /> Live on Robinhood Chain testnet</Badge>
          <h1 className="text-balance font-display text-4xl font-semibold tracking-tight md:text-6xl">Put idle assets to work, <span className="text-primary">automatically.</span></h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">Institutional-grade ERC-4626 vaults that deploy, compound, and rebalance your positions while you retain custody.</p>
          <div className="flex flex-wrap gap-3">
            <Button nativeButton={false} render={<Link href="#vaults" />} size="lg">Explore vaults <ArrowUpRight data-icon="inline-end" /></Button>
            <Button nativeButton={false} render={<Link href="/portfolio" />} size="lg" variant="outline">View portfolio</Button>
          </div>
        </div>
        <div className="grid min-w-full grid-cols-2 gap-3 lg:min-w-[360px]">
          <Card><CardContent className="flex flex-col gap-2 p-5"><CircleDollarSign className="text-primary" /><span className="text-sm text-muted-foreground">Protocol TVL</span><strong className="text-2xl tabular">{isLoading ? '—' : compact.format(total)}</strong></CardContent></Card>
          <Card><CardContent className="flex flex-col gap-2 p-5"><Sparkles className="text-primary" /><span className="text-sm text-muted-foreground">Avg. APY</span><strong className="text-2xl tabular">{weightedApy.toFixed(2)}%</strong></CardContent></Card>
        </div>
      </section>

      {isError && <Card className="border-destructive"><CardContent className="flex items-center justify-between gap-4 p-5"><p className="text-sm">Live vault reads are temporarily unavailable.</p><Button variant="outline" onClick={() => refetch()}>Retry</Button></CardContent></Card>}

      <section id="vaults" className="flex scroll-mt-24 flex-col gap-5">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-primary">Curated strategies</p><h2 className="mt-1 text-2xl font-semibold md:text-3xl">Choose your vault</h2></div><span className="hidden text-sm text-muted-foreground sm:block">3 active strategies</span></div>
        <div className="grid gap-4 lg:grid-cols-3">{snapshots.map((item) => <VaultCard key={item.vault.address} item={item} loading={isLoading} />)}</div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[['Non-custodial', 'Assets remain in transparent smart contracts.', ShieldCheck], ['Automated', 'Strategies harvest and compound without manual upkeep.', Sparkles], ['Standardized', 'ERC-4626 shares keep deposits and withdrawals composable.', Layers3]].map(([title, copy, Icon]) => <Card key={title as string}><CardHeader><Icon className="text-primary" aria-hidden /><CardTitle className="mt-3">{title as string}</CardTitle><CardDescription>{copy as string}</CardDescription></CardHeader></Card>)}
      </section>
    </div>
  )
}
