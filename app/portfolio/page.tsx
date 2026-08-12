'use client'

import { ArrowUpRight, BriefcaseBusiness, PieChart, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useVaults } from '@/hooks/use-vaults'

export default function PortfolioPage() {
  const { snapshots, connected } = useVaults()
  const positions = snapshots.filter((item) => (item.shareBalance ?? 0) > 0)
  const total = positions.reduce((sum, item) => sum + (item.shareBalance ?? 0) * (item.pricePerShare ?? 1), 0)
  const projectedYield = positions.some((item) => item.apyAvailable && item.apy !== undefined)
    ? positions.reduce(
        (sum, item) =>
          sum + ((item.shareBalance ?? 0) * (item.pricePerShare ?? 1)) * ((item.apy ?? 0) / 100),
        0,
      )
    : undefined

  if (!connected) {
    return (
      <div className="flex flex-col w-full">
        <section className="w-full border-b border-border/40 bg-gradient-to-b from-white/[0.03] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-3xl flex-col gap-2">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Your Active Positions</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">Portfolio Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Connect your wallet to inspect active yield strategies and real-time compounding performance.</p>
          </motion.div>
        </section>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center gap-4 py-20 border border-border/60 bg-card/40 rounded-2xl backdrop-blur-md text-center shadow-xs">
            <div className="p-3.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <BriefcaseBusiness className="size-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h2 className="text-base font-bold text-foreground">Connect to View Positions</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">Live balances and share exchange ratios are retrieved straight from Robinhood Chain.</p>
            </div>
            <div className="mt-2">
              <ConnectWallet className="h-10 px-5 text-xs font-bold shadow-sm" />
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      {/* Full-Width Executive Header */}
      <section className="w-full border-b border-border/40 bg-gradient-to-b from-white/[0.03] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between w-full">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-3xl flex-col gap-2">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Onchain Wealth & Capital</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">Portfolio Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">A live cryptographic overview of your Robin Harvest vault share allocations and compound yield rates.</p>
          </motion.div>
        </div>
      </section>

      {/* Centered Compact Positions Area */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-10 flex flex-col gap-8">
        {/* Executive Overview Cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md flex flex-col justify-between gap-4 md:col-span-2 shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Aggregate Valuation</span>
              <strong className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tabular">{total.toLocaleString(undefined, { maximumFractionDigits: 2 })} INDEX</strong>
            </div>
            <div className="flex items-center gap-2 text-xs text-primary font-semibold border-t border-border/30 pt-3.5">
              <PieChart className="size-4" /> Capital distributed across {positions.length} active {positions.length === 1 ? 'strategy vault' : 'strategy vaults'}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md flex flex-col justify-between gap-4 shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" /> Est. Annual Yield
              </span>
              <strong className="text-2xl sm:text-3xl font-extrabold font-mono text-primary tabular">
                {projectedYield !== undefined
                  ? `+${projectedYield.toFixed(2)} INDEX`
                  : 'Unavailable'}
              </strong>
            </div>
            <p className="text-[11px] text-muted-foreground border-t border-border/30 pt-3.5 font-medium">
              {projectedYield !== undefined
                ? 'Estimated from on-chain profit unlock rate when available.'
                : 'APY is not exposed on-chain; yield projection unavailable.'}
            </p>
          </motion.div>
        </section>

        {positions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-4 py-16 border border-border/60 bg-card/30 rounded-2xl text-center backdrop-blur-sm">
            <div className="p-3.5 rounded-full bg-white/[0.04] border border-border/60 text-muted-foreground">
              <BriefcaseBusiness className="size-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-sm font-bold text-foreground">No Active Vault Positions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Deposit tokens into our automated yield vaults or Uniswap v4 concentrated liquidity strategies to start accumulating compound interest.</p>
            </div>
            <Link href="/" className="mt-2">
              <Button size="sm" className="text-xs font-bold h-10 px-5 shadow-sm">Explore Yield Strategies</Button>
            </Link>
          </motion.div>
        ) : (
          <section className="flex flex-col gap-3.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Active Positions</h2>
            <div className="flex flex-col gap-3.5">
              {positions.map((item, index) => {
                const value = (item.shareBalance ?? 0) * (item.pricePerShare ?? 1)
                const alloc = total ? ((value / total) * 100).toFixed(1) : '0'
                return (
                  <motion.div
                    key={item.vault.address}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between hover:border-primary/40 hover:bg-card/70 transition-all shadow-xs"
                  >
                    <div className="flex flex-col gap-1 min-w-[200px]">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-bold text-sm sm:text-base text-foreground">{item.vault.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-border/60 bg-white/[0.03] text-muted-foreground">{item.vault.assetSymbol}</span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{item.shareBalance?.toLocaleString(undefined, { maximumFractionDigits: 4 })} vault shares</p>
                    </div>

                    <div className="w-full max-w-xs flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted-foreground font-medium">Allocation</span>
                        <span className="text-foreground font-bold">{alloc}%</span>
                      </div>
                      <Progress value={total ? value / total * 100 : 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 text-right border-t border-border/20 md:border-none pt-3 md:pt-0">
                      <span className="text-base font-extrabold font-mono tabular text-foreground">{value.toLocaleString(undefined, { maximumFractionDigits: 2 })} {item.vault.assetSymbol}</span>
                      <Link href={`/vaults/${item.vault.address}`} className="w-auto">
                        <Button variant="outline" size="sm" className="h-9 text-xs font-semibold gap-1.5 px-3.5 border-border/80 bg-white/[0.02] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                          Manage Position <ArrowUpRight className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
