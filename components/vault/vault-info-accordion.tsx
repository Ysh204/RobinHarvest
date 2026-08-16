'use client'

import { useState } from 'react'
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
  const [openSections, setOpenSections] = useState<SectionState>({
    'Vault Info': true,
    'Strategy Engine': true,
    'Risk Score': true,
    'Strategy Details': true,
    'More Info & Telemetry': true,
  })

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
        const isOpen = openSections[title] ?? true

        return (
          <div
            key={title}
            className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-200 hover:border-border/80"
          >
            <button
              type="button"
              onClick={() => toggleSection(title)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {title === 'Vault Info' && <Info className="size-4 text-primary" />}
                {title === 'Strategy Engine' && <Zap className="size-4 text-warning" />}
                {title === 'Risk Score' && <Shield className="size-4 text-accent" />}
                {title === 'Strategy Details' && <Layers className="size-4 text-primary" />}
                {title === 'More Info & Telemetry' && <Flame className="size-4 text-primary" />}
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</span>
              </div>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 border-t border-border/20">
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
            )}
          </div>
        )
      })}
    </div>
  )
}
