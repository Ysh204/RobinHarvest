'use client'

import { ArrowLeft, ExternalLink, Gauge, Info, ShieldCheck, WalletCards, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import type { VaultConfig } from '@/config/contracts'
import { explorerAddressUrl } from '@/config/chain'
import { useVault } from '@/hooks/use-vaults'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { strategyAbi } from '@/lib/abis/strategy'
import { clStrategyAbi } from '@/lib/abis/cl-strategy'
import { saveTransaction } from '@/lib/utils/tx-history'
import { PerformanceChart } from './performance-chart'
import { VaultActionPanel } from './vault-action-panel'

function StrategyControls({ vault }: { vault: VaultConfig }) {
  const { isConnected } = useAccount()
  const writer = useWriteContract()

  async function handleAction(actionName: 'harvest' | 'rebalance' | 'tend') {
    if (!isConnected) {
      toast.error('Wallet not connected', { description: 'Please connect your wallet to execute strategy operations.' })
      return
    }
    try {
      const hash = await writer.writeContractAsync({
        address: vault.strategy,
        abi: vault.isCl ? clStrategyAbi : strategyAbi,
        functionName: actionName,
      } as any)
      saveTransaction({
        hash,
        kind: actionName,
        status: 'confirmed',
        vault: vault.address,
        amount: actionName === 'harvest' ? 'Yields' : actionName === 'rebalance' ? 'Tick Pool' : 'Check',
        symbol: vault.shareSymbol,
      })
      toast.success(`Strategy ${actionName.toUpperCase()} submitted to network`)
    } catch (err) {
      toast.error(`Failed to execute ${actionName}`, {
        description: err instanceof Error ? err.message.split('\n')[0] : 'Transaction rejected or reverted.'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="flex flex-col gap-4 p-5 rounded-xl bg-card/50 border border-border/60 backdrop-blur-md shadow-xs hover:border-primary/30 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Zap className="size-4 fill-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            {vault.isCl ? 'Uniswap v4 CL Strategy Operations' : 'Automated Strategy Controls'}
          </h3>
        </div>
        <a
          href={explorerAddressUrl(vault.strategy)}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 w-fit"
        >
          Strategy: {vault.strategy.slice(0, 6)}...{vault.strategy.slice(-4)} <ExternalLink className="size-3" />
        </a>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {vault.isCl
          ? 'Interact with the Uniswap v4 concentrated liquidity strategy. Trigger rebalances or harvest accrued pool trading fees.'
          : 'Keeper-gated strategy maintenance and reward batch compounding via on-chain access control.'}
      </p>

      {/* Uniswap v4 specific parameters grid */}
      {vault.isCl && vault.clDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-border/20 text-xs">
          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/[0.015] border border-border/30">
            <span className="text-muted-foreground text-[10px] uppercase font-bold">V4 Pool Manager</span>
            <span className="font-mono text-foreground font-semibold text-[11px] truncate">
              {vault.clDetails.poolManager.slice(0, 6)}...{vault.clDetails.poolManager.slice(-4)}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/[0.015] border border-border/30">
            <span className="text-muted-foreground text-[10px] uppercase font-bold">Position Manager</span>
            <span className="font-mono text-foreground font-semibold text-[11px] truncate">
              {vault.clDetails.positionManager.slice(0, 6)}...{vault.clDetails.positionManager.slice(-4)}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/[0.015] border border-border/30">
            <span className="text-muted-foreground text-[10px] uppercase font-bold">Pool Fee Tier</span>
            <span className="font-mono text-primary font-bold text-xs">{vault.clDetails.feeTier}</span>
          </div>
          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/[0.015] border border-border/30">
            <span className="text-muted-foreground text-[10px] uppercase font-bold">Tick Spacing</span>
            <span className="font-mono text-foreground font-bold text-xs">{vault.clDetails.tickSpacing}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
        {vault.isCl && (
          <Button
            size="sm"
            onClick={() => handleAction('rebalance')}
            disabled={writer.isPending}
            className="text-xs h-9 px-4 gap-1.5 font-bold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Zap className="size-3.5 fill-current" /> Execute v4 Rebalance
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('harvest')}
          disabled={writer.isPending}
          className="text-xs h-9 px-4 gap-1.5 border-border/80 bg-white/[0.02] hover:bg-white/[0.06] font-semibold"
        >
          🌾 Harvest & Compound
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction('tend')}
          disabled={writer.isPending}
          className="text-xs h-9 px-3 text-muted-foreground hover:text-foreground font-medium sm:ml-auto"
        >
          🔧 Tend Position
        </Button>
      </div>
    </motion.div>
  )
}

export function VaultDetail({ vault }: { vault: VaultConfig }) {
  const { snapshot, isLoading } = useVault(vault.address)
  const tvl = snapshot?.totalAssets ?? 0
  const cap = snapshot?.depositCap ?? 0
  const capacity = cap ? Math.min((tvl / cap) * 100, 100) : 0

  return (
    <div className="flex flex-col w-full">
      {/* Full-Width Vault Header Banner */}
      <section className="w-full border-b border-border/40 bg-gradient-to-b from-white/[0.03] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10">
        <div className="flex flex-col gap-4 w-full">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors w-fit">
            <ArrowLeft className="size-3.5" /> All Strategy Vaults
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between w-full"
          >
            <div className="flex flex-col gap-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-border/60 text-[11px] font-bold text-foreground shadow-xs">
                  {snapshot?.paused ? 'Paused' : 'Active'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  vault.risk === 'low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  vault.risk === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {vault.risk.toUpperCase()} RISK
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-border/60 text-[11px] font-mono font-semibold text-muted-foreground">
                  ERC-4626
                </span>
                {vault.isCl && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-extrabold text-primary flex items-center gap-1 shadow-xs">
                    <Zap className="size-3 fill-primary" /> Uniswap v4 CL
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">{vault.name}</h1>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{vault.description}</p>
            </div>
            <a
              href={explorerAddressUrl(vault.address)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground border border-border/60 rounded-xl px-4 py-2.5 bg-card/50 hover:border-primary/30 transition-all w-fit shadow-xs shrink-0 mt-1 lg:mt-0"
            >
              Vault: {vault.address.slice(0, 8)}...{vault.address.slice(-6)} <ExternalLink className="size-3 text-primary" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Centered Compact Vault Content Area */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
            {/* Executive Stats Row */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {[
                [
                  'Est. APY',
                  snapshot?.apyAvailable && snapshot.apy !== undefined
                    ? `${snapshot.apy.toFixed(2)}%`
                    : 'Unavailable',
                  Gauge,
                ],
                ['Total assets', isLoading ? 'Loading...' : `${tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${vault.assetSymbol}`, WalletCards],
                ['Share price', `${snapshot?.pricePerShare?.toFixed(4) ?? '1.0000'} ${vault.assetSymbol}`, Info],
                ['Risk profile', vault.risk, ShieldCheck],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm flex flex-col gap-1.5 hover:border-primary/30 transition-colors shadow-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] uppercase font-bold tracking-wider">{label as string}</span>
                    <Icon className="size-3.5 text-primary" aria-hidden />
                  </div>
                  <strong className="text-sm sm:text-base font-extrabold text-foreground font-mono tabular capitalize">{value as string}</strong>
                </div>
              ))}
            </motion.section>

            {/* Strategy Operations Panel with Uniswap v4 buttons */}
            <StrategyControls vault={vault} />

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-5 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm flex flex-col gap-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Vault Performance (30D)</h3>
                  <p className="text-xs text-muted-foreground">Illustrative history only — not live protocol APY/TVL.</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono border border-border/60 bg-white/[0.02] text-muted-foreground font-bold">30D</span>
              </div>
              <PerformanceChart address={vault.address} currentTvl={tvl} />
            </motion.div>

            {/* Capacity & Strategy Info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="p-5 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm flex flex-col gap-5 shadow-xs"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Capacity & Architecture</h3>
                <p className="text-xs text-muted-foreground">How this vault deploys and compounds deposited capital.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-muted-foreground font-semibold">Capacity used</span>
                  <span className="tabular font-mono text-foreground font-bold">{cap ? `${capacity.toFixed(1)}%` : 'Unlimited / No Cap Data'}</span>
                </div>
                <Progress value={capacity} className="h-2" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Strategy', vault.strategyLabel],
                  ['Underlying Asset', vault.assetSymbol],
                  ['Protocol Integration', vault.protocolLabel || 'Index Finance'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-border/40 bg-white/[0.015] p-3 flex flex-col gap-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{label}</p>
                    <p className="font-semibold text-xs text-foreground truncate">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sticky Action Panel (Deposit/Withdraw) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:sticky lg:top-20 h-fit"
          >
            <VaultActionPanel vault={vault} paused={snapshot?.paused} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

