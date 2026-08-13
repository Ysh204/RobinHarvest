'use client'

import { ArrowLeft, ExternalLink, Gauge, Info, ShieldCheck, WalletCards, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import type { VaultConfig } from '@/config/contracts'
import { explorerAddressUrl } from '@/config/chain'
import { useVault } from '@/hooks/use-vaults'
import { AnimatedNumber } from '@/components/motion/animated-number'
import { ClRangeVisual } from '@/components/motion/cl-range-visual'
import { CompoundingVisual } from '@/components/motion/compounding-visual'
import { GrowthPortfolioVisual } from '@/components/motion/growth-portfolio-visual'
import { VaultStrategyVisual } from '@/components/motion/vault-strategy-visual'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { strategyAbi } from '@/lib/abis/strategy'
import { clStrategyAbi } from '@/lib/abis/cl-strategy'
import { saveTransaction } from '@/lib/utils/tx-history'
import { getVaultKind } from '@/lib/utils/vault-kind'
import { staggerContainer, staggerItem } from '@/lib/constants/motion'
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
      } as Parameters<typeof writer.writeContractAsync>[0])
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
        description: err instanceof Error ? err.message.split('\n')[0] : 'Transaction rejected or reverted.',
      })
    }
  }

  return (
    <motion.div
      variants={staggerItem}
      className="flex flex-col gap-4 p-5 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-md shadow-sm hover:border-primary/20 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-primary/8 text-primary">
            <Zap className="size-4" />
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

      {vault.isCl && vault.clDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-border/20 text-xs">
          {[
            ['V4 Pool Manager', `${vault.clDetails.poolManager.slice(0, 6)}...${vault.clDetails.poolManager.slice(-4)}`],
            ['Position Manager', `${vault.clDetails.positionManager.slice(0, 6)}...${vault.clDetails.positionManager.slice(-4)}`],
            ['Pool Fee Tier', vault.clDetails.feeTier],
            ['Tick Spacing', String(vault.clDetails.tickSpacing)],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 p-2.5 rounded-xl bg-white/[0.015] border border-border/30">
              <span className="text-muted-foreground text-[10px] uppercase font-bold">{label}</span>
              <span className="font-mono text-foreground font-semibold text-[11px] truncate">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
        {vault.isCl && (
          <Button
            size="sm"
            onClick={() => handleAction('rebalance')}
            disabled={writer.isPending}
            className="text-xs h-9 px-4 gap-1.5 font-bold"
          >
            <Zap className="size-3.5" /> Execute v4 Rebalance
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('harvest')}
          disabled={writer.isPending}
          className="text-xs h-9 px-4 gap-1.5 font-semibold"
        >
          Harvest & Compound
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction('tend')}
          disabled={writer.isPending}
          className="text-xs h-9 px-3 text-muted-foreground hover:text-foreground font-medium sm:ml-auto"
        >
          Tend Position
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
  const kind = getVaultKind(vault)

  const stats = [
    {
      label: 'Est. APY',
      value:
        snapshot?.apyAvailable && snapshot.apy !== undefined
          ? `${snapshot.apy.toFixed(2)}%`
          : 'Unavailable',
      icon: Gauge,
      numeric: false,
    },
    {
      label: 'Total assets',
      value: isLoading ? null : tvl,
      icon: WalletCards,
      numeric: true,
      suffix: ` ${vault.assetSymbol}`,
    },
    {
      label: 'Share price',
      value: snapshot?.pricePerShare ?? 1,
      icon: Info,
      numeric: true,
      format: (n: number) => n.toFixed(4),
      suffix: ` ${vault.assetSymbol}`,
    },
    {
      label: 'Risk profile',
      value: vault.risk,
      icon: ShieldCheck,
      numeric: false,
    },
  ]

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full border-b border-border/40 bg-gradient-to-b from-white/[0.02] to-transparent px-4 sm:px-6 md:px-12 lg:px-16 py-10 md:py-12 overflow-hidden">
        <VaultStrategyVisual kind={kind} className="absolute right-8 top-8 hidden w-48 opacity-30 lg:block" />

        <div className="relative flex flex-col gap-5 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="size-3.5" /> All Strategy Vaults
          </Link>

          <motion.div
            layoutId={`vault-card-${vault.address}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between w-full"
          >
            <div className="flex flex-col gap-3 max-w-3xl">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center gap-2"
              >
                {[
                  snapshot?.paused ? 'Paused' : 'Active',
                  `${vault.risk.toUpperCase()} RISK`,
                  'ERC-4626',
                  ...(vault.isCl ? ['Uniswap v4 CL'] : []),
                ].map((badge) => (
                  <motion.span
                    key={badge}
                    variants={staggerItem}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      badge.includes('CL')
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : badge === 'Active'
                          ? 'bg-white/[0.03] border-border/50 text-foreground'
                          : 'bg-white/[0.02] border-border/40 text-muted-foreground'
                    }`}
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground"
              >
                {vault.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {vault.description}
              </motion.p>
            </div>
            <motion.a
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              href={explorerAddressUrl(vault.address)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground border border-border/50 rounded-2xl px-4 py-2.5 bg-card/40 hover:border-primary/20 transition-all w-fit shrink-0"
            >
              Vault: {vault.address.slice(0, 8)}...{vault.address.slice(-6)}{' '}
              <ExternalLink className="size-3 text-primary" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex min-w-0 flex-col gap-6 sm:gap-8"
          >
            {/* Stats row */}
            <motion.section variants={staggerItem} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ label, value, icon: Icon, numeric, format, suffix }) => (
                <div
                  key={label}
                  className="p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm flex flex-col gap-1.5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
                    <Icon className="size-3.5 text-primary" aria-hidden />
                  </div>
                  <strong className="text-sm sm:text-base font-extrabold text-foreground font-mono tabular capitalize">
                    {numeric && typeof value === 'number' ? (
                      <>
                        <AnimatedNumber
                          value={value}
                          format={format ?? ((n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 }))}
                          highlightOnChange
                        />
                        {suffix}
                      </>
                    ) : value === null ? (
                      'Loading...'
                    ) : (
                      String(value)
                    )}
                  </strong>
                </div>
              ))}
            </motion.section>

            {/* Strategy-specific visuals */}
            {kind === 'cl' && <motion.div variants={staggerItem}><ClRangeVisual /></motion.div>}
            {kind === 'growth' && (
              <motion.div variants={staggerItem}>
                <GrowthPortfolioVisual assetSymbol={vault.assetSymbol} />
              </motion.div>
            )}
            {kind === 'core' && (
              <motion.div variants={staggerItem} className="rounded-2xl border border-border/40 bg-card/20 p-4">
                <CompoundingVisual />
              </motion.div>
            )}

            <StrategyControls vault={vault} />

            <motion.div
              variants={staggerItem}
              className="p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Vault Performance (30D)</h3>
                  <p className="text-xs text-muted-foreground">Illustrative history only — not live protocol APY/TVL.</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono border border-border/50 bg-white/[0.02] text-muted-foreground font-bold">
                  30D
                </span>
              </div>
              <PerformanceChart address={vault.address} currentTvl={tvl} />
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Capacity & Architecture</h3>
                <p className="text-xs text-muted-foreground">How this vault deploys and compounds deposited capital.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-muted-foreground font-semibold">Capacity used</span>
                  <span className="tabular font-mono text-foreground font-bold">
                    {cap ? `${capacity.toFixed(1)}%` : 'Unlimited / No Cap Data'}
                  </span>
                </div>
                <Progress value={capacity} className="h-2" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Strategy', vault.strategyLabel],
                  ['Underlying Asset', vault.assetSymbol],
                  ['Protocol Integration', vault.protocolLabel || 'Index Finance'],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-xl border border-border/40 bg-white/[0.015] p-3 flex flex-col gap-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{label}</p>
                    <p className="font-semibold text-xs text-foreground truncate">{val}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="lg:sticky lg:top-20 h-fit"
          >
            <VaultActionPanel vault={vault} paused={snapshot?.paused} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
