'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VaultKind } from '@/lib/utils/vault-kind'
import { fadeVariants, staggerContainerFast, staggerItem } from '@/lib/constants/motion'

interface FlowStep {
  label: string
  sublabel?: string
}

function getDepositFlow(kind: VaultKind, assetSymbol: string): FlowStep[] {
  switch (kind) {
    case 'cl':
      return [
        { label: assetSymbol },
        { label: 'Swap', sublabel: 'Asset conversion' },
        { label: `${assetSymbol} + Paired`, sublabel: 'Dual-sided' },
        { label: 'V4 Liquidity Position', sublabel: 'Concentrated range' },
      ]
    case 'growth':
      return [
        { label: assetSymbol },
        { label: 'Growth Strategy', sublabel: 'Dynamic allocation' },
        { label: `${assetSymbol} + Retained Assets`, sublabel: 'Portfolio basket' },
      ]
    default:
      return [
        { label: assetSymbol },
        { label: 'Vault', sublabel: 'ERC-4626 custody' },
        { label: 'Strategy', sublabel: 'Auto-compounding' },
        { label: 'Deployed Capital', sublabel: 'Earning yield' },
      ]
  }
}

function getWithdrawFlow(kind: VaultKind, assetSymbol: string, inKind: boolean): FlowStep[] {
  if (inKind && kind === 'growth') {
    return [
      { label: 'Portfolio', sublabel: 'Strategy holdings' },
      { label: assetSymbol, sublabel: 'Primary asset' },
      { label: 'Retained Assets', sublabel: 'Equity basket' },
      { label: 'Wallet', sublabel: 'In-kind delivery' },
    ]
  }
  return [
    { label: 'Vault', sublabel: 'Share redemption' },
    { label: 'Strategy', sublabel: 'Position unwind' },
    { label: 'Position', sublabel: 'Capital release' },
    { label: 'Wallet', sublabel: assetSymbol },
  ]
}

interface CapitalFlowDiagramProps {
  mode: 'deposit' | 'withdraw'
  vaultKind: VaultKind
  assetSymbol: string
  inKind?: boolean
  active?: boolean
  amount?: string
  className?: string
}

export function CapitalFlowDiagram({
  mode,
  vaultKind,
  assetSymbol,
  inKind = false,
  active = false,
  amount,
  className,
}: CapitalFlowDiagramProps) {
  const steps =
    mode === 'deposit'
      ? getDepositFlow(vaultKind, assetSymbol)
      : getWithdrawFlow(vaultKind, assetSymbol, inKind)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${mode}-${inKind}-${vaultKind}`}
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={cn(
          'rounded-xl border border-border/40 bg-white/[0.015] p-3 transition-opacity',
          active ? 'opacity-100' : 'opacity-60',
          className,
        )}
      >
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {mode === 'deposit' ? 'Capital Deployment' : 'Capital Return'}
        </p>
        <div className="flex flex-col items-center gap-0.5">
          {steps.map((step, i) => (
            <motion.div key={step.label} variants={staggerItem} className="flex flex-col items-center w-full">
              <div
                className={cn(
                  'w-full rounded-lg border px-3 py-2 text-center transition-colors',
                  i === 0 && amount && active
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border/30 bg-white/[0.02]',
                )}
              >
                <span className="text-xs font-semibold text-foreground font-mono">
                  {i === 0 && amount && active ? `${amount} ${step.label}` : step.label}
                </span>
                {step.sublabel && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{step.sublabel}</p>
                )}
              </div>
              {i < steps.length - 1 && (
                <motion.div variants={fadeVariants} className="py-0.5 text-primary/40">
                  <ArrowDown className="size-3" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
