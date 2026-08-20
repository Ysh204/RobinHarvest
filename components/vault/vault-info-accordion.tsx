'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Flame,
  Info,
  Layers,
  Shield,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import type { VaultConfig } from '@/config/contracts'
import { explorerAddressUrl } from '@/config/chain'
import { StrategyEngineVisual } from './strategy-engine-visual'
import { RiskScoreCard } from './risk-score-card'
import { StrategyHealthMatrix } from './strategy-health-matrix'

interface SectionState {
  [key: string]: boolean
}

export function VaultInfoAccordion({ vault }: { vault: VaultConfig }) {
  // Start completely collapsed by default so the user explicitly taps to expand details
  const [openSections, setOpenSections] = useState<SectionState>({})

  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const vaultParams = [
    { label: 'Underlying Asset', value: vault.assetSymbol },
    { label: 'Vault Token', value: vault.shareSymbol },
    { label: 'Compounding', value: vault.compounding },
    { label: 'Reward Source', value: vault.rewardSource },
    ...(vault.rewardFrequency ? [{ label: 'Reward Frequency', value: vault.rewardFrequency }] : []),
    { label: 'Suitable For', value: vault.suitableFor },
    { label: 'Performance Fee', value: vault.performanceFee },
  ]

  const sections = [
    'Vault Info',
    'Strategy Engine',
    'Risk Score',
    ...(vault.isCl ? ['Strategy Details'] : []),
    'More Info & Telemetry',
  ]

  return (
    <div className="flex flex-col gap-3 w-full">
      {sections.map((title) => {
        const isOpen = Boolean(openSections[title])

        return (
          <div
            key={title}
            className={`rounded-2xl border transition-all duration-300 backdrop-blur-sm overflow-hidden ${
              isOpen
                ? 'border-primary/30 bg-card/60 shadow-sm'
                : 'border-border/50 bg-card/40 hover:border-border/80 hover:bg-card/50'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection(title)}
              className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors select-none group"
            >
              <div className="flex items-center gap-2.5">
                {title === 'Vault Info' && (
                  <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-primary/15 text-primary' : 'bg-white/[0.04] text-muted-foreground group-hover:text-foreground'}`}>
                    <Info className="size-4" />
                  </div>
                )}
                {title === 'Strategy Engine' && (
                  <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-warning/15 text-warning' : 'bg-white/[0.04] text-muted-foreground group-hover:text-foreground'}`}>
                    <Zap className="size-4" />
                  </div>
                )}
                {title === 'Risk Score' && (
                  <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-accent/15 text-accent' : 'bg-white/[0.04] text-muted-foreground group-hover:text-foreground'}`}>
                    <Shield className="size-4" />
                  </div>
                )}
                {title === 'Strategy Details' && (
                  <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-primary/15 text-primary' : 'bg-white/[0.04] text-muted-foreground group-hover:text-foreground'}`}>
                    <Layers className="size-4" />
                  </div>
                )}
                {title === 'More Info & Telemetry' && (
                  <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-primary/15 text-primary' : 'bg-white/[0.04] text-muted-foreground group-hover:text-foreground'}`}>
                    <Flame className="size-4" />
                  </div>
                )}
                <span className={`text-sm font-bold tracking-wider uppercase transition-colors ${isOpen ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {title}
                </span>
              </div>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-300 ease-out ${
                  isOpen ? 'rotate-180 text-primary' : 'group-hover:text-foreground'
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.25, delay: 0.05 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-2 border-t border-border/20">
                    {/* 1. Vault Info */}
                    {title === 'Vault Info' && (
                      <div className="flex flex-col gap-4 pt-1">
                        <p className="text-xs text-muted-foreground leading-relaxed">{vault.description}</p>
                        <div className="flex flex-col divide-y divide-border/25 text-xs">
                          {vaultParams.map((item) => (
                            <div key={item.label} className="flex justify-between items-start py-2.5 gap-4">
                              <span className="text-muted-foreground font-semibold shrink-0">{item.label}</span>
                              <span className="font-mono text-foreground font-medium text-right leading-snug">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Strategy Engine */}
                    {title === 'Strategy Engine' && <StrategyEngineVisual vault={vault} />}

                    {/* 3. Risk Score */}
                    {title === 'Risk Score' && <RiskScoreCard vault={vault} />}

                    {/* 4. Strategy Details (CL) */}
                    {title === 'Strategy Details' && vault.isCl && vault.clDetails && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                        <div className="p-3 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Protocol</span>
                          <span className="font-semibold text-foreground">Uniswap v4</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Paired Token</span>
                          <span className="font-semibold text-foreground">ETH / USDG</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Fee Tier</span>
                          <span className="font-mono font-semibold text-foreground">{vault.clDetails.feeTier}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Tick Spacing</span>
                          <span className="font-mono font-semibold text-foreground">{vault.clDetails.tickSpacing}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Position Status</span>
                          <span className="font-semibold text-primary">Active & In Range</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.015] border border-border/25 flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Architecture</span>
                          <span className="font-semibold text-foreground">EIP-1153 Transient</span>
                        </div>
                      </div>
                    )}

                    {/* 5. More Info & Telemetry */}
                    {title === 'More Info & Telemetry' && (
                      <div className="flex flex-col gap-5 pt-1">
                        {/* Contract Addresses */}
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { label: 'Vault Contract', address: vault.address, key: 'vault' },
                            { label: 'Strategy Contract', address: vault.strategy, key: 'strategy' },
                            { label: 'Underlying Asset', address: vault.asset, key: 'asset' },
                          ].map((contract) => (
                            <div
                              key={contract.label}
                              className="p-3.5 rounded-xl bg-white/[0.015] border border-border/30 flex flex-col gap-1.5"
                            >
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                {contract.label}
                              </span>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs text-foreground font-semibold">
                                  {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(contract.address, contract.key)}
                                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
                                    title="Copy Address"
                                  >
                                    {copiedKey === contract.key ? (
                                      <Check className="size-3.5 text-primary" />
                                    ) : (
                                      <Copy className="size-3.5" />
                                    )}
                                  </button>
                                  <a
                                    href={explorerAddressUrl(contract.address)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/[0.06] transition-colors"
                                    title="View on Explorer"
                                  >
                                    <ExternalLink className="size-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.015] border border-border/20">
                          <span className="text-muted-foreground font-medium">Deployed On</span>
                          <span className="font-mono font-bold text-foreground">{vault.deployedDate}</span>
                        </div>

                        {/* Health Matrix */}
                        <StrategyHealthMatrix vault={vault} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
